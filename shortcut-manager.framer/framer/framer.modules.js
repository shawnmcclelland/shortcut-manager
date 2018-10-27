require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"input":[function(require,module,exports){
var wrapInput,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Events.EnterKey = "EnterKey";

Events.SpaceKey = "SpaceKey";

Events.BackspaceKey = "BackspaceKey";

Events.CapsLockKey = "CapsLockKey";

Events.ShiftKey = "ShiftKey";

Events.ValueChange = "ValueChange";

Events.InputFocus = "InputFocus";

Events.InputBlur = "InputBlur";

exports.InputLayer = (function(superClass) {
  extend(InputLayer, superClass);

  function InputLayer(options) {
    var base, currentValue, property, textProperties, value;
    if (options == null) {
      options = {};
    }
    this._setTextProperties = bind(this._setTextProperties, this);
    this._setPlaceholder = bind(this._setPlaceholder, this);
    _.defaults(options, {
      backgroundColor: "#FFF",
      width: 375,
      height: 60,
      padding: {
        left: 20
      },
      text: "Type something...",
      fontSize: 40,
      fontWeight: 300
    });
    if (options.multiLine) {
      if ((base = options.padding).top == null) {
        base.top = 20;
      }
    }
    this._inputElement = document.createElement("input");
    this._inputElement.style.position = "absolute";
    InputLayer.__super__.constructor.call(this, options);
    this._background = void 0;
    this._placeholder = void 0;
    this._isDesignLayer = false;
    this.input = new Layer({
      backgroundColor: "transparent",
      name: "input",
      width: this.width,
      height: this.height,
      parent: this
    });
    if (this.multiLine) {
      this._inputElement = document.createElement("textarea");
    }
    this.input._element.appendChild(this._inputElement);
    this._setTextProperties(this);
    this._inputElement.autocomplete = "off";
    this._inputElement.autocorrect = "off";
    this._inputElement.spellcheck = false;
    this._inputElement.className = "input" + this.id;
    textProperties = {
      text: this.text,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      lineHeight: this.lineHeight,
      fontWeight: this.fontWeight,
      color: this.color,
      backgroundColor: this.backgroundColor,
      width: this.width,
      height: this.height,
      padding: this.padding,
      parent: this.parent
    };
    for (property in textProperties) {
      value = textProperties[property];
      this.on("change:" + property, (function(_this) {
        return function(value) {
          _this._elementHTML.children[0].textContent = "";
          if (_this._isDesignLayer) {
            return;
          }
          _this._setTextProperties(_this);
          return _this._setPlaceholderColor(_this._id, _this.color);
        };
      })(this));
    }
    this._setPlaceholder(this.text);
    this._setPlaceholderColor(this._id, this.color);
    this._elementHTML.children[0].textContent = "";
    this._isFocused = false;
    this._inputElement.onfocus = (function(_this) {
      return function(e) {
        if (_this.focusColor == null) {
          _this.focusColor = "#000";
        }
        _this.emit(Events.InputFocus, event);
        return _this._isFocused = true;
      };
    })(this);
    this._inputElement.onblur = (function(_this) {
      return function(e) {
        _this.emit(Events.InputBlur, event);
        return _this._isFocused = false;
      };
    })(this);
    currentValue = void 0;
    this._inputElement.onkeydown = (function(_this) {
      return function(e) {
        currentValue = _this.value;
        if (e.which === 20) {
          _this.emit(Events.CapsLockKey, event);
        }
        if (e.which === 16) {
          return _this.emit(Events.ShiftKey, event);
        }
      };
    })(this);
    this._inputElement.onkeyup = (function(_this) {
      return function(e) {
        if (currentValue !== _this.value) {
          _this.emit("change:value", _this.value);
          _this.emit(Events.ValueChange, _this.value);
        }
        if (e.which === 13) {
          _this.emit(Events.EnterKey, event);
        }
        if (e.which === 8) {
          _this.emit(Events.BackspaceKey, event);
        }
        if (e.which === 32) {
          _this.emit(Events.SpaceKey, event);
        }
        if (e.which === 20) {
          return _this.emit(Events.CapsLockKey, event);
        }
      };
    })(this);
  }

  InputLayer.prototype._setPlaceholder = function(text) {
    return this._inputElement.placeholder = text;
  };

  InputLayer.prototype._setPlaceholderColor = function(id, color) {
    return document.styleSheets[0].addRule(".input" + id + "::-webkit-input-placeholder", "color: " + color);
  };

  InputLayer.prototype._checkDevicePixelRatio = function() {
    var dpr, ratio;
    ratio = Screen.width / Framer.Device.screen.width;
    if (Utils.isDesktop()) {
      if (ratio < 0.5 && ratio > 0.25) {
        dpr = 1 - ratio;
      } else if (ratio === 0.25) {
        dpr = 1 - (ratio * 2);
      } else {
        dpr = Utils.devicePixelRatio();
      }
      if (Framer.Device.deviceType === "fullscreen") {
        dpr = 2;
      }
    } else {
      if (ratio < 0.5 && ratio > 0.25) {
        dpr = 1 - ratio;
      } else if (ratio === 0.25) {
        dpr = 1 - (ratio * 2);
      } else if (ratio === 0.5) {
        dpr = 1;
      }
    }
    return dpr;
  };

  InputLayer.prototype._setTextProperties = function(layer) {
    var dpr, ref;
    dpr = this._checkDevicePixelRatio();
    if (!this._isDesignLayer) {
      this._inputElement.style.fontFamily = layer.fontFamily;
      this._inputElement.style.fontSize = (layer.fontSize / dpr) + "px";
      this._inputElement.style.fontWeight = (ref = layer.fontWeight) != null ? ref : "normal";
      this._inputElement.style.paddingTop = (layer.padding.top * 2 / dpr) + "px";
      this._inputElement.style.paddingRight = (layer.padding.bottom * 2 / dpr) + "px";
      this._inputElement.style.paddingBottom = (layer.padding.right * 2 / dpr) + "px";
      this._inputElement.style.paddingLeft = (layer.padding.left * 2 / dpr) + "px";
    }
    this._inputElement.style.width = ((layer.width - layer.padding.left * 2) * 2 / dpr) + "px";
    this._inputElement.style.height = (layer.height * 2 / dpr) + "px";
    this._inputElement.style.outline = "none";
    this._inputElement.style.backgroundColor = "transparent";
    this._inputElement.style.cursor = "auto";
    this._inputElement.style.webkitAppearance = "none";
    this._inputElement.style.resize = "none";
    this._inputElement.style.overflow = "hidden";
    return this._inputElement.style.webkitFontSmoothing = "antialiased";
  };

  InputLayer.prototype.addBackgroundLayer = function(layer) {
    this._background = layer;
    this._background.parent = this;
    this._background.name = "background";
    this._background.x = this._background.y = 0;
    this._background._element.appendChild(this._inputElement);
    return this._background;
  };

  InputLayer.prototype.addPlaceHolderLayer = function(layer) {
    var dpr;
    this._isDesignLayer = true;
    this._inputElement.className = "input" + layer.id;
    this.padding = {
      left: 0,
      top: 0
    };
    this._setPlaceholder(layer.text);
    this._setTextProperties(layer);
    this._setPlaceholderColor(layer.id, layer.color);
    this.on("change:color", (function(_this) {
      return function() {
        return _this._setPlaceholderColor(layer.id, _this.color);
      };
    })(this));
    layer.visible = false;
    this._elementHTML.children[0].textContent = "";
    dpr = this._checkDevicePixelRatio();
    this._inputElement.style.fontSize = (layer.fontSize * 2 / dpr) + "px";
    this._inputElement.style.paddingTop = (layer.y * 2 / dpr) + "px";
    this._inputElement.style.paddingLeft = (layer.x * 2 / dpr) + "px";
    this._inputElement.style.width = ((this._background.width - layer.x * 2) * 2 / dpr) + "px";
    if (this.multiLine) {
      this._inputElement.style.height = (this._background.height * 2 / dpr) + "px";
    }
    this.on("change:padding", (function(_this) {
      return function() {
        _this._inputElement.style.paddingTop = (_this.padding.top * 2 / dpr) + "px";
        return _this._inputElement.style.paddingLeft = (_this.padding.left * 2 / dpr) + "px";
      };
    })(this));
    return this._placeholder;
  };

  InputLayer.prototype.focus = function() {
    return this._inputElement.focus();
  };

  InputLayer.define("value", {
    get: function() {
      return this._inputElement.value;
    },
    set: function(value) {
      return this._inputElement.value = value;
    }
  });

  InputLayer.define("focusColor", {
    get: function() {
      return this._inputElement.style.color;
    },
    set: function(value) {
      return this._inputElement.style.color = value;
    }
  });

  InputLayer.define("multiLine", InputLayer.simpleProperty("multiLine", false));

  InputLayer.wrap = function(background, placeholder, options) {
    return wrapInput(new this(options), background, placeholder, options);
  };

  InputLayer.prototype.onEnterKey = function(cb) {
    return this.on(Events.EnterKey, cb);
  };

  InputLayer.prototype.onSpaceKey = function(cb) {
    return this.on(Events.SpaceKey, cb);
  };

  InputLayer.prototype.onBackspaceKey = function(cb) {
    return this.on(Events.BackspaceKey, cb);
  };

  InputLayer.prototype.onCapsLockKey = function(cb) {
    return this.on(Events.CapsLockKey, cb);
  };

  InputLayer.prototype.onShiftKey = function(cb) {
    return this.on(Events.ShiftKey, cb);
  };

  InputLayer.prototype.onValueChange = function(cb) {
    return this.on(Events.ValueChange, cb);
  };

  InputLayer.prototype.onInputFocus = function(cb) {
    return this.on(Events.InputFocus, cb);
  };

  InputLayer.prototype.onInputBlur = function(cb) {
    return this.on(Events.InputBlur, cb);
  };

  return InputLayer;

})(TextLayer);

wrapInput = function(instance, background, placeholder) {
  var input, ref;
  if (!(background instanceof Layer)) {
    throw new Error("InputLayer expects a background layer.");
  }
  if (!(placeholder instanceof TextLayer)) {
    throw new Error("InputLayer expects a text layer.");
  }
  input = instance;
  if (input.__framerInstanceInfo == null) {
    input.__framerInstanceInfo = {};
  }
  if ((ref = input.__framerInstanceInfo) != null) {
    ref.name = instance.constructor.name;
  }
  input.frame = background.frame;
  input.parent = background.parent;
  input.index = background.index;
  input.addBackgroundLayer(background);
  input.addPlaceHolderLayer(placeholder);
  return input;
};


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NoYXdubWNjbGVsbGFuZC9Eb2N1bWVudHMvUHJvamVjdHMvc2hvcnRjdXQtbWFuYWdlci9zaG9ydGN1dC1tYW5hZ2VyLmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3NoYXdubWNjbGVsbGFuZC9Eb2N1bWVudHMvUHJvamVjdHMvc2hvcnRjdXQtbWFuYWdlci9zaG9ydGN1dC1tYW5hZ2VyLmZyYW1lci9tb2R1bGVzL2lucHV0LmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cbmV4cG9ydHMubXlWYXIgPSBcIm15VmFyaWFibGVcIlxuXG5leHBvcnRzLm15RnVuY3Rpb24gPSAtPlxuXHRwcmludCBcIm15RnVuY3Rpb24gaXMgcnVubmluZ1wiXG5cbmV4cG9ydHMubXlBcnJheSA9IFsxLCAyLCAzXSIsIkV2ZW50cy5FbnRlcktleSA9IFwiRW50ZXJLZXlcIlxuRXZlbnRzLlNwYWNlS2V5ID0gXCJTcGFjZUtleVwiXG5FdmVudHMuQmFja3NwYWNlS2V5ID0gXCJCYWNrc3BhY2VLZXlcIlxuRXZlbnRzLkNhcHNMb2NrS2V5ID0gXCJDYXBzTG9ja0tleVwiXG5FdmVudHMuU2hpZnRLZXkgPSBcIlNoaWZ0S2V5XCJcbkV2ZW50cy5WYWx1ZUNoYW5nZSA9IFwiVmFsdWVDaGFuZ2VcIlxuRXZlbnRzLklucHV0Rm9jdXMgPSBcIklucHV0Rm9jdXNcIlxuRXZlbnRzLklucHV0Qmx1ciA9IFwiSW5wdXRCbHVyXCJcblxuY2xhc3MgZXhwb3J0cy5JbnB1dExheWVyIGV4dGVuZHMgVGV4dExheWVyXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXG5cdFx0Xy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIiNGRkZcIlxuXHRcdFx0d2lkdGg6IDM3NVxuXHRcdFx0aGVpZ2h0OiA2MFxuXHRcdFx0cGFkZGluZzpcblx0XHRcdFx0bGVmdDogMjBcblx0XHRcdHRleHQ6IFwiVHlwZSBzb21ldGhpbmcuLi5cIlxuXHRcdFx0Zm9udFNpemU6IDQwXG5cdFx0XHRmb250V2VpZ2h0OiAzMDBcblxuXHRcdGlmIG9wdGlvbnMubXVsdGlMaW5lXG5cdFx0XHRvcHRpb25zLnBhZGRpbmcudG9wID89IDIwXG5cblx0XHRAX2lucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiXG5cblx0XHRzdXBlciBvcHRpb25zXG5cblx0XHQjIEdsb2JhbHNcblx0XHRAX2JhY2tncm91bmQgPSB1bmRlZmluZWRcblx0XHRAX3BsYWNlaG9sZGVyID0gdW5kZWZpbmVkXG5cdFx0QF9pc0Rlc2lnbkxheWVyID0gZmFsc2VcblxuXHRcdCMgTGF5ZXIgY29udGFpbmluZyBpbnB1dCBlbGVtZW50XG5cdFx0QGlucHV0ID0gbmV3IExheWVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRcdFx0bmFtZTogXCJpbnB1dFwiXG5cdFx0XHR3aWR0aDogQHdpZHRoXG5cdFx0XHRoZWlnaHQ6IEBoZWlnaHRcblx0XHRcdHBhcmVudDogQFxuXG5cdFx0IyBUZXh0IGFyZWFcblx0XHRpZiBAbXVsdGlMaW5lXG5cdFx0XHRAX2lucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKVxuXG5cdFx0IyBBcHBlbmQgZWxlbWVudFxuXHRcdEBpbnB1dC5fZWxlbWVudC5hcHBlbmRDaGlsZChAX2lucHV0RWxlbWVudClcblxuXHRcdCMgTWF0Y2ggVGV4dExheWVyIGRlZmF1bHRzIGFuZCB0eXBlIHByb3BlcnRpZXNcblx0XHRAX3NldFRleHRQcm9wZXJ0aWVzKEApXG5cblx0XHQjIFNldCBhdHRyaWJ1dGVzXG5cdFx0QF9pbnB1dEVsZW1lbnQuYXV0b2NvbXBsZXRlID0gXCJvZmZcIlxuXHRcdEBfaW5wdXRFbGVtZW50LmF1dG9jb3JyZWN0ID0gXCJvZmZcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnNwZWxsY2hlY2sgPSBmYWxzZVxuXG5cdFx0IyBUaGUgaWQgc2VydmVzIHRvIGRpZmZlcmVudGlhdGUgbXVsdGlwbGUgaW5wdXQgZWxlbWVudHMgZnJvbSBvbmUgYW5vdGhlci5cblx0XHQjIFRvIGFsbG93IHN0eWxpbmcgdGhlIHBsYWNlaG9sZGVyIGNvbG9ycyBvZiBzZXBlcmF0ZSBlbGVtZW50cy5cblx0XHRAX2lucHV0RWxlbWVudC5jbGFzc05hbWUgPSBcImlucHV0XCIgKyBAaWRcblxuXHRcdCMgQWxsIGluaGVyaXRlZCBwcm9wZXJ0aWVzXG5cdFx0dGV4dFByb3BlcnRpZXMgPVxuXHRcdFx0e0B0ZXh0LCBAZm9udEZhbWlseSwgQGZvbnRTaXplLCBAbGluZUhlaWdodCwgQGZvbnRXZWlnaHQsIEBjb2xvciwgQGJhY2tncm91bmRDb2xvciwgQHdpZHRoLCBAaGVpZ2h0LCBAcGFkZGluZywgQHBhcmVudH1cblxuXHRcdGZvciBwcm9wZXJ0eSwgdmFsdWUgb2YgdGV4dFByb3BlcnRpZXNcblxuXHRcdFx0QG9uIFwiY2hhbmdlOiN7cHJvcGVydHl9XCIsICh2YWx1ZSkgPT5cblx0XHRcdFx0IyBSZXNldCB0ZXh0TGF5ZXIgY29udGVudHNcblx0XHRcdFx0QF9lbGVtZW50SFRNTC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IFwiXCJcblxuXHRcdFx0XHRyZXR1cm4gaWYgQF9pc0Rlc2lnbkxheWVyXG5cdFx0XHRcdEBfc2V0VGV4dFByb3BlcnRpZXMoQClcblx0XHRcdFx0QF9zZXRQbGFjZWhvbGRlckNvbG9yKEBfaWQsIEBjb2xvcilcblxuXG5cdFx0IyBTZXQgZGVmYXVsdCBwbGFjZWhvbGRlclxuXHRcdEBfc2V0UGxhY2Vob2xkZXIoQHRleHQpXG5cdFx0QF9zZXRQbGFjZWhvbGRlckNvbG9yKEBfaWQsIEBjb2xvcilcblxuXHRcdCMgUmVzZXQgdGV4dExheWVyIGNvbnRlbnRzXG5cdFx0QF9lbGVtZW50SFRNTC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IFwiXCJcblxuXHRcdCMgQ2hlY2sgaWYgaW4gZm9jdXNcblx0XHRAX2lzRm9jdXNlZCA9IGZhbHNlXG5cblx0XHQjIERlZmF1bHQgZm9jdXMgaW50ZXJhY3Rpb25cblx0XHRAX2lucHV0RWxlbWVudC5vbmZvY3VzID0gKGUpID0+XG5cblx0XHRcdEBmb2N1c0NvbG9yID89IFwiIzAwMFwiXG5cblx0XHRcdCMgRW1pdCBmb2N1cyBldmVudFxuXHRcdFx0QGVtaXQoRXZlbnRzLklucHV0Rm9jdXMsIGV2ZW50KVxuXG5cdFx0XHRAX2lzRm9jdXNlZCA9IHRydWVcblxuXHRcdCMgRW1pdCBibHVyIGV2ZW50XG5cdFx0QF9pbnB1dEVsZW1lbnQub25ibHVyID0gKGUpID0+XG5cdFx0XHRAZW1pdChFdmVudHMuSW5wdXRCbHVyLCBldmVudClcblxuXHRcdFx0QF9pc0ZvY3VzZWQgPSBmYWxzZVxuXG5cdFx0IyBUbyBmaWx0ZXIgaWYgdmFsdWUgY2hhbmdlZCBsYXRlclxuXHRcdGN1cnJlbnRWYWx1ZSA9IHVuZGVmaW5lZFxuXG5cdFx0IyBTdG9yZSBjdXJyZW50IHZhbHVlXG5cdFx0QF9pbnB1dEVsZW1lbnQub25rZXlkb3duID0gKGUpID0+XG5cdFx0XHRjdXJyZW50VmFsdWUgPSBAdmFsdWVcblxuXHRcdFx0IyBJZiBjYXBzIGxvY2sga2V5IGlzIHByZXNzZWQgZG93blxuXHRcdFx0aWYgZS53aGljaCBpcyAyMFxuXHRcdFx0XHRAZW1pdChFdmVudHMuQ2Fwc0xvY2tLZXksIGV2ZW50KVxuXG5cdFx0XHQjIElmIHNoaWZ0IGtleSBpcyBwcmVzc2VkXG5cdFx0XHRpZiBlLndoaWNoIGlzIDE2XG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5TaGlmdEtleSwgZXZlbnQpXG5cblx0XHRAX2lucHV0RWxlbWVudC5vbmtleXVwID0gKGUpID0+XG5cblx0XHRcdGlmIGN1cnJlbnRWYWx1ZSBpc250IEB2YWx1ZVxuXHRcdFx0XHRAZW1pdChcImNoYW5nZTp2YWx1ZVwiLCBAdmFsdWUpXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5WYWx1ZUNoYW5nZSwgQHZhbHVlKVxuXG5cdFx0XHQjIElmIGVudGVyIGtleSBpcyBwcmVzc2VkXG5cdFx0XHRpZiBlLndoaWNoIGlzIDEzXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5FbnRlcktleSwgZXZlbnQpXG5cblx0XHRcdCMgSWYgYmFja3NwYWNlIGtleSBpcyBwcmVzc2VkXG5cdFx0XHRpZiBlLndoaWNoIGlzIDhcblx0XHRcdFx0QGVtaXQoRXZlbnRzLkJhY2tzcGFjZUtleSwgZXZlbnQpXG5cblx0XHRcdCMgSWYgc3BhY2Uga2V5IGlzIHByZXNzZWRcblx0XHRcdGlmIGUud2hpY2ggaXMgMzJcblx0XHRcdFx0QGVtaXQoRXZlbnRzLlNwYWNlS2V5LCBldmVudClcblxuXHRcdFx0IyBJZiBjYXBzIGxvY2sga2V5IGlzIHByZXNzZWQgdXBcblx0XHRcdGlmIGUud2hpY2ggaXMgMjBcblx0XHRcdFx0QGVtaXQoRXZlbnRzLkNhcHNMb2NrS2V5LCBldmVudClcblxuXHRfc2V0UGxhY2Vob2xkZXI6ICh0ZXh0KSA9PlxuXHRcdEBfaW5wdXRFbGVtZW50LnBsYWNlaG9sZGVyID0gdGV4dFxuXG5cdF9zZXRQbGFjZWhvbGRlckNvbG9yOiAoaWQsIGNvbG9yKSAtPlxuXHRcdGRvY3VtZW50LnN0eWxlU2hlZXRzWzBdLmFkZFJ1bGUoXCIuaW5wdXQje2lkfTo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlclwiLCBcImNvbG9yOiAje2NvbG9yfVwiKVxuXG5cdF9jaGVja0RldmljZVBpeGVsUmF0aW86IC0+XG5cdFx0cmF0aW8gPSAoU2NyZWVuLndpZHRoIC8gRnJhbWVyLkRldmljZS5zY3JlZW4ud2lkdGgpXG5cdFx0aWYgVXRpbHMuaXNEZXNrdG9wKClcblx0XHRcdCMgQDN4XG5cdFx0XHRpZiByYXRpbyA8IDAuNSBhbmQgcmF0aW8gPiAwLjI1XG5cdFx0XHRcdGRwciA9IDEgLSByYXRpb1xuXHRcdFx0IyBANHhcblx0XHRcdGVsc2UgaWYgcmF0aW8gaXMgMC4yNVxuXHRcdFx0XHRkcHIgPSAxIC0gKHJhdGlvICogMilcblx0XHRcdCMgQDF4LCBAMnhcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZHByID0gVXRpbHMuZGV2aWNlUGl4ZWxSYXRpbygpXG5cdFx0XHRpZiBGcmFtZXIuRGV2aWNlLmRldmljZVR5cGUgaXMgXCJmdWxsc2NyZWVuXCJcblx0XHRcdFx0ZHByID0gMlxuXHRcdGVsc2Vcblx0XHRcdCMgQDN4XG5cdFx0XHRpZiByYXRpbyA8IDAuNSBhbmQgcmF0aW8gPiAwLjI1XG5cdFx0XHRcdGRwciA9IDEgLSByYXRpb1xuXHRcdFx0IyBANHhcblx0XHRcdGVsc2UgaWYgcmF0aW8gaXMgMC4yNVxuXHRcdFx0XHRkcHIgPSAxIC0gKHJhdGlvICogMilcblx0XHRcdCMgQDF4LCBAMnhcblx0XHRcdGVsc2UgaWYgcmF0aW8gaXMgMC41XG5cdFx0XHRcdGRwciA9IDFcblxuXHRcdHJldHVybiBkcHJcblxuXHRfc2V0VGV4dFByb3BlcnRpZXM6IChsYXllcikgPT5cblxuXHRcdGRwciA9IEBfY2hlY2tEZXZpY2VQaXhlbFJhdGlvKClcblxuXHRcdGlmIG5vdCBAX2lzRGVzaWduTGF5ZXJcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmZvbnRGYW1pbHkgPSBsYXllci5mb250RmFtaWx5XG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IFwiI3tsYXllci5mb250U2l6ZSAvIGRwcn1weFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gbGF5ZXIuZm9udFdlaWdodCA/IFwibm9ybWFsXCJcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdUb3AgPSBcIiN7bGF5ZXIucGFkZGluZy50b3AgKiAyIC8gZHByfXB4XCJcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiI3tsYXllci5wYWRkaW5nLmJvdHRvbSAqIDIgLyBkcHJ9cHhcIlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ0JvdHRvbSA9IFwiI3tsYXllci5wYWRkaW5nLnJpZ2h0ICogMiAvIGRwcn1weFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiI3tsYXllci5wYWRkaW5nLmxlZnQgKiAyIC8gZHByfXB4XCJcblxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLndpZHRoID0gXCIjeygobGF5ZXIud2lkdGggLSBsYXllci5wYWRkaW5nLmxlZnQgKiAyKSAqIDIgLyBkcHIpfXB4XCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIiN7bGF5ZXIuaGVpZ2h0ICogMiAvIGRwcn1weFwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUub3V0bGluZSA9IFwibm9uZVwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ0cmFuc3BhcmVudFwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuY3Vyc29yID0gXCJhdXRvXCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS53ZWJraXRBcHBlYXJhbmNlID0gXCJub25lXCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5yZXNpemUgPSBcIm5vbmVcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLndlYmtpdEZvbnRTbW9vdGhpbmcgPSBcImFudGlhbGlhc2VkXCJcblxuXHRhZGRCYWNrZ3JvdW5kTGF5ZXI6IChsYXllcikgLT5cblx0XHRAX2JhY2tncm91bmQgPSBsYXllclxuXHRcdEBfYmFja2dyb3VuZC5wYXJlbnQgPSBAXG5cdFx0QF9iYWNrZ3JvdW5kLm5hbWUgPSBcImJhY2tncm91bmRcIlxuXHRcdEBfYmFja2dyb3VuZC54ID0gQF9iYWNrZ3JvdW5kLnkgPSAwXG5cdFx0QF9iYWNrZ3JvdW5kLl9lbGVtZW50LmFwcGVuZENoaWxkKEBfaW5wdXRFbGVtZW50KVxuXG5cdFx0cmV0dXJuIEBfYmFja2dyb3VuZFxuXG5cdGFkZFBsYWNlSG9sZGVyTGF5ZXI6IChsYXllcikgLT5cblxuXHRcdEBfaXNEZXNpZ25MYXllciA9IHRydWVcblx0XHRAX2lucHV0RWxlbWVudC5jbGFzc05hbWUgPSBcImlucHV0XCIgKyBsYXllci5pZFxuXHRcdEBwYWRkaW5nID0gbGVmdDogMCwgdG9wOiAwXG5cblx0XHRAX3NldFBsYWNlaG9sZGVyKGxheWVyLnRleHQpXG5cdFx0QF9zZXRUZXh0UHJvcGVydGllcyhsYXllcilcblx0XHRAX3NldFBsYWNlaG9sZGVyQ29sb3IobGF5ZXIuaWQsIGxheWVyLmNvbG9yKVxuXG5cdFx0QG9uIFwiY2hhbmdlOmNvbG9yXCIsID0+XG5cdFx0XHRAX3NldFBsYWNlaG9sZGVyQ29sb3IobGF5ZXIuaWQsIEBjb2xvcilcblxuXHRcdCMgUmVtb3ZlIG9yaWdpbmFsIGxheWVyXG5cdFx0bGF5ZXIudmlzaWJsZSA9IGZhbHNlXG5cdFx0QF9lbGVtZW50SFRNTC5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IFwiXCJcblxuXHRcdCMgQ29udmVydCBwb3NpdGlvbiB0byBwYWRkaW5nXG5cdFx0ZHByID0gQF9jaGVja0RldmljZVBpeGVsUmF0aW8oKVxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmZvbnRTaXplID0gXCIje2xheWVyLmZvbnRTaXplICogMiAvIGRwcn1weFwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ1RvcCA9IFwiI3tsYXllci55ICogMiAvIGRwcn1weFwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQgPSBcIiN7bGF5ZXIueCAqIDIgLyBkcHJ9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLndpZHRoID0gXCIjeyhAX2JhY2tncm91bmQud2lkdGggLSBsYXllci54ICogMikgKiAyIC8gZHByfXB4XCJcblxuXHRcdGlmIEBtdWx0aUxpbmVcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiI3tAX2JhY2tncm91bmQuaGVpZ2h0ICogMiAvIGRwcn1weFwiXG5cblx0XHRAb24gXCJjaGFuZ2U6cGFkZGluZ1wiLCA9PlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ1RvcCA9IFwiI3tAcGFkZGluZy50b3AgKiAyIC8gZHByfXB4XCJcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIje0BwYWRkaW5nLmxlZnQgKiAyIC8gZHByfXB4XCJcblxuXHRcdHJldHVybiBAX3BsYWNlaG9sZGVyXG5cblx0Zm9jdXM6IC0+XG5cdFx0QF9pbnB1dEVsZW1lbnQuZm9jdXMoKVxuXG5cdEBkZWZpbmUgXCJ2YWx1ZVwiLFxuXHRcdGdldDogLT4gQF9pbnB1dEVsZW1lbnQudmFsdWVcblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdEBfaW5wdXRFbGVtZW50LnZhbHVlID0gdmFsdWVcblxuXHRAZGVmaW5lIFwiZm9jdXNDb2xvclwiLFxuXHRcdGdldDogLT5cblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmNvbG9yXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5jb2xvciA9IHZhbHVlXG5cblx0QGRlZmluZSBcIm11bHRpTGluZVwiLCBAc2ltcGxlUHJvcGVydHkoXCJtdWx0aUxpbmVcIiwgZmFsc2UpXG5cblx0IyBOZXcgQ29uc3RydWN0b3Jcblx0QHdyYXAgPSAoYmFja2dyb3VuZCwgcGxhY2Vob2xkZXIsIG9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHdyYXBJbnB1dChuZXcgQChvcHRpb25zKSwgYmFja2dyb3VuZCwgcGxhY2Vob2xkZXIsIG9wdGlvbnMpXG5cblx0b25FbnRlcktleTogKGNiKSAtPiBAb24oRXZlbnRzLkVudGVyS2V5LCBjYilcblx0b25TcGFjZUtleTogKGNiKSAtPiBAb24oRXZlbnRzLlNwYWNlS2V5LCBjYilcblx0b25CYWNrc3BhY2VLZXk6IChjYikgLT4gQG9uKEV2ZW50cy5CYWNrc3BhY2VLZXksIGNiKVxuXHRvbkNhcHNMb2NrS2V5OiAoY2IpIC0+IEBvbihFdmVudHMuQ2Fwc0xvY2tLZXksIGNiKVxuXHRvblNoaWZ0S2V5OiAoY2IpIC0+IEBvbihFdmVudHMuU2hpZnRLZXksIGNiKVxuXHRvblZhbHVlQ2hhbmdlOiAoY2IpIC0+IEBvbihFdmVudHMuVmFsdWVDaGFuZ2UsIGNiKVxuXHRvbklucHV0Rm9jdXM6IChjYikgLT4gQG9uKEV2ZW50cy5JbnB1dEZvY3VzLCBjYilcblx0b25JbnB1dEJsdXI6IChjYikgLT4gQG9uKEV2ZW50cy5JbnB1dEJsdXIsIGNiKVxuXG53cmFwSW5wdXQgPSAoaW5zdGFuY2UsIGJhY2tncm91bmQsIHBsYWNlaG9sZGVyKSAtPlxuXHRpZiBub3QgKGJhY2tncm91bmQgaW5zdGFuY2VvZiBMYXllcilcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnB1dExheWVyIGV4cGVjdHMgYSBiYWNrZ3JvdW5kIGxheWVyLlwiKVxuXG5cdGlmIG5vdCAocGxhY2Vob2xkZXIgaW5zdGFuY2VvZiBUZXh0TGF5ZXIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5wdXRMYXllciBleHBlY3RzIGEgdGV4dCBsYXllci5cIilcblxuXHRpbnB1dCA9IGluc3RhbmNlXG5cblx0aW5wdXQuX19mcmFtZXJJbnN0YW5jZUluZm8gPz0ge31cblx0aW5wdXQuX19mcmFtZXJJbnN0YW5jZUluZm8/Lm5hbWUgPSBpbnN0YW5jZS5jb25zdHJ1Y3Rvci5uYW1lXG5cblx0aW5wdXQuZnJhbWUgPSBiYWNrZ3JvdW5kLmZyYW1lXG5cdGlucHV0LnBhcmVudCA9IGJhY2tncm91bmQucGFyZW50XG5cdGlucHV0LmluZGV4ID0gYmFja2dyb3VuZC5pbmRleFxuXG5cdGlucHV0LmFkZEJhY2tncm91bmRMYXllcihiYWNrZ3JvdW5kKVxuXHRpbnB1dC5hZGRQbGFjZUhvbGRlckxheWVyKHBsYWNlaG9sZGVyKVxuXG5cdHJldHVybiBpbnB1dCIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBRUFBO0FEQUEsSUFBQSxTQUFBO0VBQUE7Ozs7QUFBQSxNQUFNLENBQUMsUUFBUCxHQUFrQjs7QUFDbEIsTUFBTSxDQUFDLFFBQVAsR0FBa0I7O0FBQ2xCLE1BQU0sQ0FBQyxZQUFQLEdBQXNCOztBQUN0QixNQUFNLENBQUMsV0FBUCxHQUFxQjs7QUFDckIsTUFBTSxDQUFDLFFBQVAsR0FBa0I7O0FBQ2xCLE1BQU0sQ0FBQyxXQUFQLEdBQXFCOztBQUNyQixN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
