/**
 * Created by lyt9304 on 16/5/16.
 */

var path = require('path');
var fs = require('fs');
var log = require('../log');

function htmlInsert(filePath, root, name, type, imgPath){
  var placeholder = {
    "primitive": "<!--primitive Class-->",
    "module": "<!--module Class-->"
  };

  var tag = {
    "primitive": "td",
    "module": "div"
  };

  var htmlStr = fs.readFileSync(path.join(root, filePath)).toString();
  var tagStr = tag[type];
  var replaceStr = '<' + tagStr + '><img src="' + imgPath + '" draggable="true" title="' + name + '" type="' + name.toLowerCase() + '"></' + tagStr + '>';
  if(htmlStr.indexOf(replaceStr) === -1){
    htmlStr = htmlStr.replace(placeholder[type], replaceStr + "\n" + placeholder[type]);
  }

  fs.writeFileSync(path.join(root, filePath), htmlStr);
}

function appInsert(filePath, root, name, type, imgPath){
  var placeholder = {
    "primitive": "//primitiveRegistry placeholder",
    "module": "//moduleRegistry placeholder",
    "panel": "//modulePanel placeholder"
  };

  var appStr = fs.readFileSync(path.join(root, filePath)).toString();
  var replaceStr = "'" + name.toLowerCase() + "': require('../workflow/" + type + "/" + name.toLowerCase() + "'),";
  if(appStr.indexOf(replaceStr) === -1) {
    appStr = appStr.replace(placeholder[type], replaceStr + "\n" + placeholder[type]);
  }

  replaceStr = "" + name + ": require('../ui/workflowWindow/panel/" + name.toLowerCase() + "'),";
  if(appStr.indexOf(replaceStr) === -1) {
    appStr = appStr.replace(placeholder["panel"], replaceStr + "\n" + placeholder["panel"]);
  }

  fs.writeFileSync(path.join(root, filePath), appStr);
}

function primitiveIndexInsert(filePath, root, name, type, imgPath){
  if(type !== "primitive"){
    return;
  }

  log.debug("test");

  var placeholder = "//primitive placeholder";
  var indexStr = fs.readFileSync(path.join(root, filePath)).toString();
  var replaceStr = "'" + name.toLowerCase() + "':require('./" + name.toLowerCase() + "'),";

  if(indexStr.indexOf(replaceStr) === -1) {
    indexStr = indexStr.replace(placeholder, replaceStr + "\n" + placeholder);
  }

  fs.writeFileSync(path.join(root, filePath), indexStr);
}

var insertHandler = function(root, name, type, imgPath){
  var insertFileHandlers = {
    "index.html":htmlInsert,
    "src/app/app.js":appInsert,
    "src/workflow/primitive/index.js":primitiveIndexInsert
  };

  for(var key in insertFileHandlers){
    insertFileHandlers[key].call(null, key, root, name, type, imgPath);
  }
};

module.exports = insertHandler;