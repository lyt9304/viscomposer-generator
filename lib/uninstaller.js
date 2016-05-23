var log = require('./log');
var fs = require('fs');
var path = require('path');
var deleteHandler = require('./handler/delete');

function uninstaller(visRoot, moduleName, type){
  var pathMap = {
    primitive: path.join(visRoot, "src", "workflow", "primitive"),
    module: path.join(visRoot, "src", "workflow", "module"),
    layout: path.join(visRoot, "src", "workflow", "layout"),
    panel: path.join(visRoot, "src", "ui", "workflowWindow", "panel"),
    app: path.join(visRoot, "src", "app", "app.js")
  };

  // module and primitive that can not be uninstall
  var moduleClass = ["colschooser", "colselector", "counter", "custommodule", "datamodule", "filter", "modifiermodule", "sort"];
  var primitiveClass = ["circle", "indicator", "line", "path", "polyline", "rect", "text", "view"];

  if(moduleClass.indexOf(moduleName) !== -1 || primitiveClass.indexOf(moduleName) !== -1){
    log.error("This module can not be uninstalled");
    return;
  }

  //remove file
  try{
    var classPath = path.join(pathMap[type], moduleName.toLowerCase() + ".js");
    var panelPath = path.join(pathMap['panel'], moduleName.toLowerCase() + ".js");

    log.debug(classPath);
    log.debug(panelPath);

    fs.unlinkSync(classPath);
    fs.unlinkSync(panelPath);

  }catch(err){
    log.error("Something wrong with file delete");
    log.error(err);
  }

  //delete insert line
  deleteHandler(visRoot, moduleName, type);

}

module.exports = uninstaller;