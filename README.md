## Addon installation

[![Install on Firefox](https://img.shields.io/badge/Firefox_Add_Ons-Install-20123A?logo=firefoxbrowser&logoColor=white&style=for-the-badge)](https://addons.mozilla.org/firefox/addon/simple-copy-aria2-download-cmd)

## Description

A lightweight browser extension that adds a convenient context menu item for copying a GET request link as an `aria2` command. With one click, you can copy a ready-to-use `aria2` command for efficient, multi-connection downloads.

## Features

- Copy any link (GET) as an `aria2` command
- Supports custom headers and parameters passed via the URL
- Zero-config: works out of the box

## Prerequisites

- Node.js (>= 14)
- npm (>= 6)
- Firefox or Chrome (for testing/loading the extension)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/serj-kzv/simple-copy-aria2-download-command.git
   cd simple-copy-aria2-download-command
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

## Development

During development, use Webpack in watch mode to rebuild on changes:

```bash
npm run watch
```

For Firefox-specific development, you can run with `web-ext`:

```bash
npx web-ext run
```

## Building for Production

- **Build**: Bundle and minify the extension for production.

  ```bash
  npm run build
  ```

- **Pack**: Create a packaged `.xpi` (Firefox) or `.zip` (Chrome) for distribution.

  ```bash
  npm run pack
  ```

  The output file will be located in the `dist/` directory.

## Usage

1. Load the extension into your browser:
    - **Firefox**: Go to `about:debugging#/runtime/this-firefox` → "Load Temporary Add-on" → select `dist/manifest.json`.
    - **Chrome**: Go to `chrome://extensions/` → Enable "Developer mode" → "Load unpacked" → select the `dist/` folder.

2. Right-click any link on a webpage.
3. Choose **Copy as aria2 Download Command**.
4. Paste the command into your terminal to start the download:

   ```bash
   aria2 "https://example.com/file.zip"
   ```

## Contributing

Feedback and contributions are welcome! Please open an issue or submit a pull request:

- Issues: https://github.com/serj-kzv/simple-copy-aria2-download-command/issues
- Pull Requests: https://github.com/serj-kzv/simple-copy-aria2-download-command/pulls

## License

This project is licensed under the [MIT License](https://github.com/serj-kzv/simple-copy-aria2-download-command/blob/main/LICENSE).

## Author

**serj-kzv**

- GitHub: https://github.com/serj-kzv
- Homepage: https://github.com/serj-kzv/simple-copy-aria2-download-command#readme

---

> Crafted with ❤️ by serj-kzv

