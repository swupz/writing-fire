import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // 1. Create a state variable
    let isEnabled = false;

    const fireUri = vscode.Uri.joinPath(context.extensionUri, 'media', 'fire_trail6.png');

    // 2. The Toggle Command
    let toggleCommand = vscode.commands.registerCommand('writing-fire-extension.toggle', () => {
        isEnabled = !isEnabled;
        vscode.window.showInformationMessage(`Code on Fire is now ${isEnabled ? 'ON' : 'OFF'}!`);
    });

    // 3. The Event Listener
    let changeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
        // Only run if the extension is enabled
        if (!isEnabled) return;

        const editor = vscode.window.activeTextEditor;
        if (!editor || event.contentChanges.length === 0) return;

        const change = event.contentChanges[0];
        if (change.text.length === 0) return;

        const startPos = change.range.start;
        const range = new vscode.Range(startPos, startPos.translate(0, change.text.length));

        const fireDecorationType = vscode.window.createTextEditorDecorationType({
            after: {
                contentIconPath: fireUri,
                width: '8px',
                height: '13px',
                margin: '0 0 0 -8px',
                textDecoration: 'none; vertical-align: -2px; opacity: 0.8;'
            }, 
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });

        editor.setDecorations(fireDecorationType, [range]);
        setTimeout(() => fireDecorationType.dispose(), 400); 
    });

    // Add both to subscriptions
    context.subscriptions.push(toggleCommand, changeDisposable);
}