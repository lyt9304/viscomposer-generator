/**
 * Created by lyt9304 on 16/4/22.
 */
var Rectn = {
	"name": "Rectn",
	"type": "primitive",
	"basic":{
		"label": "Rectn",
		"funName": "Rectn",
		"resName": "rectn",
		"input": [
			{
				"type": "map",
				"label": "x",
				"varname": "x",
				"value": "properties.x||(properties.underLayout?'layout().x':0)"
			},
			{
				"type": "map",
				"label": "y",
				"varname": "y",
				"value": "properties.y||(properties.underLayout?'layout().y':0)"
			},
			{
				"type": "map",
				"label": "width",
				"varname": "width",
				"value": "properties.width||(properties.underLayout?'layout().width':500)"
			},
			{
				"type": "map",
				"label": "height",
				"varname": "height",
				"value": "properties.height||(properties.underLayout?'layout().height':500)"
			},
			{
				"type": "map",
				"label": "color",
				"varname": "color",
				"value": "properties.color||'#3366dd'"
			},
			{
				"type": "map",
				"label": "style",
				"varname": "style",
				"value": "''"
			}
		],
		"output": [
			{
				"type": "geometry",
				"label": "rectn",
				"varname": "rectn"
			},
			{
				"type": "transform",
				"varname": "transform",
				"label": "transform"
			}
		],
		"properties":{

		}
	},
	"method": {
		"createTemplate": function(){
			var properties=this.properties;
			var uuid=this.uuid;
			var templateStr=
				'function(x,y,width,height,color,style){\n'+
				'    var rect=createRect(x,y,width,height,color,style,\''+uuid+'\',0,env.transform);\n'+
				'    return {\n'+
				'        '+this.geoOutput[0].varname+':rect,\n'+
				'        '+this.envOutput[0].varname+':{x:x,y:y,width:width,height:height},\n'+
				'    };\n'+
				'}';
			return templateStr;
		}
	},
	"ui":{
		"productive": false,
		"pos": [370, 100],
		"method":{
			"createDom": function(){
				var that = this;
				var module = that.module;
				$(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content').append(
					'<div class="module rectn" id="' + that.uuid + '">' +
					'<div class="title">' +
					'<span>' + module.label + '</span>' +
					'<img src="' + (that.module.layoutIcon||viscomposer.app.imgPool["rectangle"]) + '">' +
					'</div>' +
					'<div class="hr"></div>' +
					'<div class="content">' +
					'<div class="inputs">' +
					'</div>' +
					'<div class="outputs">' +
					'</div></div></div>');
			},
			"update": function(){
				//RectPanel.baseClass_.prototype.update.call(this);
				var input = this.module.input;
				for(var i = 0; i < input.length; i++) {
					input[i].ui.onSwitch();
					input[i].ui.update();
				}
			}
		}
	}
};

module.exports = Rectn;