/**
 * Created by lyt9304 on 16/4/24.
 */

var log = require("../log");
var path = require('path');

function panelHandler(config, panelPath, ifDynamic){
	var name = config.name + "Panel";
	var declareLine = "var " + name + " = VObject.define('" + name + "', 'PanelUI', "+ "function(module ,window){";
	if(ifDynamic){
		name = "viscomposer.extension." + name;
		declareLine = name + " = VObject.define('" + name + "', 'PanelUI', "+ "function(module ,window){";
	}
	log.debug(name);


	var dependencyStr = [
		"var VObject = require('../../../core/vobject');",
		"var PanelUI = require('./panel');",
		//"var tmpPanelUI = new PanelUI;"
	].join("\n");

	var exportsStr = "module.exports = " + name + ";";

	var code = [
		declareLine,
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

	if(ifDynamic){
		return dependencyStr + "\n" +
			code.join("\n") + "\n";
	}


	return dependencyStr + "\n" +
		code.join("\n") + "\n" +
		exportsStr + "\n";
}

module.exports = panelHandler;