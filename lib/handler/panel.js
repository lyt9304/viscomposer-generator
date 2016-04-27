/**
 * Created by lyt9304 on 16/4/24.
 */

var log = require("../log");

function panelHandler(config){
	var name = config.name + "Panel";
	log.debug(name);

	var dependencyStr = [
		"var VObject = require('../../../core/vobject');",
		"var PanelUI = require('./panel');"
	].join("\n");

	var exportsStr = "module.exports = " + name + ";";

	var code = [
		"var " + name + " = VObject.define('" + name + "', 'PanelUI', "+ "function(module ,window){",
		"	this.module = module;",
		"	this.module.ui = this;",
		"	this.workflowWindow = window;",
		"	this.productive = " + config.ui.productive + ";",
		"	this.module.pos = [" + config.ui.pos.join(",") + "];",
		"	this.update();",
		"}, []);\n"
	];

	var methods = config.ui.method;

	if(!methods.hasOwnProperty("update") || !methods.hasOwnProperty("createDom")){
		log.error("Panel must has update and createDom function!");
	}

	for(var key in methods){
		code.push(name + ".prototype." + key + " =");
		code.push(methods[key].toString() + ";\n");
	}

	return dependencyStr + "\n" +
		code.join("\n") + "\n" +
		exportsStr + "\n";
}

module.exports = panelHandler;