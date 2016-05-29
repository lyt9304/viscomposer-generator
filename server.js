var http = require('http');
var query = require('querystring');
var uuid = require('node-uuid');
var path = require('path');
var fs = require('fs');
var browserify = require('browserify');

var log = require('./lib/log');

var moduleHandler = require('./lib/handler/module');
var panelHandler = require('./lib/handler/panel');
var defaultImg = "resource/image/element/primitive/User%20defined.png";

var port = 9000;

var errorResult = {
  status: 500
};

http.createServer(function(req, res) {
  var postdata = "";
  req.addListener("data",function(postchunk){
    postdata += postchunk;
  });

  //POST结束输出结果
  req.addListener("end",function(){
    var params = query.parse(postdata);
    var content = params['content'];

    eval(content);
    log.debug(viscomposerModule);

    var visRoot = "/Users/lyt9304/Sites/myVisual";
    var type = viscomposerModule["type"];
    var moduleName = viscomposerModule["name"];

    //log.debug("importedConfig:" + jsonFormat(importedConfig, formatConfig));
    log.debug("type:" + type);

    var pathMap = {
      primitive: path.join(visRoot, "src", "workflow", "primitive"),
      module: path.join(visRoot, "src", "workflow", "module"),
      layout: path.join(visRoot, "src", "workflow", "layout"),
      panel: path.join(visRoot, "src", "ui", "workflowWindow", "panel"),
      app: path.join(visRoot, "src", "app", "app.js")
    };

    if(!pathMap.hasOwnProperty(type)){
      log.error("There is no generator for type:" + type);
      return;
    }

    var classStr = moduleHandler(viscomposerModule, pathMap["module"], visRoot, true);
    var classPath = path.join(pathMap[type], moduleName+".tmp.js");
    log.debug(classStr);
    var panelStr = panelHandler(viscomposerModule, pathMap["panel"], true);
    var panelPath = path.join(pathMap["panel"], moduleName+".tmp.js");
    log.debug(panelStr);

    fs.writeFileSync(classPath, classStr);
    fs.writeFileSync(panelPath, panelStr);

    var b = browserify([panelPath, classPath],{
      debug:true
    });
    b.bundle().pipe(fs.createWriteStream('./tmp/bundle.js'));

    var result = {
      status:200,
      code:"haha"
    };
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.write(JSON.stringify(result));
    res.end();

  });
}).listen(port);

console.log("http server listening on port " + port);
