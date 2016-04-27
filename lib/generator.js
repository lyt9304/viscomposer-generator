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

	console.log("root:" + root);
	console.log("config:" + config);
	console.log("type:" + type);

	var visRoot = root;
	var importedConfig = require(config);

	console.log("importedConfig:" + importedConfig);

	var pathMap = {
		primitivePath: path.join(visRoot, "src", "workflow", "primitive"),
		modulePath: path.join(visRoot, "src", "workflow", "module"),
		layoutPath: path.join(visRoot, "src", "workflow", "layout"),
		panelPath: path.join(visRoot, "src", "ui", "workflow", "panel"),
		appPath: path.join(visRoot, "src", "app", "app.js")
	};

	console.log("pathMap:" + JSON.stringify(pathMap));

	var res="";

	switch(type){
		case "primitive":
			var res = primitiveHandler(importedConfig);
			fs.writeFileSync(path.join(pathMap.primitivePath, importedConfig.name.toLowerCase() + ".js"), res);
			break;
		case "module":
			moduleHandler(importedConfig);
			break;
		case "layout":
			layoutHandler(importedConfig);
			break;
	}

	console.log(res);



}


module.exports = generator;