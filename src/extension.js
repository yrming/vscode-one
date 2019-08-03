const OneProvider = require('./oneProvider');
const OneCommands = require('./oneCommand');

function activate(context) {
	new OneProvider(context);
	new OneCommands(context);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
