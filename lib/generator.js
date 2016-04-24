/**
 * Created by lyt9304 on 16/4/22.
 */
var fs = require('fs');
var path = require('path');

var primitiveHandler = require('./handler/primitive');
var moduleHandler = require('./handler/module');
var layoutHandler = require('./handler/layout');
var panelHandler = require('./handler/panel');

function generator(root, config, type){
	var visRoot = root;
	var importedConfig = require(config);
	var pathMap = {
		primitivePath: path.join(visRoot, "src", "workflow", "primitive"),
		modulePath: path.join(visRoot, "src", "workflow", "module"),
		layoutPath: path.join(visRoot, "src", "workflow", "layout"),
		panelPath: path.join(visRoot, "src", "ui", "workflow", "panel"),
		appPath: path.join(visRoot, "src", "app", "app.js")
	};

	var res="";

	switch(type){
		case "primitive":
			var res = resprimitiveHandler(importedConfig);
			break;
		case "module":
			moduleHandler(importedConfig);
			break;
		case "layout":
			layoutHandler(importedConfig);
			break;
	}

	console.log(res);

	//fs.writeFileSync(importedConfig.name, res, pathMap.primitivePath);

}


module.exports = generator;