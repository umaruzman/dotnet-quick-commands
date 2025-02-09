import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "dotnet-model-generator.createModel",
      async () => {
        await createFile("Model", ["Model", "Models", "model", "models"]);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "dotnet-model-generator.createController",
      async () => {
        await createFile("Controller", [
          "Controller",
          "Controllers",
          "controller",
          "controllers",
        ]);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "dotnet-model-generator.createInterface",
      async () => {
        await createFile("Interface", [
          "Interface",
          "Interfaces",
          "interface",
          "interfaces",
        ]);
      }
    )
  );
}

async function createFile(
  fileType: "Model" | "Controller" | "Interface",
  targetFolders: string[]
) {
  const fileName = await getFileName(fileType);
  if (!fileName) return;

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No workspace folder is open.");
    return;
  }

  const foundFolders: vscode.Uri[] = [];
  workspaceFolders.forEach((folder) =>
    findTargetFolders(folder.uri.fsPath, targetFolders, foundFolders)
  );

  if (foundFolders.length === 0) {
    vscode.window.showErrorMessage(
      `No ${fileType} folder found in the workspace.`
    );
    return;
  }

  const selectedFolder = await selectTargetFolder(foundFolders, fileType);
  if (!selectedFolder) return;

  const namespace = determineNamespace(selectedFolder);
  if (!namespace) return;

  const fileContent = await generateFileContent(fileType, fileName, namespace);
  if (!fileContent) return;

  const filePath = path.join(
    selectedFolder,
    `${fileType === "Interface" ? "I" : ""}${fileName}${
      fileType === "Controller" ? "Controller" : ""
    }.cs`
  );
  fs.writeFileSync(filePath, fileContent);

  const document = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(document);

  vscode.window.showInformationMessage(
    `${fileType} "${fileName}" created successfully in ${selectedFolder}!`
  );
}

async function getFileName(fileType: string): Promise<string | undefined> {
  const fileName = await vscode.window.showInputBox({
    prompt: `Enter the ${fileType.toLowerCase()} name`,
  });
  if (!fileName) {
    vscode.window.showErrorMessage(`${fileType} name is required.`);
  }
  return fileName;
}

function findTargetFolders(
  dir: string,
  targets: string[],
  result: vscode.Uri[]
) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (targets.includes(file)) {
        result.push(vscode.Uri.file(fullPath));
      }
      findTargetFolders(fullPath, targets, result);
    }
  });
}

async function selectTargetFolder(
  foundFolders: vscode.Uri[],
  fileType: string
): Promise<string | undefined> {
  return await vscode.window.showQuickPick(
    foundFolders.map((folder) => folder.fsPath),
    {
      placeHolder: `Select a folder to create the ${fileType.toLowerCase()} in`,
    }
  );
}

function determineNamespace(selectedFolder: string): string | null {
  const csprojPath = findNearestCsproj(selectedFolder);
  if (!csprojPath) {
    vscode.window.showErrorMessage("No .csproj file found in the project.");
    return null;
  }

  const csprojContent = fs.readFileSync(csprojPath, "utf-8");
  const namespaceMatch = csprojContent.match(
    /<RootNamespace>(.*?)<\/RootNamespace>/
  );
  const rootNamespace = namespaceMatch
    ? namespaceMatch[1]
    : path.basename(csprojPath, ".csproj");
  const relativePath = path.relative(path.dirname(csprojPath), selectedFolder);
  return `${rootNamespace}.${relativePath.split(path.sep).join(".")}`;
}

function findNearestCsproj(dir: string): string | null {
  let currentDir = dir;
  while (currentDir !== path.parse(currentDir).root) {
    const csprojFiles = fs
      .readdirSync(currentDir)
      .filter((file) => file.endsWith(".csproj"));
    if (csprojFiles.length > 0) return path.join(currentDir, csprojFiles[0]);
    currentDir = path.dirname(currentDir);
  }
  return null;
}

async function generateFileContent(
  fileType: "Model" | "Controller" | "Interface",
  fileName: string,
  namespace: string
): Promise<string> {
  if (fileType === "Model") {
    return `using System;\n\nnamespace ${namespace}\n{\n    public class ${fileName}\n    {\n        // Add properties here\n    }\n}`;
  }

  if (fileType === "Interface") {
    return `using System;\n\nnamespace ${namespace}\n{\n    public interface I${fileName}\n    {\n        // Add method signatures here\n    }\n}`;
  }

  return `using Microsoft.AspNetCore.Mvc;\n\nnamespace ${namespace}\n{\n    [ApiController]\n    [Route("api/[controller]")]\n    public class ${fileName}Controller : ControllerBase\n    {\n    }\n}`;
}

export function deactivate() {}
