import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "code-on-fire" is now active!');

    // 1. Get the path to your local PNG
    // Note: If you move the image to a top-level folder named 'media', 
    // change the arguments to: context.extensionUri, 'media', 'fire_trail2.png'
    const fireUri = vscode.Uri.joinPath(context.extensionUri, 'src', 'media', 'fire_trail6.png');

    // 2. The Event Listener
    let changeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        if (event.contentChanges.length === 0) return;

        const change = event.contentChanges[0];
        const text = change.text;

        if (text.length === 0) return;

        const startPos = change.range.start;
        const endPos = startPos.translate(0, text.length);
        const range = new vscode.Range(startPos, endPos);

        // 3. Create the Decoration
        const fireDecorationType = vscode.window.createTextEditorDecorationType({
            after: {
                contentIconPath: fireUri,
                width: '8px',
                height: '13px',
                // Pulls the image back over the letter
                margin: '0 0 0 -8px',
                // Adjust this value (-4px to -6px) to stop the "floating"
                textDecoration: 'none; vertical-align: -2px; opacity: 0.8;'
            }, 
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });

        // 4. Apply and Fade
        editor.setDecorations(fireDecorationType, [range]);

        setTimeout(() => {
            fireDecorationType.dispose();
        }, 400); 
    });

    context.subscriptions.push(changeDisposable);
}

export function deactivate() {}