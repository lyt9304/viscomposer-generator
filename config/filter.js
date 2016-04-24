/**
 * Created by lyt9304 on 16/4/22.
 */
/**
 * Created by lyt9304 on 16/4/22.
 */
var Rect = {
	"label": "Filter",
	"funName": "Filter",
	"resName": "data_filtered",
	"input": [
		{
			"type": "input",
			"label": "input",
			"varname": "input",
			"value": "properties.x||(properties.underLayout?'layout().x':0)"
		}
	],
	"output": [
		{
			"type": "output",
			"label": "data_filtered",
			"varname": "data_filtered",
			"value": "properties.x||(properties.underLayout?'layout().x':0)"
		}
	],
	"properties":{
		type:'none',
		cols:{}
	},
	"createTemplate": function(){
		var properties=this.properties;
		//
		var key=properties.selectedCol;
		var exp;

		var templateStr=
			'function(input){\n'+
			'    var output=[];\n';
		if(properties.code){
			templateStr+=
				'    for(var i=0,ni=input.length;i<ni;++i){\n';
			for(var key in properties.cols){
				templateStr+=
					'        var '+key+'=input[i][\''+key+'\'];\n';
			}
			templateStr+=
				'        if('+properties.code+'){\n'+
				'            output.push(input[i]);\n'+
				'        }\n'+
				'    }\n'+
				'    return {'+this.output[0].varname+':output};\n'+
				'}';
		}else{
			var col=properties.cols[key];
			if(col){
				switch(col._dataType){
					case Attribute.TYPE.QUANTITATIVE:
						exp='(value>=('+properties._min+'))&&(value<=('+properties._max+'))';
						break;
					case Attribute.TYPE.CATEGORICAL:
						templateStr+=
							'    var validValues={';
						for(var value in col){
							if(value=='_dataType'||value=='_min'||value=='_max'){
								continue;
							}else{
								if(col[value]){
									templateStr+='\''+value+'\':true,';
								}
							}
						}
						templateStr+='};\n';
						exp='validValues[value]';
						break;
					default:
						exp='false';
				}
			}else{
				exp='false';
			}

			templateStr+=
				'    for(var i=0,ni=input.length;i<ni;++i){\n'+
				'        var value=input[i][\''+key+'\'];\n'+
				'        if('+exp+'){\n'+
				'            output.push(input[i]);\n'+
				'        }\n'+
				'    }\n'+
				'    return {'+this.output[0].varname+':output};\n'+
				'}';
		}

		return templateStr;
	},
	method:{
		mergeCol: function(thisCol,mergeCol,dataType){
			thisCol=thisCol||{'_dataType':Attribute.TYPE.QUANTITATIVE};
			if(thisCol._dataType||dataType==Attribute.TYPE.CATEGORICAL){
				thisCol._dataType=dataType;
			}
			for(var key in mergeCol){
				if(key=='_dataType'||key=='_min'||key=='_max'){
					continue;
				}else{
					if(thisCol[key]===undefined||thisCol[key]===null){
						thisCol[key]=thisCol[key]||true;
					}
					//thisCol[key]+=mergeCol[key];
				}
			}
			return thisCol;
		},
		prepare: function(){
			Filter.baseClass_.prototype.prepare.call(this);
		},
		update: function(){
			var data=this.input[0].getData();
			var properties=this.properties;
			var cols=properties.cols;
			if(data){
				if(data instanceof dataIndex.ObjectArrayData){
					properties.type='objectarray';
					for(var key in data.cols){
						cols[key]=this.mergeCol(cols[key],data.cols[key],data.cols[key]['_dataType']);
					}
				}else if(data instanceof dataIndex.ArrayData){
					properties.type='array';
					var key=data.label;
					cols[key]=this.mergeCol(cols[key],data.valueSet,data.dataType);
				}else if(data instanceof dataIndex.ObjectData){
					properties.type='object';
					for(var key in data.cols){
						cols[key]=this.mergeCol(cols[key],data.cols[key],data.cols[key]['_dataType']);
					}
				}else if(data instanceof dataIndex.Data){
					properties.type='data';
					var key=data.label;
					cols[key]=this.mergeCol(cols[key],data.valueSet,data.dataType);
				}else{
					properties.type='none';
					console.error('error: wrong data type');
				}
			}
		}
	},
	"objectType": "module_primitive",
	"primitiveType": "rect",
	"ui":{
		"createDom": function(){

			var that = this;
			var module = that.module;

			$(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content')
				.append(
				'<div class="module filter" id="' + that.uuid + '">' +
				'<div class="title"><span>' + module.label + '</span></div>' +
				'<div class="hr"></div>' +
				'<div class="content">' +
				'<div class="inputs"></div>' +
				'<div class="outputs"></div>' +
				'<div class="select"><select></select></div>' +
				'<div class="option"></div>' +
				'</div></div>');

			$(that.elSelector + ' .select select').on("change", function(){
				that.selectedCol = $(this).val();
				if(that.selectedCol != 'coding') {
					module.properties.selectedCol=that.selectedCol;
					module.properties.code=null;
				}
				else {
					$(this.elSelector + ' .codearea').css("display", "block");
				}
				that.fillOption();
			});
		},
		"update": function(){
			var that = this;
			FilterPanel.baseClass_.prototype.update.call(this);

			var module = that.module;
			console.log(module);
			var input = module.input[0];
			var inputUI = input.ui;
			inputUI.linkOn = true;
			inputUI.update();

			if(!input.linkFrom){
				$(that.elSelector + ' .content .select select').html('');
				$(that.elSelector + ' .option').html('');
			}

			else
			{
				if(!that.selectedCol){
					$(that.elSelector + ' .content .select select').html('');
					var flag = false, first = null;
					for(var key in module.properties.cols)
					{
						if(!flag){
							first = key;
							flag = true;
						}
						$(that.elSelector + ' .content .select select').append('<option>' + key + '</option>');
					}
					$(that.elSelector + ' .content .select select').append('<option>coding</option>');

					that.selectedCol = first;
					module.properties.selectedCol = first;
					that.fillOption();

				}
			}
		},
		"method":{
			"fillOption": function(){
				var that = this;
				if(that.selectedCol) {
					var module = this.module;
					$(that.elSelector + ' .option').html('');
					if(that.selectedCol != 'coding') {
						module.properties.code=null;
						var col = module.properties.cols[that.selectedCol];
						var dataType = col._dataType;
						if(dataType.label == "quantitative") {
							var min, max;
							for(var key in col) {
								if(key === '_dataType') {
									continue;
								}
								key = parseFloat(key);
								if(!min || (min > key)) {
									min = key;
								}
								if(!max || (max < key)) {
									max = key;
								}
							}

							module.properties._min = min;
							module.properties._max = max;

							$(that.elSelector + ' .option').html(
								'<div class="range"></div>' +
								'<div class="label min">min</div>' +
								'<div class="label max">max</div>' +
								'<div class="label selectmin">' + min + '</div>' +
								'<div class="label selectmax">' + max + '</div>');

							$(that.elSelector + " .option .range").slider({
								range: true,
								min: min * 100,
								max: max * 100,
								values: [ min * 100, max * 100 ],
								slide: function( event, ui ) {

									var rangeLength = 150;

									var curmin = ui.values[0];
									var curmax = ui.values[1];

									module.properties._min = curmin / 100;
									module.properties._max = curmax / 100;

									viscomposer.app.tryRender();

									$(that.elSelector + " .option .selectmin").html(curmin / 100).css("left", (curmin-min * 100)/(max-min)/100 * rangeLength);
									$(that.elSelector + " .option .selectmax").html(curmax / 100).css("right", (max * 100-curmax)/(max-min)/100 * rangeLength);

								}
							});


						}
						else if(dataType.label == "categorical"){

							$(that.elSelector + ' .option').append('<div class="checkboxset"></div>');

							for(var key in col)
							{
								if(key === '_dataType')
								{
									continue;
								}
								var checkedstr = '';
								if(col[key])
								{
									checkedstr = 'checked';
								}
								$(that.elSelector + ' .option .checkboxset').append('<div class="item"><input data="' + key + '" type="checkbox" ' + checkedstr + '>' + key + '</div>');
							}

							$(that.elSelector + ' .option .checkboxset .item input').on("click", function(){
								var key = $(that).attr("data");
								var checked = that.checked;
								(that.module.properties.cols[that.selectedCol])[key] = checked;
								viscomposer.app.tryRender();
							});
						}
					} else {
						$(that.elSelector + ' .option').html('<input type="text" class="code"><div class="codeSubmit">OK</div>');
						$(that.elSelector + ' .option .codeSubmit').on("click", function(){
							var code = $(that.elSelector + ' .code').val();
							module.properties.code=code;
							module.submit();
						});
					}
				}
			}
		}
	}
};

//store load