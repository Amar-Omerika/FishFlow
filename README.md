# FishFlow

FishFlow is an Electron application built with React and TypeScript. It provides a user interface for managing users and their associated data, including sections and yearly records. The application uses SQLite for data storage and provides various functionalities such as adding, updating, and deleting users and their records.

## Technologies Used

- **Electron**: For building cross-platform desktop applications
- **React**: For building the user interface
- **TypeScript**: For type-safe JavaScript
- **SQLite**: For data storage
- **Vite**: For fast development and build tooling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```sh
git clone https://github.com/Amar-Omerika/FishFlow.git
cd FishFlow
```

2. Install dependencies:

```sh
npm install
```

### Development

To start the application in development mode, run:

```sh
npm run dev
```

This will start both the React development server and the Electron application.

### Build

To build the application for production, run:

```sh
npm run build
```

This will compile the TypeScript code and bundle the React application.

### Distribution

To create a distributable package, run one of the following commands based on your target platform:

```sh
npm run dist:mac
npm run dist:win
npm run dist:linux
```

## File Descriptions

### `src/electron/main.ts`

This file is the main entry point for the Electron application. It initializes the main window, sets up IPC handlers, and manages the database connection.

### `src/electron/database.ts`

This file contains functions for interacting with the SQLite database, including initializing the database and performing CRUD operations.

### `src/electron/pathResolver.ts`

This file contains functions for resolving paths to the UI and preload scripts.

### `src/electron/preload.cts`

This file exposes Electron APIs to the renderer process using the `contextBridge`.

### `src/electron/resourceManager.ts`

This file contains functions for monitoring system resources (CPU, RAM, storage) and sending the data to the renderer process.

### `src/electron/util.ts`

This file contains utility functions for IPC communication and event validation.

### `src/ui`

This directory contains the React components and pages for the user interface.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
