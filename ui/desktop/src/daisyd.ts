import { spawn, ChildProcess } from 'child_process';
import { createServer } from 'net';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { getBinaryPath } from './utils/pathUtils';
import log from './utils/logger';
import { App } from 'electron';
import { Buffer } from 'node:buffer';

import { status } from './api';
import { client } from './api/client.gen';

// Find an available port to start daisyd on
export const findAvailablePort = (): Promise<number> => {
  return new Promise((resolve, _reject) => {
    const server = createServer();

    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as { port: number };
      server.close(() => {
        log.info(`Found available port: ${port}`);
        resolve(port);
      });
    });
  });
};

// Daisy process manager. Take in the app, port, and directory to start daisyd in.
// Check if daisyd server is ready by polling the status endpoint
const checkServerStatus = async (): Promise<boolean> => {
  const interval = 100;
  const maxAttempts = 200;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await status({ throwOnError: true });
      return true;
    } catch {
      if (attempt === maxAttempts) {
        log.error(`Server failed to respond after ${(interval * maxAttempts) / 1000} seconds`);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  return false;
};

const connectToExternalBackend = async (
  workingDir: string,
  port: number = 3000
): Promise<[number, string, ChildProcess]> => {
  log.info(`Using external daisyd backend on port ${port}`);

  const isReady = await checkServerStatus();
  if (!isReady) {
    throw new Error(`External daisyd server not accessible on port ${port}`);
  }

  const mockProcess = {
    pid: undefined,
    kill: () => {
      log.info(`Not killing external process that is managed externally`);
    },
  } as ChildProcess;

  return [port, workingDir, mockProcess];
};

interface DaisyProcessEnv {
  [key: string]: string | undefined;

  HOME: string;
  USERPROFILE: string;
  APPDATA: string;
  LOCALAPPDATA: string;
  PATH: string;
  DAISY_PORT: string;
  DAISY_SERVER__SECRET_KEY?: string;
}

export const startDaisyd = async (
  app: App,
  serverSecret: string,
  dir: string | null = null,
  env: Partial<DaisyProcessEnv> = {}
): Promise<[number, string, ChildProcess]> => {
  const homeDir = os.homedir();
  const isWindows = process.platform === 'win32';

  if (!dir) {
    dir = homeDir;
  }

  dir = path.resolve(path.normalize(dir));

  if (process.env.DAISY_EXTERNAL_BACKEND) {
    return connectToExternalBackend(dir, 3000);
  }

  // Validate that the directory actually exists and is a directory
  try {
    const stats = fs.lstatSync(dir);

    // Reject symlinks for security - they could point outside intended directories
    if (stats.isSymbolicLink()) {
      log.warn(`Provided path is a symlink, falling back to home directory for security`);
      dir = homeDir;
    } else if (!stats.isDirectory()) {
      log.warn(`Provided path is not a directory, falling back to home directory`);
      dir = homeDir;
    }
  } catch {
    log.warn(`Directory does not exist, falling back to home directory`);
    dir = homeDir;
  }

  // Security check: Ensure the directory path doesn't contain suspicious characters
  if (dir.includes('..') || dir.includes(';') || dir.includes('|') || dir.includes('&')) {
    throw new Error(`Invalid directory path: ${dir}`);
  }

  // Get the daisyd binary path using the shared utility
  let daisydPath = getBinaryPath(app, 'daisyd');

  // Security validation: Ensure the binary path is safe
  const resolvedDaisydPath = path.resolve(daisydPath);

  // Validate that the binary path doesn't contain suspicious characters or sequences
  if (
    resolvedDaisydPath.includes('..') ||
    resolvedDaisydPath.includes(';') ||
    resolvedDaisydPath.includes('|') ||
    resolvedDaisydPath.includes('&') ||
    resolvedDaisydPath.includes('`') ||
    resolvedDaisydPath.includes('$')
  ) {
    throw new Error(`Invalid binary path detected: ${resolvedDaisydPath}`);
  }

  // Ensure the binary path is within expected application directories
  const appPath = app.getAppPath();
  const resourcesPath = process.resourcesPath;
  const currentWorkingDir = process.cwd();

  const isValidPath =
    resolvedDaisydPath.startsWith(path.resolve(appPath)) ||
    resolvedDaisydPath.startsWith(path.resolve(resourcesPath)) ||
    resolvedDaisydPath.startsWith(path.resolve(currentWorkingDir));

  if (!isValidPath) {
    throw new Error(`Binary path is outside of allowed directories: ${resolvedDaisydPath}`);
  }

  const port = await findAvailablePort();

  log.info(`Starting daisyd from: ${resolvedDaisydPath} on port ${port} in dir ${dir}`);

  // Define additional environment variables
  const additionalEnv: DaisyProcessEnv = {
    // Set HOME for UNIX-like systems
    HOME: homeDir,
    // Set USERPROFILE for Windows
    USERPROFILE: homeDir,
    // Set APPDATA for Windows
    APPDATA: process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'),
    // Set LOCAL_APPDATA for Windows
    LOCALAPPDATA: process.env.LOCALAPPDATA || path.join(homeDir, 'AppData', 'Local'),
    // Set PATH to include the binary directory
    PATH: `${path.dirname(resolvedDaisydPath)}${path.delimiter}${process.env.PATH || ''}`,
    // start with the port specified
    DAISY_PORT: String(port),
    DAISY_SERVER__SECRET_KEY: serverSecret,
    // Add any additional environment variables passed in
    ...env,
  } as DaisyProcessEnv;

  // Merge parent environment with additional environment variables
  const processEnv: DaisyProcessEnv = { ...process.env, ...additionalEnv } as DaisyProcessEnv;

  // Add detailed logging for troubleshooting
  log.info(`Process platform: ${process.platform}`);
  log.info(`Process cwd: ${process.cwd()}`);
  log.info(`Target working directory: ${dir}`);
  log.info(`Environment HOME: ${processEnv.HOME}`);
  log.info(`Environment USERPROFILE: ${processEnv.USERPROFILE}`);
  log.info(`Environment APPDATA: ${processEnv.APPDATA}`);
  log.info(`Environment LOCALAPPDATA: ${processEnv.LOCALAPPDATA}`);
  log.info(`Environment PATH: ${processEnv.PATH}`);

  // Ensure proper executable path on Windows
  if (isWindows && !resolvedDaisydPath.toLowerCase().endsWith('.exe')) {
    daisydPath = resolvedDaisydPath + '.exe';
  } else {
    daisydPath = resolvedDaisydPath;
  }
  log.info(`Binary path resolved to: ${daisydPath}`);

  const spawnOptions = {
    cwd: dir,
    env: processEnv,
    stdio: ['ignore', 'pipe', 'pipe'] as ['ignore', 'pipe', 'pipe'],
    // Hide terminal window on Windows
    windowsHide: true,
    // Run detached on Windows only to avoid terminal windows
    detached: isWindows,
    // Never use shell to avoid command injection - this is critical for security
    shell: false,
  };

  // Log spawn options for debugging (excluding sensitive env vars)
  const safeSpawnOptions = {
    ...spawnOptions,
    env: Object.keys(spawnOptions.env || {}).reduce(
      (acc, key) => {
        if (key.includes('SECRET') || key.includes('PASSWORD') || key.includes('TOKEN')) {
          acc[key] = '[REDACTED]';
        } else {
          acc[key] = spawnOptions.env![key] || '';
        }
        return acc;
      },
      {} as Record<string, string>
    ),
  };
  log.info('Spawn options:', JSON.stringify(safeSpawnOptions, null, 2));

  // Security: Use only hardcoded, safe arguments
  const safeArgs = ['agent']; // Only allow the 'agent' argument

  // Spawn the daisyd process with validated inputs
  const daisydProcess: ChildProcess = spawn(daisydPath, safeArgs, spawnOptions);

  // Only unref on Windows to allow it to run independently of the parent
  if (isWindows && daisydProcess.unref) {
    daisydProcess.unref();
  }

  daisydProcess.stdout?.on('data', (data: Buffer) => {
    log.info(`daisyd stdout for port ${port} and dir ${dir}: ${data.toString()}`);
  });

  daisydProcess.stderr?.on('data', (data: Buffer) => {
    log.error(`daisyd stderr for port ${port} and dir ${dir}: ${data.toString()}`);
  });

  daisydProcess.on('close', (code: number | null) => {
    log.info(`daisyd process exited with code ${code} for port ${port} and dir ${dir}`);
  });

  daisydProcess.on('error', (err: Error) => {
    log.error(`Failed to start daisyd on port ${port} and dir ${dir}`, err);
    throw err; // Propagate the error
  });

  client.setConfig({
    baseUrl: `http://127.0.0.1:${port}`,
    headers: {
      'Content-Type': 'application/json',
      'X-Secret-Key': serverSecret,
    },
  });

  // Wait for the server to be ready
  const isReady = await checkServerStatus();
  log.info(`Daisyd isReady ${isReady}`);

  const try_kill_daisy = () => {
    try {
      if (isWindows) {
        const pid = daisydProcess.pid?.toString() || '0';
        spawn('taskkill', ['/pid', pid, '/T', '/F'], { shell: false });
      } else {
        daisydProcess.kill?.();
      }
    } catch (error) {
      log.error('Error while terminating daisyd process:', error);
    }
  };

  if (!isReady) {
    log.error(`Daisyd server failed to start on port ${port}`);
    try_kill_daisy();
    throw new Error(`Daisyd server failed to start on port ${port}`);
  }

  // Ensure daisyd is terminated when the app quits
  // TODO will need to do it at tab level next
  app.on('will-quit', () => {
    log.info('App quitting, terminating daisyd server');
    try_kill_daisy();
  });

  log.info(`Daisyd server successfully started on port ${port}`);
  return [port, dir, daisydProcess];
};
