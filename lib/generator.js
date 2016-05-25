/**
 * Created by lyt9304 on 16/4/22.
 */
var fs = require('fs');
var path = require('path');
var log = require('./log');

var moduleHandler = require('./handler/module');
var panelHandler = require('./handler/panel');
var insertHandler = require('./handler/insert');
var defaultImg = "resource/image/element/primitive/User%20defined.png";
var jsonFormat = require('json-format');
var formatConfig = {
  type: 'space',
  size: 4
};

function generator(root, config){

	log.debug("root:" + root);
	log.debug("config:" + config);

	var visRoot = root;
	var importedConfig = require(config);
	var type = importedConfig["type"];

  //log.debug("importedConfig:" + jsonFormat(importedConfig, formatConfig));
  log.debug("type:" + type);

  var pathMap = {
		primitive: path.join(visRoot, "src", "workflow", "primitive"),
		module: path.join(visRoot, "src", "workflow", "module"),
		layout: path.join(visRoot, "src", "workflow", "layout"),
		panel: path.join(visRoot, "src", "ui", "workflowWindow", "panel"),
		app: path.join(visRoot, "src", "app", "app.js")
	};

	log.debug("pathMap:" + jsonFormat(pathMap, formatConfig));

	var moduleWritePath;

	if(!pathMap.hasOwnProperty(type)){
		log.error("There is no generator for type:" + type);
		return;
	}else{
		moduleWritePath = path.join(pathMap[type], importedConfig.name.toLowerCase() + ".js");
	}

	var classStr = moduleHandler(importedConfig, pathMap["module"], visRoot);
	log.debug(classStr);
	var panelStr = panelHandler(importedConfig);
	log.debug(panelStr);
  var moduleName = importedConfig.name;
  var moduleImg = importedConfig.img || defaultImg;
	log.debug(moduleImg);
	log.debug(moduleName);
	log.debug(visRoot);
	log.debug(moduleName);
  insertHandler(visRoot, moduleName, type, moduleImg);
	log.debug(moduleWritePath);
	log.debug(path.join(pathMap.panel, moduleName.toLowerCase() + ".js"));

	fs.writeFileSync(moduleWritePath, classStr);
	fs.writeFileSync(path.join(pathMap.panel, moduleName.toLowerCase() + ".js"), panelStr);

}

module.exports = generator;