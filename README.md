# simple-copy-aria2-download-command

A lightweight WebExtension that copies URLs as aria2 download commands to your clipboard.

## Features

- Right-click on any link and select **Copy aria2 command**.
- Automatically formats the aria2c command with the URL.

## Requirements

- **Node.js** v14 or higher
- **npm** (bundled with Node.js)

## Installation

1. **Install Node.js**
    - Download the LTS version from https://nodejs.org/ and follow the installer instructions.
    - Verify installation:
      ```bash
      node -v
      npm -v
      ```

2. **Clone the repository**
   ```bash
   git clone https://github.com/serj-kzv/simple-copy-aria2-download-command.git
   cd simple-copy-aria2-download-command
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

## Building

- **Development mode (with watch):**
  ```bash
  npm run watch
  ```
  Automatically rebuilds on file changes.

- **Production build:**
  ```bash
  npm run build
  ```
  Outputs optimized files to the `dist/` directory.

## Installing the Extension

1. Open your browser's extensions page (e.g., `about:debugging` in Firefox or `chrome://extensions/` in Chrome).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `dist/` directory.
4. The extension should now be available and ready to use.

## Contributing

Feel free to open issues or submit pull requests on [GitHub](https://github.com/serj-kzv/simple-copy-aria2-download-command).

## License

MIT © serj-kzv

