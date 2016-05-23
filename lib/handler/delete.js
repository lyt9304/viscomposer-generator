/**
 * Created by lyt9304 on 16/5/16.
 */

var path = require('path');
var fs = require('fs');
var log = require('../log');

function htmlDelete(filePath, root, name, type){
  var tag = {
    "primitive": "td",
    "module": "div"
  };

  var htmlStr = fs.readFileSync(path.join(root, filePath)).toString();
  var tagStr = tag[type];
  var replaceStr = '<' + tagStr + '><img src=".+" draggable="true" title="' + name + '" type="' + name.toLowerCase() + '"><\\\/' + tagStr + '>';
  var replaceRe = new RegExp(replaceStr);
  if(replaceRe.test(htmlStr)){
    htmlStr = htmlStr.replace(replaceRe, "");
    fs.writeFileSync(path.join(root, filePath), htmlStr);
  }else{
    log.warn("Nothing can be replaced in html!");
  }
}

function appDelete(filePath, root, name, type){

  var appStr = fs.readFileSync(path.join(root, filePath)).toString();

  var replaceStr = "'" + name.toLowerCase() + "': require('../workflow/" + type + "/" + name.toLowerCase() + "'),";
  if(appStr.indexOf(replaceStr) !== -1) {
    appStr = appStr.replace(replaceStr, "");
  }else{
    log.warn("Nothing can be replaced in app module/primitive registry!");
  }

  replaceStr = "" + name + ": require('../ui/workflowWindow/panel/" + name.toLowerCase() + "'),";
  if(appStr.indexOf(replaceStr) !== -1) {
    appStr = appStr.replace(replaceStr, "");
  }else{
    log.warn("Nothing can be replaced in app panel registry!");
  }

  fs.writeFileSync(path.join(root, filePath), appStr);
}

function primitiveIndexDelete(filePath, root, name, type){
  if(type !== "primitive"){
    return;
  }

  var indexStr = fs.readFileSync(path.join(root, filePath)).toString();
  var replaceStr = "'" + name.toLowerCase() + "':require('./" + name.toLowerCase() + "'),";

  if(indexStr.indexOf(replaceStr) !== -1) {
    indexStr = indexStr.replace(replaceStr, "");
  }else{
    log.warn("Nothing can be replaced in primitive index!");
  }

  fs.writeFileSync(path.join(root, filePath), indexStr);
}

var deleteHandler = function(root, name, type){
  var deleteFileHandlers = {
    "index.html":htmlDelete,
    "src/app/app.js":appDelete,
    "src/workflow/primitive/index.js":primitiveIndexDelete
  };

  for(var key in deleteFileHandlers){
    deleteFileHandlers[key].call(null, key, root, name, type);
  }
};

module.exports = deleteHandler;