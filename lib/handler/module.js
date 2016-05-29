/**
 * Created by lyt9304 on 16/4/22.
 */

var path = require('path');
var log = require('../log');

var jsonFormat = require('json-format');
var formatConfig = {
	type: 'tab',
	size: 1
};

function moduleHandler(config, modulePath, root, ifDynamic){

	var dependencyArr = [
		"var VObject = require('../../core/vobject');",
		"var Module = require('../module');",
		"var Port = require('../port');",
		//"var tmpModule = new Module();",
		//"var tmpPort = new Port();"
	];

	if(config.hasOwnProperty("dependency")) {
		for(var key in config.dependency){
			var value = config.dependency[key]
			dependencyArr.push("var " + key + " = require('" + path.relative(modulePath, path.join(root, value)) +"');")
		}
	}

	var name = config.name;
	var declareLine = "var " + name + " = Module.Factory(";

	if(ifDynamic){
		name = "viscomposer.extension." + name;
		declareLine =  name + " = Module.Factory("
	}

	log.debug(name);

	var exportsStr = "module.exports = " + name + ";";

	var code = [
		declareLine,
		jsonFormat(config.basic, formatConfig),
		");",
		"",
		name + ".prototype.init=function(properties){"
	];

	for (var i = 0, len = config.basic.input.length; i < len; i++) {
		var item = config.basic.input[i];
		if(item.hasOwnProperty("value")){
			code.push("	this.input[" + i + "].value="+item.value+";");
		}
	}

	code.push("};\n");

	var methods = config.method;

	if(!methods.hasOwnProperty("createTemplate")){
		log.error("Structure must has createTemplate function!");
    process.exit(0);
	}

	for(var key in methods){
		code.push(name + ".prototype." + key + " =");
		code.push(methods[key].toString() + ";\n");
	}

	if(ifDynamic){
		return dependencyArr.join("\n") + "\n" +
			code.join("\n") + "\n";
	}

	return dependencyArr.join("\n") + "\n" +
		code.join("\n") + "\n" +
		exportsStr + "\n";
}

module.exports = moduleHandler;