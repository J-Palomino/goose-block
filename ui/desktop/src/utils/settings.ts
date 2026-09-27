import { app } from 'electron';
import fs from 'fs';
import path from 'path';

// Types
export interface EnvToggles {
  DAISY_SERVER__MEMORY: boolean;
  DAISY_SERVER__COMPUTER_CONTROLLER: boolean;
}

export type SchedulingEngine = 'builtin-cron' | 'temporal';

export interface Settings {
  envToggles: EnvToggles;
  showMenuBarIcon: boolean;
  showDockIcon: boolean;
  schedulingEngine: SchedulingEngine;
  enableWakelock: boolean;
}

// Constants
const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');

const defaultSettings: Settings = {
  envToggles: {
    DAISY_SERVER__MEMORY: false,
    DAISY_SERVER__COMPUTER_CONTROLLER: false,
  },
  showMenuBarIcon: true,
  showDockIcon: true,
  schedulingEngine: 'builtin-cron',
  enableWakelock: false,
};

// Settings management
export function loadSettings(): Settings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return defaultSettings;
}

export function saveSettings(settings: Settings): void {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// Environment management
export function updateEnvironmentVariables(envToggles: EnvToggles): void {
  if (envToggles.DAISY_SERVER__MEMORY) {
    process.env.DAISY_SERVER__MEMORY = 'true';
  } else {
    delete process.env.DAISY_SERVER__MEMORY;
  }

  if (envToggles.DAISY_SERVER__COMPUTER_CONTROLLER) {
    process.env.DAISY_SERVER__COMPUTER_CONTROLLER = 'true';
  } else {
    delete process.env.DAISY_SERVER__COMPUTER_CONTROLLER;
  }
}

export function updateSchedulingEngineEnvironment(schedulingEngine: SchedulingEngine): void {
  // Set DAISY_SCHEDULER_TYPE based on the scheduling engine setting
  if (schedulingEngine === 'temporal') {
    process.env.DAISY_SCHEDULER_TYPE = 'temporal';
  } else {
    process.env.DAISY_SCHEDULER_TYPE = 'legacy';
  }
}
