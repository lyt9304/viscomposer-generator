/**
 * Created by lyt9304 on 16/4/22.
 */

//var initTmpl = require('../template').initPort;

var jsonFormat = require('json-format');
var formatConfig = {
	type: 'tab',
	size: 1
};

function primitiveHandler(config){
	var dependencyStr = [
		"var VObject = require('../../core/vobject');",
		"var Module = require('../module');",
		"var Port = require('../port');"
	].join("\n");

	var exportsStr = "module.exports = " + config.name + ";";

	var code = [
		"var " + config.name + " = Module.Factory(",
		jsonFormat(config.basic, formatConfig),
		");",
		"",
		config.name + ".prototype.init=function(properties){"
	];

	for (var i = 0, len = config.basic.input.length; i < len; i++) {
		var item = config.basic.input[i];
		if(item.hasOwnProperty("value")){
			code.push("	this.input[" + i + "].value="+item.value+";");
		}
	}

	code = code.concat([
		"}",
		config.name + ".prototype.createTemplate=",
		config.createTemplate.toString()
	]);

	return dependencyStr + "\n" +
		code.join("\n") + "\n" +
		exportsStr + "\n";
}

module.exports = primitiveHandler;