import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "code-on-fire" is now active!');

    // 1. Define the Fire Visual
    // We use a Base64 image so you don't have to deal with file paths right now.
    // This is a simple pixel-art style fire frame.
    const fireGifBase64 = 'data:image/gif;base64,R0lGODlhEAAQAPEFAP///wAAAP8AAP///yH5BAEKAA8ALAAAAAAQABAAAAIO8I+pw+0Po5y02ouzUgAAOw==';

    // 2. The Event Listener
    // This function runs every time the text in the document changes.
    let changeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
        
        // Safety check: is there an active editor?
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        // We only want to trigger this if the user actually typed something (content changes)
        if (event.contentChanges.length === 0) { return; }

        // Get the position of the last change (where the cursor just was)
        const lastChange = event.contentChanges[0];
        const range = new vscode.Range(lastChange.range.start, lastChange.range.end.translate(0, 1));

        // 3. Create the Decoration
        // This defines what the fire looks like using CSS properties
        const fireDecorationType = vscode.window.createTextEditorDecorationType({
            // We use the 'after' property to place the fire right next to/on top of the letter
            after: {
                contentIconPath: vscode.Uri.parse(fireGifBase64),
                margin: '0 0 0 -10px', // Pull the fire back over the previous letter
                width: '20px',
                height: '20px',
            },
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });

        // 4. Apply the decoration to the editor at the specific range
        editor.setDecorations(fireDecorationType, [range]);

        // 5. The "Fade Away" Logic
        // We simply dispose (remove) the decoration after 500 milliseconds
        setTimeout(() => {
            fireDecorationType.dispose();
        }, 500); 
    });

    context.subscriptions.push(changeDisposable);
}

export function deactivate() {}