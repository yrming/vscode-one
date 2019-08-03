const vscode = require('vscode');
const superagent = require('superagent');
const fs = require('fs');
const path = require('path');
const download = require('image-downloader');

const ONEURL = 'http://m.wufazhuce.com/one';
const AJAXURL = 'http://m.wufazhuce.com/one/ajaxlist/';

class OneProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.model = [];
    this._getOneList();
  }
  _fire(item) {
    if (item) {
      this._onDidChangeTreeData.fire(item);
    } else {
      this._onDidChangeTreeData.fire();
    }
  }
  refreshData() {
    this._getOneList();
  }
  _pathExists(string) {
    try {
      fs.accessSync(string);
    } catch (err) {
      return false;
    }
    return true;
  }
  async _getOneList() {
    try {
      let one_url_resp = await superagent.get(ONEURL).send();
      let cookie = one_url_resp.header['set-cookie'];
      let token = one_url_resp.text.split("One.token = '")[1].split("'")[0];
      if (token && token.length === 40) {
        let ajax_resp = await superagent
          .get(`${AJAXURL}0?_token=${token}`)
          .send()
          .set('Cookie', cookie);
        let list = JSON.parse(ajax_resp.text);
        if (list && list.data && list.data.length > 0) {
          let getImg = async (name, img_url) => {
            let pics_exists = this._pathExists(path.join(__filename, '..', '..', 'resources', 'pictures', `${name}.png`));
            if (!pics_exists) {
              const options = {
                url: img_url,
                dest: path.join(__filename, '..', '..', 'resources', 'pictures', `${name}.png`)
              };
              await download.image(options);
            }
          };
          let promiseArray = list.data.map((item) => getImg(item.title, item.img_url));
          await Promise.all(promiseArray);
          this.model = list.data;
          this._fire();
        }
      }
    } catch (error) {}
  }
  getChildren(element) {
    if (element) {
      return [
        {
          date: '',
          content: element.content,
          type: 'body'
        }
      ];
    } else {
      return this.model;
    }
  }
  getTreeItem(element) {
    return {
      label: `${element.date.replace(/\s+/g, '')}`,
      tooltip: element.type === 'body' ? element.content : element.title,
      iconPath: element.type === 'body' ? undefined : path.join(__filename, '..', '..', 'resources', 'pictures', `${element.title}.png`),
      description: element.type === 'body' ? element.content : '',
      collapsibleState: element.type === 'body' ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded,
      contextValue: element.type === 'body' ? '' : 'see'
    };
  }
}

class One {
  constructor(context) {
    const treeDataProvider = new OneProvider();
    vscode.window.registerTreeDataProvider('vscodeOne', treeDataProvider);
    vscode.commands.registerCommand('vscodeOne.refresh', () => {
      treeDataProvider.refreshData();
    });
  }
}

module.exports = One;
