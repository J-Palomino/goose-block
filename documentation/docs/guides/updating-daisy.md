---
sidebar_position: 5
title: Updating Daisy
sidebar_label: Updating Daisy
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import MacDesktopInstallButtons from '@site/src/components/MacDesktopInstallButtons';
import WindowsDesktopInstallButtons from '@site/src/components/WindowsDesktopInstallButtons';
import LinuxDesktopInstallButtons from '@site/src/components/LinuxDesktopInstallButtons';

The Daisy CLI and desktop apps are under active and continuous development. To get the newest features and fixes, you should periodically update your Daisy client using the following instructions.

<Tabs>
  <TabItem value="mac" label="macOS" default>
    <Tabs groupId="interface">
      <TabItem value="ui" label="Daisy Desktop" default>
        :::info
        To update Daisy to the latest stable version, reinstall using the instructions below
        :::
        <div style={{ marginTop: '1rem' }}>
          1. <MacDesktopInstallButtons/>
          2. Unzip the downloaded zip file.
          3. Run the executable file to launch the Daisy Desktop application.
          4. Overwrite the existing Daisy application with the new version.
          5. Run the executable file to launch the Daisy desktop application.
        </div>
      </TabItem>
      <TabItem value="cli" label="Daisy CLI">
        You can update Daisy by running:

        ```sh
        daisy update
        ```

        Additional [options](/docs/guides/daisy-cli-commands#update-options):
        
        ```sh
        # Update to latest canary (development) version
        daisy update --canary

        # Update and reconfigure settings
        daisy update --reconfigure
        ```

        Or you can run the [installation](/docs/getting-started/installation) script again:

        ```sh
        curl -fsSL https://github.com/block/daisy/releases/download/stable/download_cli.sh | CONFIGURE=false bash
        ```

        To check your current Daisy version, use the following command:

        ```sh
        daisy --version
        ```
      </TabItem>
    </Tabs>
  </TabItem>

  <TabItem value="linux" label="Linux">
    <Tabs groupId="interface">
      <TabItem value="ui" label="Daisy Desktop" default>
        :::info
        To update Daisy to the latest stable version, reinstall using the instructions below
        :::
        <div style={{ marginTop: '1rem' }}>
          1. <LinuxDesktopInstallButtons/>
          
          **For Debian/Ubuntu-based distributions:**
          2. Download the DEB file
          3. Navigate to the directory where it is saved in a terminal
          4. Run `sudo dpkg -i (filename).deb`
          5. Launch Daisy from the app menu

        </div>
      </TabItem>
      <TabItem value="cli" label="Daisy CLI">
        You can update Daisy by running:

        ```sh
        daisy update
        ```

        Additional [options](/docs/guides/daisy-cli-commands#update-options):
        
        ```sh
        # Update to latest canary (development) version
        daisy update --canary

        # Update and reconfigure settings
        daisy update --reconfigure
        ```

        Or you can run the [installation](/docs/getting-started/installation) script again:

        ```sh
        curl -fsSL https://github.com/block/daisy/releases/download/stable/download_cli.sh | CONFIGURE=false bash
        ```

        To check your current Daisy version, use the following command:

        ```sh
        daisy --version
        ```
      </TabItem>
    </Tabs>
  </TabItem>

  <TabItem value="windows" label="Windows">
    <Tabs groupId="interface">
      <TabItem value="ui" label="Daisy Desktop" default>
        :::info
        To update Daisy to the latest stable version, reinstall using the instructions below
        :::
        <div style={{ marginTop: '1rem' }}>
          1. <WindowsDesktopInstallButtons/>
          2. Unzip the downloaded zip file.
          3. Run the executable file to launch the Daisy Desktop application.
          4. Overwrite the existing Daisy application with the new version.
          5. Run the executable file to launch the Daisy Desktop application.
        </div>
      </TabItem>
      <TabItem value="cli" label="Daisy CLI">
        You can update Daisy by running:

        ```sh
        daisy update
        ```

        Additional [options](/docs/guides/daisy-cli-commands#update-options):
        
        ```sh
        # Update to latest canary (development) version
        daisy update --canary

        # Update and reconfigure settings
        daisy update --reconfigure
        ```

        Or you can run the [installation](/docs/getting-started/installation) script again in **Git Bash**, **MSYS2**, or **PowerShell** to update the Daisy CLI natively on Windows:

        ```bash
        curl -fsSL https://github.com/block/daisy/releases/download/stable/download_cli.sh | CONFIGURE=false bash
        ```
        
        To check your current Daisy version, use the following command:

        ```sh
        daisy --version
        ```        

        <details>
        <summary>Update via Windows Subsystem for Linux (WSL)</summary>

        To update your WSL installation, use `daisy update` or run the installation script again via WSL:

        ```sh
        curl -fsSL https://github.com/block/daisy/releases/download/stable/download_cli.sh | CONFIGURE=false bash
        ```

       </details>
      </TabItem>
    </Tabs>
  </TabItem>
</Tabs>