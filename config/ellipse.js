var viscomposerModule = {
  "name": "Ellipse",
  "type": "primitive",
  "basic":{
    "label": "Ellipse",
    "funName": "Ellipse",
    "resName": "ellipse",
    "input": [
      {
        "type": "map",
        "label": "cx",
        "varname": "cx",
        "value": "properties.cx||(properties.underLayout?'layout().x':150)"
      },
      {
        "type": "map",
        "label": "cy",
        "varname": "cy",
        "value": "properties.cy||(properties.underLayout?'layout().y':100)"
      },
      {
        "type": "map",
        "label": "rx",
        "varname": "rx",
        "value": "properties.rx||(properties.underLayout?'layout().width':100)"
      },
      {
        "type": "map",
        "label": "ry",
        "varname": "ry",
        "value": "properties.ry||(properties.underLayout?'layout().height':60)"
      },
      {
        "type": "map",
        "label": "color",
        "varname": "color",
        "value": "properties.color||'\"#3366dd\"'"
      },
      {
        "type": "map",
        "label": "style",
        "varname": "style",
        "value": "'\"\"'"
      }
    ],
    "output": [
      {
        "type": "geometry",
        "label": "ellipse",
        "varname": "ellipse"
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
        'function(cx,cy,rx,ry,color,style){\n'+
        'var createEllipse=function(x,y,width,height,color,style,uuid,no,parentTrans){'+
        '	var ellipse=document.createElementNS("http://www.w3.org/2000/svg","ellipse");'+
        '	ellipse.module=VObject.hashmap.get(uuid);'+
        '	ellipse.setAttribute("cx",cx);'+
        '	ellipse.setAttribute("cy",cy);'+
        '	ellipse.setAttribute("rx",rx);'+
        '	ellipse.setAttribute("ry",ry);'+
        '	ellipse.setAttribute("style","fill:"+color+";"+style);'+
        '	ellipse.parentTrans=parentTrans;'+
        '	ellipse.paintUnder=parentTrans.module;'+
        '	ellipse.geometryType="geometry";'+
        '	ellipse.env=env;'+
        '	ellipse.index=i;'+
        '	return ellipse;'+
        '};'+
        '    var ellipse=createEllipse(cx,cy,rx,ry,color,style,\''+uuid+'\',0,env.transform);\n'+
        '    return {\n'+
        '        '+this.geoOutput[0].varname+':ellipse,\n'+
        '        '+this.envOutput[0].varname+':{cx:cx,cy:cy,rx:rx,ry:ry},\n'+
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
          '<div class="module ellipse" id="' + that.uuid + '">' +
          '<div class="title">' +
          '<span>' + module.label + '</span>' +
          '<img src="' + (that.module.layoutIcon||viscomposer.app.imgPool["circle"]) + '">' +
          '</div>' +
          '<div class="hr"></div>' +
          '<div class="content">' +
          '<div class="inputs">' +
          '</div>' +
          '<div class="outputs">' +
          '</div></div></div>');
      },
      "update": function(){
        EllipsePanel.baseClass_.prototype.update.call(this);
        var input = this.module.input;
        for(var i = 0; i < input.length; i++) {
          input[i].ui.onSwitch();
          input[i].ui.update();
        }
      }
    }
  }
};

module.exports = viscomposerModule;