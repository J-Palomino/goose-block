---
title: Providing Hints to Daisy
sidebar_position: 7
sidebar_label: Using Daisyhints
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { FolderKey } from 'lucide-react';

`.daisyhints` is a text file used to provide additional context about your project and improve the communication with Daisy. The use of `daisyhints` ensures that Daisy understands your requirements better and can execute tasks more effectively.

<details>
  <summary>Daisy Hints Video Walkthrough</summary>
  <iframe
  class="aspect-ratio"
  src="https://www.youtube.com/embed/kWXJC5p0608"
  title="Daisy Hints"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  ></iframe>
</details>

A good time to consider adding a `.daisyhints` file is when you find yourself repeating prompts, or providing the same kind of instructions multiple times. It's also a great way to provide a lot of context which might be better suited in a file.

This guide will walk you through creating and using `.daisyhints` files to streamline your workflow with custom instructions and context.

:::info Developer extension required
To make use of the hints file, you need to have the `Developer` extension [enabled](/docs/getting-started/using-extensions).
:::

## Creating Your Hints File

Daisy supports two types of hint files:
- **Global hints file** - These hints will apply to all your sessions with Daisy, regardless of directory. Global hints are stored in `~/.config/daisy/.daisyhints`.
- **Local hints files** -  These hints will only apply when working in a specific directory or directory hierarchy.

You can use both global and local hints at the same time. When both exist, Daisy will consider both your global preferences and project-specific requirements. If the instructions in your local hints file conflict with your global preferences, Daisy will prioritize the local hints.

:::tip Custom Context Files
You can use other agent rule files with Daisy by using the [`CONTEXT_FILE_NAMES` environment variable](#custom-context-files).
:::

<Tabs groupId="interface">
    <TabItem value="ui" label="Daisy Desktop" default>

    #### Global hints file
    1. Create a `.daisyhints` file in `~/.config/daisy`.

    #### Local hints file

    1. Change the directory to where you'd like to set up the file. You can do this by clicking the directory path on the bottom of the Daisy window.
    2. Click the <FolderKey size={16} /> icon on the bottom right of the Daisy window.
    4. Enter your local tips into the text area.
    5. Click `Save`.
    6. Restart your session so Daisy can read the updated `.daisyhints`.

    If a `.daisyhints` file already exists in the given directory, you can edit or add to it from this screen.

    :::tip
    You may have to scroll or adjust the screen size to fully see the `Save` and `Cancel` buttons.
    :::

    </TabItem>
    <TabItem value="manual" label="Manual">
    
    - **Global hints file** - Create a `.daisyhints` file in `~/.config/daisy`.
    - **Local hints file** -  Create a `.daisyhints` file at the root of your project and/or in any directory in the hierarchy.

    </TabItem>
</Tabs>

The `.daisyhints` file can include any instructions or contextual details relevant to your projects.

## Setting Up Hints

The `.daisyhints` file supports natural language. Write clear, specific instructions using direct language that Daisy can easily understand and follow. Include relevant context about your project and workflow preferences, and prioritize your most important guidelines first.

Daisyhints are loaded at the start of your session and become part of the system prompt sent with every request. This means the content of `.daisyhints` contributes to token usage, so keeping it concise can save both cost and processing time.

### Example Global `.daisyhints` File

```
Always use TypeScript for new Next.js projects.

@coding-standards.md  # Contains our coding standards
docs/contributing.md  # Contains our pull request process

Follow the [Google Style Guide](https://google.github.io/styleguide/pyguide.html) for Python code.

Run unit tests before committing any changes.

Prefer functional programming patterns where applicable.
```

### Example Local `.daisyhints` File

```
This is a simple example JavaScript web application that uses the Express.js framework. View [Express documentation](https://expressjs.com/) for extended guidance.

Go through the @README.md for information on how to build and test it as needed.

Make sure to confirm all changes with me before applying.

Run tests with `npm run test` ideally after each change.
```

These examples show two ways to reference other files:
- **`@` syntax**: Automatically includes the file content in Daisy's immediate context
- **Plain reference**: Points Daisy to files to review when needed (use for optional or very large files)

### Nested `.daisyhints` Files

Daisy supports hierarchical local hints in  git repositories. All `.daisyhints` files from your current directory up to the root directory are automatically loaded and combined. If you're not working in a git repository, Daisy only loads the `.daisyhints` file from the current directory.

As a best practice, `.daisyhints` at each level should only include hints relevant to that scope:
- **Root level**: Include project-wide standards, build processes, and general guidelines
- **Module/feature level**: Add specific requirements for that area of the codebase
- **Directory level**: Include very specific context like local testing procedures or component patterns

**Example Project Structure:**
```sh
my-project/
├── .git/
├── .daisyhints              # Project-wide hints
├── frontend/
│   ├── .daisyhints          # Frontend-specific hints
│   └── components/
│       ├── .daisyhints      # Component-specific hints
│       └── Button.tsx
└── backend/
    ├── .daisyhints          # Backend-specific hints
    └── api/
        └── routes.py
```

When working in `frontend/components/` in this example project, Daisy loads hints from directories higher up the hierarchy in the following order:
1. <details>
     <summary>`my-project/.daisyhints` (project root)</summary>
        ```
        This is a React + TypeScript project using Vite.

        @README.md                    # Project overview and setup instructions
        @docs/development-setup.md    # Development environment configuration

        Always run tests before committing: `npm test`
        Use conventional commits for all changes.
        ```
   </details>
2. <details>
     <summary>`frontend/.daisyhints`</summary>
        ```
        This frontend uses React 18 with TypeScript and Tailwind CSS.

        @package.json                      # Dependencies and scripts
        @docs/frontend-architecture.md     # Frontend structure and patterns

        ## Development Standards
        - Use functional components with hooks (no class components)
        - Implement proper TypeScript interfaces for all props
        - Follow the component structure: /components/ComponentName/index.tsx
        - Use Tailwind classes instead of custom CSS when possible

        ## Testing Requirements  
        - Write unit tests for all components using React Testing Library
        - Test files should be co-located: ComponentName.test.tsx
        - Run `npm run test:frontend` before committing changes

        ## State Management
        - Use React Query for server state
        - Use Zustand for client state management
        - Avoid prop drilling - lift state appropriately

        Always confirm UI changes with design team before implementation.
        ```
   </details> 
3. <details>
     <summary>`frontend/components/.daisyhints` (current directory)</summary>
        ```
        Components in this directory use our design system.

        @docs/component-api.md    # Component interface standards and examples

        All components must:
        - Export a default component
        - Include TypeScript props interface
        - Have corresponding .test.tsx file
        - Follow naming convention: PascalCase
        ```
   </details>

## Common Use Cases
Here are some ways people have used hints to provide additional context to Daisy:

- **Decision-Making**: Specify if Daisy should autonomously make changes or confirm actions with you first.

- **Validation Routines**: Provide test cases or validation methods that Daisy should perform to ensure changes meet project specifications.

- **Feedback Loop**: Include steps that allow Daisy to receive feedback and iteratively improve its suggestions.

- **Point to more detailed documentation**: Indicate important files like `README.md`, `docs/setup-guide.md`, or others that Daisy should consult for detailed explanations.

- **Organize with @-mentions**: For frequently-needed documentation, use `@filename.md` or `@relative/path/testing.md` to automatically include file content in your current context instead of just referencing it. This ensures Daisy has immediate access to important information. 
Include core documentation (like API schemas or coding standards) with @-mentions for immediate context, but use plain references (without `@`) for optional or very large files.

Like prompts, this is not an extensive list to shape your `.daisyhints` file. You can include as much context as you need.

## Best Practices

- **Keep files updated**: Regularly update the `.daisyhints` files to reflect any changes in project protocols or priorities.
- **Be concise**: Make sure the content is straightforward and to the point, ensuring Daisy can quickly parse and act on the information.
- **Start small**: Create a small set of clear, specific hints and gradually expand them based on your needs. This makes it easier to understand how Daisy interprets and applies your instructions.
- **Reference other files**: Point Daisy to relevant files like /docs/style.md or /scripts/validation.js to reduce repetition and keep instructions lightweight.

## Custom Context Files

Daisy looks for `AGENTS.md` then `.daisyhints` files by default, but you can configure a different filename or multiple context files using the `CONTEXT_FILE_NAMES` environment variable. This is useful for:

- **Tool compatibility**: Use conventions from other AI tools (e.g. `CLAUDE.md`)
- **Organization**: Separate frequently-used rules into multiple files that load automatically
- **Project conventions**: Use context files from your project's established toolchain (`.cursorrules`)

Here's how it works:
1. Daisy looks for each configured filename in both global (~/.config/daisy/) and local (current directory) locations
2. All found files are loaded and combined into the context

### Configuration

Set the `CONTEXT_FILE_NAMES` environment variable to a JSON array of filenames. The default is `["AGENTS.md", ".daisyhints"]`.

```bash
# Single custom file
export CONTEXT_FILE_NAMES='["AGENTS.md"]'

# Project toolchain files
export CONTEXT_FILE_NAMES='[".cursorrules", "AGENTS.md"]'

# Multiple files
export CONTEXT_FILE_NAMES='["CLAUDE.md", ".daisyhints", "project_rules.txt"]'
```
