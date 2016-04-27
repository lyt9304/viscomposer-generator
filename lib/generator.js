/**
 * Created by lyt9304 on 16/4/22.
 */
var fs = require('fs');
var path = require('path');
var log = require('./log');

var primitiveHandler = require('./handler/primitive');
var moduleHandler = require('./handler/module');
var layoutHandler = require('./handler/layout');
var panelHandler = require('./handler/panel');

function generator(root, config, type){

	log.debug("root:" + root);
	log.debug("config:" + config);
	log.debug("type:" + type);

	var visRoot = root;
	var importedConfig = require(config);

	log.debug("importedConfig:" + importedConfig);

	var pathMap = {
		primitivePath: path.join(visRoot, "src", "workflow", "primitive"),
		modulePath: path.join(visRoot, "src", "workflow", "module"),
		layoutPath: path.join(visRoot, "src", "workflow", "layout"),
		panelPath: path.join(visRoot, "src", "ui", "workflowWindow", "panel"),
		appPath: path.join(visRoot, "src", "app", "app.js")
	};

	log.debug("pathMap:" + JSON.stringify(pathMap));

	var res="";

	switch(type){
		case "primitive":
			var classStr = primitiveHandler(importedConfig);
			//log.debug(classStr);
			var panelStr = panelHandler(importedConfig);
			//log.debug(panelStr);

			fs.writeFileSync(path.join(pathMap.primitivePath, importedConfig.name.toLowerCase() + ".js"), classStr);
			fs.writeFileSync(path.join(pathMap.panelPath, importedConfig.name.toLowerCase() + ".js"), panelStr);

			break;
		case "module":
			moduleHandler(importedConfig);
			break;
		case "layout":
			layoutHandler(importedConfig);
			break;
	}
}


module.exports = generator;