const vscode = require('vscode');

function  getWebviewContent(node) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
    </head>
    <style>
      .one-info {
        width: 750px;
        text-align: center;
      }
      .photographer {
        margin-top: 10px;
        font-size: 12px;
      }
      .text-content {
        padding: 60px 100px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
      }
      .content {
        display: inline-block;
        text-align: left;
      }
      .text-author {
        text-align: center;
        font-size: 12px;
      }
    </style>
    <body>
        <div class="one-info">
          <img src=${node.img_url} />
          <div class="photographer">
            ${node.picture_author}
          </div>
          <div class="text-content">
            <span class="content">${node.content}</span>
          </div>
          <div class="text-author">
            ${node.text_authors}
          </div>
        </div>
    </body>
    </html>`;
};

class OneCommands {
  constructor(context) {
    vscode.commands.registerCommand('vscodeOne.see', (node) => {
      const panel = vscode.window.createWebviewPanel(`${node.title}`, `${node.title}`, vscode.ViewColumn.One, {});
      panel.webview.html = getWebviewContent(node);
    });
  }
}

module.exports = OneCommands;