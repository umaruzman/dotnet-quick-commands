# Dotnet Model Generator (VS Code Extension)

## Overview

Dotnet Model Generator is a VS Code extension that allows developers to quickly generate **Models**, **Controllers**, and **Interfaces** in their .NET projects. It automatically detects the correct namespace and folder structure, ensuring efficient and standardized code creation.

## Features

- **Create Models** in `Model` or `Models` folders.
- **Create Controllers** in `Controller` or `Controllers` folders.
- **Create Interfaces** in `Interface` or `Interfaces` folders.
- **Namespace Auto-Detection**: Finds the nearest `.csproj` file to determine the correct namespace.
- **Folder Selection**: If multiple target folders exist, the user can select where to create the file.
- **Controller Type Selection**: Choose between a **Basic Controller** and an **API Controller**.

## Installation

1. Clone this repository or download the source code.
2. Open the project in **VS Code**.
3. Run `npm install` to install dependencies.
4. Press `F5` to launch the extension in a new VS Code window.

## Usage

1. Open a .NET project in VS Code.
2. Open the **Command Palette** (`Ctrl + Shift + P` or `Cmd + Shift + P` on Mac).
3. Search for one of the following commands:
   - `dotnet: Create Model`
   - `dotnet: Create Controller`
   - `dotnet: Create Interface`
4. Enter the name of the file you want to create.
5. Select the appropriate folder if prompted.
6. Your file will be generated with the correct namespace and structure.

## Project Structure

```
.dotnet-model-generator/
│── src/
│   ├── extension.ts   # Main extension logic
│   ├── utils.ts       # Helper functions (folder detection, namespace retrieval, etc.)
│── package.json       # Extension metadata and contributions
│── tsconfig.json      # TypeScript configuration
│── README.md          # Documentation
```

## Configuration

- The extension automatically searches for `Model(s)`, `Controller(s)`, and `Interface(s)` folders.
- If no matching folder is found, an error message will be displayed.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Commit your changes: `git commit -m 'Added new feature'`.
4. Push to the branch: `git push origin feature-branch`.
5. Submit a pull request.

## License

This project is licensed under the **MIT License**.

---

Happy coding! 🚀
