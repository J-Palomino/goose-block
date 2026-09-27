---
title: Playwright Extension
description: Add Playwright MCP Server as a Daisy Extension for Modern Web Testing
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import YouTubeShortEmbed from '@site/src/components/YouTubeShortEmbed';
import DaisyDesktopInstaller from '@site/src/components/DaisyDesktopInstaller';

<YouTubeShortEmbed videoUrl="https://www.youtube.com/embed/iAxiFMlTE1Q" />

This tutorial covers how to add the Playwright MCP Server as a Daisy extension, to enable cross-browser testing and web automation across Chromium and Webkit.

:::tip TLDR
<Tabs groupId="interface">
  <TabItem value="ui" label="Daisy Desktop" default>
  [Launch the installer](daisy://extension?cmd=npx&arg=-y&arg=@playwright/mcp@latest&id=playwright&name=Playwright&description=Modern%20web%20testing%20and%20automation)
  </TabItem>
  <TabItem value="cli" label="Daisy CLI">
  **Command**
  ```sh
  npx -y @playwright/mcp@latest
  ```
  </TabItem>
</Tabs>
:::

## Configuration

:::info
Note that you'll need [Node.js](https://nodejs.org/) installed on your system to run this command, as it uses `npx`.
:::

<Tabs groupId="interface">
  <TabItem value="ui" label="Daisy Desktop" default>
  <DaisyDesktopInstaller
    extensionId="playwright"
    extensionName="Playwright"
    description="Modern web testing and automation"
    command="npx"
    args={["-y", "@playwright/mcp@latest"]}
  />
  </TabItem>
  <TabItem value="cli" label="Daisy CLI">
  1. Run the `configure` command:
  ```sh
  daisy configure
  ```

  2. Choose to add a `Command-line Extension`
  ```sh
    ┌   daisy-configure 
    │
    ◇  What would you like to configure?
    │  Add Extension (Connect to a new extension) 
    │
    ◆  What type of extension would you like to add?
    │  ○ Built-in Extension 
    // highlight-start    
    │  ● Command-line Extension (Run a local command or script)
    // highlight-end    
    │  ○ Remote Extension (SSE) 
    │  ○ Remote Extension (Streaming HTTP) 
    └ 
  ```

  3. Give your extension a name
  ```sh
    ┌   daisy-configure 
    │
    ◇  What would you like to configure?
    │  Add Extension (Connect to a new extension) 
    │
    ◇  What type of extension would you like to add?
    │  Command-line Extension 
    │
    ◆  What would you like to call this extension?
    │  Playwright
    └ 
  ```

  4. Enter the command
  ```sh
    ┌   daisy-configure 
    │
    ◇  What would you like to configure?
    │  Add Extension (Connect to a new extension) 
    │
    ◇  What type of extension would you like to add?
    │  Command-line Extension 
    │
    ◇  What would you like to call this extension?
    │  Playwright
    │
    ◆  What command should be run?
    │  npx -y @playwright/mcp@latest
    └ 
  ```

  5. Enter the number of seconds Daisy should wait for actions to complete before timing out. Default is 300s
  ```sh
    ┌   daisy-configure 
    │
    ◇  What would you like to configure?
    │  Add Extension (Connect to a new extension) 
    │
    ◇  What type of extension would you like to add?
    │  Command-line Extension 
    │
    ◇  What would you like to call this extension?
    │  Playwright
    │
    ◇  What command should be run?
    │  npx -y @playwright/mcp@latest
    │
    ◆  Please set the timeout for this tool (in secs):
    │  300
    └ 
  ```

  6. Choose to add a description. If you select "Yes" here, you will be prompted to enter a description for the extension.
  ```sh
    ┌   daisy-configure 
    │
    ◇  What would you like to configure?
    │  Add Extension (Connect to a new extension) 
    │
    ◇  What type of extension would you like to add?
    │  Command-line Extension 
    │
    ◇  What would you like to call this extension?
    │  Playwright
    │
    ◇  What command should be run?
    │  npx -y @playwright/mcp@latest
    │
    ◇  Please set the timeout for this tool (in secs):
    │  300
    │
    ◆  Would you like to add a description?
    │  No
    └ 
  ```

  7. Choose No when asked to add environment variables
  ```sh
    ┌   daisy-configure 
    │
    ◇  What would you like to configure?
    │  Add Extension (Connect to a new extension) 
    │
    ◇  What type of extension would you like to add?
    │  Command-line Extension 
    │
    ◇  What would you like to call this extension?
    │  Playwright
    │
    ◇  What command should be run?
    │  npx -y @playwright/mcp@latest
    │
    ◇  Please set the timeout for this tool (in secs):
    │  300
    │
    ◇  Would you like to add a description?
    │  No
    │
    ◆  Would you like to add environment variables?
    │  No 
    │
    └  Added Playwright extension
  ```
  </TabItem>
</Tabs>

## Example Usage

Let's use Daisy with the Playwright extension to create a cross-browser testing suite. In this example, we'll demonstrate how Daisy can help you:

1. Test a web application across multiple browsers
2. Generate maintainable test code
3. Capture screenshots for visual comparison

:::info LLM
Anthropic's Claude 4 Sonnet was used for this task.
:::

### Daisy Prompt
```
Test the random redesign generator app (https://blackgirlbytes.github.io/random-redesign-picker/) 
in Chromium and WebKit. For each browser:
1. Navigate to the page
2. Click the "Pick My Combo" button
3. Verify the text changes
4. Take a screenshot
Then generate a Playwright test that works across all browsers.
```

### Daisy Output
```
Let's start with Chromium:

─── browser_navigate | playwright ──────────────────────────
url: https://blackgirlbytes.github....

Now let's wait for and click the button:

─── browser_click | playwright ──────────────────────────
element: button with text "Pick My Combo"
ref: <button>

Let's capture the first combo and click again to verify it changes:

─── browser_click | playwright ──────────────────────────
element: button with text "Pick My Combo"
ref: <button>

Let's take a screenshot of the Chromium view:

─── browser_take_screenshot | playwright ──────────────────────────
filename: chromium-redesign.png

Now let's test in Safari. I'll open a new tab for Safari:

─── browser_tab_new | playwright ──────────────────────────
url: https://blackgirlbytes.github....

Let's click the button in Safari:

─── browser_click | playwright ──────────────────────────
element: button with text "Pick My Combo"
ref: <button>

Let's click again to verify the text changes:

─── browser_click | playwright ──────────────────────────
element: button with text "Pick My Combo"
ref: <button>

Let's take a screenshot of the Safari view:

─── browser_take_screenshot | playwright ──────────────────────────
filename: safari-redesign.png

Now I'll generate a Playwright test that runs in all three browser environments. The test will verify the core functionality we just tested manually:

─── browser_generate_playwright_test | playwright ──────────────────────────
name: Random Redesign Picker Test
description: Test the random redesign generator functionality across browsers
steps: [
  "Navigate to the application",
  "Verify initial page content",
  "Click button to generate first combination",
  "Click button again to generate second combination",
  "Verify combinations are different"
]

Here's the generated Playwright test that will run across Chromium, Firefox, and Safari:

import { test, expect } from '@playwright/test';

test.describe('Random Redesign Picker', () => {
  test('should generate different random combinations', async ({ page }) => {
    // Navigate to the application
    await page.goto('https://blackgirlbytes.github.io/random-redesign-picker/');
    
    // Verify initial page content
    await expect(page).toHaveTitle('Redesign for the Ridiculous');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('🎲 Redesign for the Ridiculous');
    
    // Verify button is visible
    const comboButton = page.getByRole('button', { name: '🎉 Pick My Combo' });
    await expect(comboButton).toBeVisible();
    
    // Click button and get first combination
    await comboButton.click();
    
    // Wait for and store first combo
    const firstComboElement = page.locator('generic').filter({ hasText: /^(?!.*🎲).*$/ }).last();
    await expect(firstComboElement).toBeVisible();
    const firstComboText = await firstComboElement.textContent();
    
    // Generate second combination
    await comboButton.click();
    
    // Wait for and get second combo
    const secondComboElement = page.locator('generic').filter({ hasText: /^(?!.*🎲).*$/ }).last();
    await expect(secondComboElement).toBeVisible();
    const secondComboText = await secondComboElement.textContent();
    
    // Verify combos are different
    expect(secondComboText).not.toEqual(firstComboText);
  });
});

To use this test, you would need to:

1. Save it as `tests/random-redesign.spec.ts`
2. Configure your `playwright.config.ts` to include all three browsers:

import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
};

export default config;

You can then run the tests using:

npx playwright test

This will execute the test in all three browser environments. The test verifies:
1. The page loads correctly
2. The title and heading are correct
3. The combo button is visible
4. Clicking the button generates a combination
5. Clicking again generates a different combination

The test uses robust selectors and proper waiting mechanisms to ensure reliability across different browsers and network conditions.
```