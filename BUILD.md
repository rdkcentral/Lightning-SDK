# Build Instructions

This document provides instructions on how to build and work with the Lightning SDK project.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (which includes npm)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/rdkcentral/Lightning-SDK.git
    cd Lightning-SDK
    ```

2.  **Install dependencies:**

    Run the following command in the root directory of the project to install all the necessary dependencies.

    ```bash
    npm install
    ```

    This command will also trigger a `postinstall` script that sets up the necessary support files and polyfills in the `support` directory.

## Building

The Lightning SDK is designed to be consumed directly by applications, and as such, it does not have a primary build step that bundles the entire library. The core source files are used as is.

However, the project includes a Rollup configuration to build the `startApp.js` file located in the `support` directory, which is likely used for development or testing purposes.

If you need to manually rebuild this file after making changes to `./src/startApp.js`, you can run:

```bash
npx rollup -c
```

This will use the `rollup.config.js` file to transpile and bundle `./src/startApp.js` into `./support/startApp.js`.

## Linting

To check the code for any linting errors, run the following command:

```bash
npm run lint
```

## Type Definition Tests

To run the TypeScript definition tests, use the following command:

```bash
npm run tsd
```
