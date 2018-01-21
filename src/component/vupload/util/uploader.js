Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var exif = require("./exif");

var xhrUpload = (function() {
  function xhrUpload(option, data, canvas, el, resolve, reject, num) {
    _classCallCheck(this, xhrUpload);
    
    option.file = data;
    this.option = {
      server: "/",
      header: {},
      quality: 10,
      withCredentials: false,
      compress: true
    };
    this.el = el;
    this.canvas = canvas;
    for (var i in option) {
      this.option[i] = option[i]
      if (i == 'header') {
        for (var j in option.header) {
          this.option.header[j] = option.header[j]
        }
      }
    }
    this.resolve = resolve;
    this.reject = reject;
    this.pageW = window.innerWidth;
    this.fileCanvas = [];
    
    this.xhr = new XMLHttpRequest() 
    //this.onready(num)
    this.onerror(num)
    
  }

  _createClass(xhrUpload, [
    {
      key: "initXMLHttpRequest",
      value: function initXMLHttpRequest() {
        this.xhr.open("POST", this.option.server);
        if (!this.option.withCredentials && "withCredentials" in this.xhr) {
          this.xhr.withCredentials = false;
        }
        for (var h in this.option.header) {
          if (
            this.option.header.hasOwnProperty(h) &&
            this.option.header[h] !== null
          ) {
            this.xhr.setRequestHeader(h, this.option.header[h]);
          }
        }
      }
    },
    {
      key: "onerror",
      value: function onerror(num) {
        var _this = this;
        
        this.xhr.onerror = function(e) {
          _this.reject(num)
        };
      }
    },
    {
      key: "onready",
      value: function onready(num, timer, cb) {
        var _this2 = this;

        this.el.disabled = true;
        var timeOut = setTimeout(function(){
          cb && cb(num)
        }, timer + 10000)
        this.xhr.onload = function() {
          var obj = {};
          _this2.el.disabled = false;
          try {
            if (_this2.xhr.readyState == 4 && _this2.xhr.status == 200) {
              clearTimeout(timeOut)
              if (_this2.fileCanvas.length !== 1) {
                Object.assign(_this2.fileCanvas[0], {
                  img: _this2.fileCanvas[0].img,
                  hide: true
                });
              } else {
                _this2.fileCanvas[0].hide = true;
              }
              _this2.option.success(_this2.response(0));
              _this2.resolve();
            } else if (_this2.xhr.status && _this2.xhr.status != 200) {
              clearTimeout(timeOut)
              cb && cb(num)
            }
          } catch (e) {
            clearTimeout(timeOut)
            cb && cb(num)
          }
        };
        
        this.xhr.upload.onprogress = function(e) {
          var percent = Math.round(e.loaded / e.total);

          _this2.option.progress && _this2.option.progress(percent);
        };

       return this.canvasDraw().then(function(data) {
          var sum = data.length;
          var num = 0;
          _this2.fileCanvas = _this2.fileCanvas.map(function(data) {
            return {
              hide: false,
              img: data
            };
          });
          _this2.option.start && _this2.option.start(_this2.fileCanvas[0]);
          setTimeout(function() {
            _this2.ajaxForm(data)
          }, timer)

          return new Promise(function(resolve, reject) {
            resolve(data)
          })
        })
      }
    },
    {
      key: "ajaxForm",
      value: function ajaxForm(data) {
        this.formData = new FormData();
        this.initXMLHttpRequest();
        this.formData.append("file", data[0], data[0].name);
        this.xhr.send(this.formData);
      }
    },
    {
      key: "response",
      value: function response(num) {
        var text = this.xhr.responseText || this.xhr.response;
        if (!text) {
          return text;
        }

        try {
          var json = JSON.parse(text);
          json.num = num;
          return json;
        } catch (e) {
          return text;
        }
      }
    },
    {
      key: "imgageWidth",
      value: function imgageWidth(a_w, a_h) {
        var w = this.pageW;
        if (a_w > w) {
          var h = Math.round(w * a_h / a_w);
          return {
            w: w,
            h: h
          };
        }
        return {
          w: a_w,
          h: a_h
        };
      }
    },
    {
      key: "canvasDraw",
      value: function canvasDraw() {
        var _this3 = this;
        return new Promise(function(resolve, reject) {
          var file = _this3.option.file;
          var oFile = void 0;
          var value = "";
          var type = void 0;
          var ctx = void 0;
          var promiseList = [];
          ctx = _this3.canvasCreate();
          oFile = new FileReader();
          type = /(jpg|webp|png|gif)$/.test(file.type) ? file.type : "image/jpeg";
          _this3.imageLoad(oFile, file, ctx, type, file.name)
            .then(function(value) {
              promiseList.push(value);
              resolve(promiseList);
            });
        });
      }
    },
    {
      key: "imageLoad",
      value: function imageLoad(oFile, file, ctx, type, name) {
        var _this4 = this;

        return new Promise(function(resolve, reject) {
          oFile.onload = function(e) {
            var files = e.target.result;
            var image = new Image();
            image.onload = function() {
              var obj = _this4.imgageWidth(image.width, image.height);
              _this4.canvas.width = obj.w;
              _this4.canvas.height = obj.h;
              _this4.exifImg(image, ctx, obj.w, obj.h).then(function(ctx) {
                var width = _this4.canvas.width,
                  height = _this4.canvas.height;
                ctx.drawImage(image, 0, 0, width, height);
                var dataUrl = _this4.canvas.toDataURL(
                  type,
                  _this4.option.quality
                );
                _this4.fileCanvas.push(dataUrl);
                var files = _this4.dataURLtoBlob(dataUrl);
                files.name = name;
                resolve(files);
              });
            };
            image.src = files;
          };
          oFile.readAsDataURL(file);
        });
      }
    },
    {
      key: "exifImg",
      value: function exifImg(file, ctx, width, height) {
        var _this5 = this;

        return new Promise(function(resolve, reject) {
          exif.getData(file, function() {
            var orientation = file.exifdata.Orientation;

            // 1 横着, 3 右斜, 6 左斜, 8 倒着
            if (orientation && orientation !== 1) {
              switch (orientation) {
                case 8:
                  // 8 倒着拍, 需要逆时针（向左）90 度旋转，并交换宽高，水平
                  _this5.canvas.width = height;
                  _this5.canvas.height = _this5.pageW * height / width;
                  ctx.rotate(-0.5 * Math.PI);
                  ctx.translate(-1 * _this5.pageW, 0);
                  break;
                case 6:
                  // 6 左斜或竖着拍, 需要顺时针（向右）90 度旋转

                  _this5.canvas.width = height;
                  _this5.canvas.height = _this5.pageW * height / width;
                  ctx.rotate(0.5 * Math.PI);
                  ctx.translate(0, -1 * (_this5.pageW * height / width));
                  break;
                case 3:
                  // 3 右斜, 需要顺时针（向右）180 度旋转
                  ctx.rotate(Math.PI);
                  ctx.translate(-1 * width, -1 * height);
                  break;
                case 1:
                  // 1 正常
                  ctx.rotate(0);
                  break;
                default:
                  ctx.rotate(0);
              }
            }
            resolve(ctx);
          });
        });
      }
    },
    {
      key: "canvasCreate",
      value: function canvasCreate() {
        this.canvas = document.createElement("canvas");
        document.documentElement.appendChild(this.canvas);
        this.canvas.style.display = "none";
        var ctx = this.canvas.getContext("2d");
        return ctx;
      }
    },
    {
      key: "dataURLtoBlob",
      value: function dataURLtoBlob(dataurl) {
        var byteString = atob(dataurl.split(",")[1]);
        var mimeString = dataurl
          .split(",")[0]
          .split(":")[1]
          .split(";")[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        //console.log(u8arr)
        return this.arrayBufferToBlob(ia, mimeString); //值，类型
      }
    },
    {
      key: "arrayBufferToBlob",
      value: function arrayBufferToBlob(buffer, type) {
        try {
          var blob = void 0;
          var Builder = window.BlobBuilder || window.WebKitBlobBuilder;
          // android 不支持 new Blob, 只能借助 blobbuilder.
          if (Builder) {
            var bb = new Builder();
            bb.append(buffer);
            blob = bb.getBlob(type);
          }
          // ios
          blob = new Blob([buffer], type ? { type: type } : {});
          return blob;
        } catch (e) {
          console.log(e);
        }
      }
    }
  ]);

  return xhrUpload;
})();

// xhrUpload.xhr = new XMLHttpRequest();

exports.default = function(defaults, canvas, el, arrs, cb) { 

  return new Promise(function(resolve, reject) {
    var object = {};
    for (var i in defaults.file) {
      object[i] = defaults.file[i]
    }
   
    var ob = void 0,
      num = 0,
      sum = defaults.file.length,
      timer = 0,
      obj = []
    start();

    function start() {

      
      if (num > sum - 1) {
        obj.forEach(function(data, index) {
          timer = num == 0 ? 0 : timer + 200
          myObject.publish(data, index, timer, cb)
        })
        return
      };
      
      ob = null;
      ob = new xhrUpload(defaults, object[num], canvas, el, resolve, reject, num);
      
      obj = myObject.subscribe(ob, arrs)
      num++;
      start();
    }
  });
};


var myObject = {
  subscribe: function(val, arrs) {
    arrs.push(val)
    return arrs
  },
  publish: function(val, num, timer, cb) {
    val.onready(num, timer, cb)
  }
}