const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */

const getFilesInWorkspace = async () => {
	const allFiles = await vscode.workspace.findFiles(
		"**/*",
		"**/node_modules/**"
	);

	const filteredFiles = allFiles.filter(
		file =>
			file.path.includes("Script") &&
			file.path.includes(".groovy") &&
			!file.path.toLowerCase().includes("temp")
	);

	return filteredFiles.map(file => ({
		label: file.path.split("/").slice(-3)[0],
		description: file.path.split("/").slice(-3)[1],
		fullPath: file.path,
	}));
};

function activate(context) {
	let disposable = vscode.commands.registerCommand(
		"katalon-key-hook.runHook",
		async function () {
			const files = await getFilesInWorkspace();

			if (files.length > 0) {
				const selectedFile = await vscode.window.showQuickPick(files);

				if (selectedFile) {
					vscode.workspace
						.openTextDocument(selectedFile.fullPath)
						.then(vscode.window.showTextDocument);
				}
			}

			vscode.window.showInformationMessage("HOOKED!");
		}
	);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
