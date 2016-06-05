var viscomposerModule = {
  "name": "TagCloud",
  "type": "module",
  "basic":{
    "label": "TagCloud",
    "funName": "TagCloud",
    "resName": "tagcloud",
    "input": [
      {
        "type": "input",
        "label": "input",
        "varname": "input"
      }
    ],
    "output": [
      {
        "type": "output",
        "label": "data_transformed",
        "varname": "data_transformed"
      }
    ],
    "properties":{

    }
  },
  "method": {
    "createTemplate": function(){
      var handler = function(input){
            //--------------------------局部变量定义&初始化--------------------------//
            var cloudRadians = Math.PI / 180,
                cw = 1 << 11 >> 5,
                ch = 1 << 11,
                canvas,
                ratio = 1;
            var count = 0,
                portOut = [];
            var color = d3.scale.category20c();
            if (typeof document !== "undefined") {
              canvas = document.createElement("canvas");
              canvas.width = 1;
              canvas.height = 1;
              ratio = Math.sqrt(canvas.getContext("2d").getImageData(0, 0, 1, 1).data.length >> 2);
              canvas.width = (cw << 5) / ratio;
              canvas.height = ch / ratio;
            } else {
              canvas = new Canvas(cw << 5, ch);
            }
            var c = canvas.getContext("2d"),
                spirals = {
                  archimedean: archimedeanSpiral,
                  rectangular: rectangularSpiral
                };
            c.fillStyle = c.strokeStyle = "red";
            c.textAlign = "center";
            var size = [900,900],
                words = [],
                weight = [];
            for(var index = 0;index < input.length;index++){
              console.log("index:"+JSON.stringify(input[index]));
              words.push(input[index].country);
              weight.push(Math.sqrt(parseInt(input[index].population)) / 4);
            }
            //函数输出tag的绘制属性----zzz->output
            console.log("size:"+size);
            console.log("words:"+words);
            console.log("weight:"+weight);
            var output = cloud(size,words,weight);

            console.log(output);

            return {output:output};

            //---------------------------函数定义---------------------------//
            function cloud(size,words,weight) {
              var size = size,
                  text = cloudText,
                  font = cloudFont,
                  fontSize = cloudFontSize,
                  fontStyle = cloudFontNormal,
                  fontWeight = cloudFontNormal,
                  rotate = cloudRotate,
                  padding = cloudPadding,
                  spiral = archimedeanSpiral,
                  words = words,
                  timeInterval = Infinity,
              //event = d3.dispatch("word", "end"),
                  timer = null,
                  cloud = {};
              words = words.map(function(d,i) {
                return {text: d, size:weight[i]};
              });
              return start();

              //开始计算tag位置
              function start() {
                var board = zeroArray((size[0] >> 5) * size[1]),
                    bounds = null,
                    n = words.length,
                    i = -1,
                    tags = [],
                    data = words.map(function(d, i) {
                      d.text = text.call(this, d, i);
                      d.font = font.call(this, d, i);
                      d.style = fontStyle.call(this, d, i);
                      d.weight = fontWeight.call(this, d, i);
                      d.rotate = rotate.call(this, d, i);
                      d.size = fontSize.call(this,d,i);
                      d.padding = padding.call(this, d, i);
                      return d;
                    }).sort(function(a, b) { return b.size - a.size; });
                if (timer) clearInterval(timer);
                timer = setInterval(step, 0);
                step();
                for(var p = 0;p < data.length;p++){
                  portOut.push(
                      {"text":data[p].text,
                        "x":data[p].x,
                        "y":data[p].y,
                        "rotate":data[p].rotate,
                        "font_size":data[p].size,
                        "color":color(data[p].text)}
                  );
                }

                return portOut;

                //添加单个单词到画布上
                function step() {
                  var start = +new Date,
                      d;
                  while (+new Date - start < timeInterval && ++i < n && timer) {

                    d = data[i];
                    d.x = (size[0] * (Math.random() + .5)) >> 1;
                    d.y = (size[1] * (Math.random() + .5)) >> 1;
                    cloudSprite(d, data, i);
                    if (d.hasText && place(board, d, bounds)) {
                      tags.push(d);
                      if (bounds) cloudBounds(bounds, d);
                      else bounds = [{x: d.x + d.x0, y: d.y + d.y0}, {x: d.x + d.x1, y: d.y + d.y1}];
                      d.x -= size[0] >> 1;
                      d.y -= size[1] >> 1;
                    }
                  }
                  if (i >= n) {
                    stop();
                  }
                }
              }
              function stop() {
                if (timer) {
                  clearInterval(timer);
                  timer = null;
                }
              };

              //计算单个tag位置并检测碰撞
              function place(board, tag, bounds) {
                var perimeter = [{x: 0, y: 0}, {x: size[0], y: size[1]}],
                    startX = tag.x,
                    startY = tag.y,
                    maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]),
                    s = spiral(size),
                    dt = Math.random() < .5 ? 1 : -1,
                    t = -dt,
                    dxdy,
                    dx,
                    dy;
                while (dxdy = s(t += dt)) {
                  dx = ~~dxdy[0];
                  dy = ~~dxdy[1];

                  if (Math.min(dx, dy) > maxDelta) break;

                  tag.x = startX + dx;
                  tag.y = startY + dy;

                  if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 ||
                      tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1]) continue;
                  // TODO only check for collisions within current bounds.
                  if (!bounds || !cloudCollide(tag, board, size[0])) {
                    if (!bounds || collideRects(tag, bounds)) {
                      var sprite = tag.sprite,
                          w = tag.width >> 5,
                          sw = size[0] >> 5,
                          lx = tag.x - (w << 4),
                          sx = lx & 0x7f,
                          msx = 32 - sx,
                          h = tag.y1 - tag.y0,
                          x = (tag.y + tag.y0) * sw + (lx >> 5),
                          last;
                      for (var j = 0; j < h; j++) {
                        last = 0;
                        for (var i = 0; i <= w; i++) {
                          board[x + i] |= (last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
                        }
                        x += sw;
                      }
                      delete tag.sprite;
                      return true;
                    }
                  }
                }
                return false;
              }
            }
            function cloudText(d) {
              return d.text;
            }

            function cloudFont() {
              return "serif";
            }

            function cloudFontNormal() {
              return "normal";
            }

            function cloudFontSize(d) {
              console.log(d.size);
              return Math.sqrt(d.size);
            }

            function cloudRotate() {
              return ((~~(Math.random() * 6) - 3) * 30);
              //return 0;
            }

            function cloudPadding() {
              return 1;
            }
            // Fetches a monochrome sprite bitmap for the specified text.
            // Load in batches for speed.
            function cloudSprite(d, data, di) {
              if (d.sprite) return;
              c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
              var x = 0,
                  y = 0,
                  maxh = 0,
                  n = data.length;
              --di;
              while (++di < n) {
                d = data[di];
                c.save();
                c.font = d.style + " " + d.weight + " " + ~~((d.size + 1) / ratio) + "px " + d.font;
                var w = c.measureText(d.text + "m").width * ratio,
                    h = d.size << 1;
                if (d.rotate) {
                  var sr = Math.sin(d.rotate * cloudRadians),
                      cr = Math.cos(d.rotate * cloudRadians),
                      wcr = w * cr,
                      wsr = w * sr,
                      hcr = h * cr,
                      hsr = h * sr;
                  w = (Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 0x1f) >> 5 << 5;
                  h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
                } else {
                  w = (w + 0x1f) >> 5 << 5;
                }
                if (h > maxh) maxh = h;
                if (x + w >= (cw << 5)) {
                  x = 0;
                  y += maxh;
                  maxh = 0;
                }
                if (y + h >= ch) break;
                c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
                if (d.rotate) c.rotate(d.rotate * cloudRadians);
                c.fillText(d.text, 0, 0);
                if (d.padding) c.lineWidth = 2 * d.padding, c.strokeText(d.text, 0, 0);
                c.restore();
                d.width = w;
                d.height = h;
                d.xoff = x;
                d.yoff = y;
                d.x1 = w >> 1;
                d.y1 = h >> 1;
                d.x0 = -d.x1;
                d.y0 = -d.y1;
                d.hasText = true;
                x += w;
              }
              var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data,
                  sprite = [];
              while (--di >= 0) {
                d = data[di];
                if (!d.hasText) continue;
                var w = d.width,
                    w32 = w >> 5,
                    h = d.y1 - d.y0;
                // Zero the buffer
                for (var i = 0; i < h * w32; i++) sprite[i] = 0;
                x = d.xoff;
                if (x == null) return;
                y = d.yoff;
                var seen = 0,
                    seenRow = -1;
                for (var j = 0; j < h; j++) {
                  for (var i = 0; i < w; i++) {
                    var k = w32 * j + (i >> 5),
                        m = pixels[((y + j) * (cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0;
                    sprite[k] |= m;
                    seen |= m;
                  }
                  if (seen) seenRow = j;
                  else {
                    d.y0++;
                    h--;
                    j--;
                    y++;
                  }
                }
                d.y1 = d.y0 + seenRow;
                d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
              }
            }

            // Use mask-based collision detection.
            function cloudCollide(tag, board, sw) {
              sw >>= 5;
              var sprite = tag.sprite,
                  w = tag.width >> 5,
                  lx = tag.x - (w << 4),
                  sx = lx & 0x7f,
                  msx = 32 - sx,
                  h = tag.y1 - tag.y0,
                  x = (tag.y + tag.y0) * sw + (lx >> 5),
                  last;
              for (var j = 0; j < h; j++) {
                last = 0;
                for (var i = 0; i <= w; i++) {
                  if (((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0))
                      & board[x + i]) return true;
                }
                x += sw;
              }
              return false;
            }

            function cloudBounds(bounds, d) {
              var b0 = bounds[0],
                  b1 = bounds[1];
              if (d.x + d.x0 < b0.x) b0.x = d.x + d.x0;
              if (d.y + d.y0 < b0.y) b0.y = d.y + d.y0;
              if (d.x + d.x1 > b1.x) b1.x = d.x + d.x1;
              if (d.y + d.y1 > b1.y) b1.y = d.y + d.y1;
            }

            function collideRects(a, b) {
              return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;
            }

            function archimedeanSpiral(size) {
              var e = size[0] / size[1];
              return function(t) {
                return [e * (t *= .1) * Math.cos(t), t * Math.sin(t)];
              };
            }

            function rectangularSpiral(size) {
              var dy = 4,
                  dx = dy * size[0] / size[1],
                  x = 0,
                  y = 0;
              return function(t) {
                var sign = t < 0 ? -1 : 1;
                // See triangular numbers: T_n = n * (n + 1) / 2.
                switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
                  case 0:  x += dx; break;
                  case 1:  y += dy; break;
                  case 2:  x -= dx; break;
                  default: y -= dy; break;
                }
                return [x, y];
              };
            }
            // TODO reuse arrays?
            function zeroArray(n) {
              var a = [],
                  i = -1;
              while (++i < n) a[i] = 0;
              return a;
            }

          };
      var templateStr = handler.toString();
      return templateStr;
    }
  },
  "ui":{
    "productive": true,
    "pos": [200, 100],
    "method":{
      "createDom": function(){
        var that = this;
        var module = that.module;
        $(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content')
            .append(
                '<div class="module tag-cloud" id="' + that.uuid + '">' +
                '<div class="title"><span>' + module.label + '</span></div>' +
                '<div class="hr"></div>' +
                '<div class="content">' +
                '<div class="inputs"></div>' +
                '<div class="outputs"></div>' +
                '</div>');
      },
      "update": function(){
        EllipsePanel.baseClass_.prototype.update.call(this);
        var inputs = this.module.input;
        for(var i = 0; i < inputs.length; i++) {
          var input = inputs[i];
          var inputUI = input.ui;
          inputUI.linkOn = true;
          inputUI.update();
        }
      }
    }
  }
};

module.exports = viscomposerModule;