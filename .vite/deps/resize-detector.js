import "./chunk-FAW2VN4A.js";

// node_modules/resize-detector/esm/index.js
var raf = null;
function requestAnimationFrame(callback) {
  if (!raf) {
    raf = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback2) {
      return setTimeout(callback2, 16);
    }).bind(window);
  }
  return raf(callback);
}
var caf = null;
function cancelAnimationFrame(id) {
  if (!caf) {
    caf = (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function(id2) {
      clearTimeout(id2);
    }).bind(window);
  }
  caf(id);
}
function createStyles(styleText) {
  var style2 = document.createElement("style");
  if (style2.styleSheet) {
    style2.styleSheet.cssText = styleText;
  } else {
    style2.appendChild(document.createTextNode(styleText));
  }
  (document.querySelector("head") || document.body).appendChild(style2);
  return style2;
}
function createElement(tagName, props) {
  if (props === void 0)
    props = {};
  var elem = document.createElement(tagName);
  Object.keys(props).forEach(function(key) {
    elem[key] = props[key];
  });
  return elem;
}
function getComputedStyle(elem, prop, pseudo) {
  var computedStyle = window.getComputedStyle(elem, pseudo || null) || {
    display: "none"
  };
  return computedStyle[prop];
}
function getRenderInfo(elem) {
  if (!document.documentElement.contains(elem)) {
    return {
      detached: true,
      rendered: false
    };
  }
  var current = elem;
  while (current !== document) {
    if (getComputedStyle(current, "display") === "none") {
      return {
        detached: false,
        rendered: false
      };
    }
    current = current.parentNode;
  }
  return {
    detached: false,
    rendered: true
  };
}
var css_248z = '.resize-triggers{visibility:hidden;opacity:0;pointer-events:none}.resize-contract-trigger,.resize-contract-trigger:before,.resize-expand-trigger,.resize-triggers{content:"";position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden}.resize-contract-trigger,.resize-expand-trigger{background:#eee;overflow:auto}.resize-contract-trigger:before{width:200%;height:200%}';
var total = 0;
var style = null;
function addListener(elem, callback) {
  if (!elem.__resize_mutation_handler__) {
    elem.__resize_mutation_handler__ = handleMutation.bind(elem);
  }
  var listeners = elem.__resize_listeners__;
  if (!listeners) {
    elem.__resize_listeners__ = [];
    if (window.ResizeObserver) {
      var offsetWidth = elem.offsetWidth;
      var offsetHeight = elem.offsetHeight;
      var ro = new ResizeObserver(function() {
        if (!elem.__resize_observer_triggered__) {
          elem.__resize_observer_triggered__ = true;
          if (elem.offsetWidth === offsetWidth && elem.offsetHeight === offsetHeight) {
            return;
          }
        }
        runCallbacks(elem);
      });
      var ref = getRenderInfo(elem);
      var detached = ref.detached;
      var rendered = ref.rendered;
      elem.__resize_observer_triggered__ = detached === false && rendered === false;
      elem.__resize_observer__ = ro;
      ro.observe(elem);
    } else if (elem.attachEvent && elem.addEventListener) {
      elem.__resize_legacy_resize_handler__ = function handleLegacyResize() {
        runCallbacks(elem);
      };
      elem.attachEvent("onresize", elem.__resize_legacy_resize_handler__);
      document.addEventListener("DOMSubtreeModified", elem.__resize_mutation_handler__);
    } else {
      if (!total) {
        style = createStyles(css_248z);
      }
      initTriggers(elem);
      elem.__resize_rendered__ = getRenderInfo(elem).rendered;
      if (window.MutationObserver) {
        var mo = new MutationObserver(elem.__resize_mutation_handler__);
        mo.observe(document, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
        elem.__resize_mutation_observer__ = mo;
      }
    }
  }
  elem.__resize_listeners__.push(callback);
  total++;
}
function removeListener(elem, callback) {
  var listeners = elem.__resize_listeners__;
  if (!listeners) {
    return;
  }
  if (callback) {
    listeners.splice(listeners.indexOf(callback), 1);
  }
  if (!listeners.length || !callback) {
    if (elem.detachEvent && elem.removeEventListener) {
      elem.detachEvent("onresize", elem.__resize_legacy_resize_handler__);
      document.removeEventListener("DOMSubtreeModified", elem.__resize_mutation_handler__);
      return;
    }
    if (elem.__resize_observer__) {
      elem.__resize_observer__.unobserve(elem);
      elem.__resize_observer__.disconnect();
      elem.__resize_observer__ = null;
    } else {
      if (elem.__resize_mutation_observer__) {
        elem.__resize_mutation_observer__.disconnect();
        elem.__resize_mutation_observer__ = null;
      }
      elem.removeEventListener("scroll", handleScroll);
      elem.removeChild(elem.__resize_triggers__.triggers);
      elem.__resize_triggers__ = null;
    }
    elem.__resize_listeners__ = null;
  }
  if (!--total && style) {
    style.parentNode.removeChild(style);
  }
}
function getUpdatedSize(elem) {
  var ref = elem.__resize_last__;
  var width = ref.width;
  var height = ref.height;
  var offsetWidth = elem.offsetWidth;
  var offsetHeight = elem.offsetHeight;
  if (offsetWidth !== width || offsetHeight !== height) {
    return {
      width: offsetWidth,
      height: offsetHeight
    };
  }
  return null;
}
function handleMutation() {
  var ref = getRenderInfo(this);
  var rendered = ref.rendered;
  var detached = ref.detached;
  if (rendered !== this.__resize_rendered__) {
    if (!detached && this.__resize_triggers__) {
      resetTriggers(this);
      this.addEventListener("scroll", handleScroll, true);
    }
    this.__resize_rendered__ = rendered;
    runCallbacks(this);
  }
}
function handleScroll() {
  var this$1 = this;
  resetTriggers(this);
  if (this.__resize_raf__) {
    cancelAnimationFrame(this.__resize_raf__);
  }
  this.__resize_raf__ = requestAnimationFrame(function() {
    var updated = getUpdatedSize(this$1);
    if (updated) {
      this$1.__resize_last__ = updated;
      runCallbacks(this$1);
    }
  });
}
function runCallbacks(elem) {
  if (!elem || !elem.__resize_listeners__) {
    return;
  }
  elem.__resize_listeners__.forEach(function(callback) {
    callback.call(elem, elem);
  });
}
function initTriggers(elem) {
  var position = getComputedStyle(elem, "position");
  if (!position || position === "static") {
    elem.style.position = "relative";
  }
  elem.__resize_old_position__ = position;
  elem.__resize_last__ = {};
  var triggers = createElement("div", {
    className: "resize-triggers"
  });
  var expand = createElement("div", {
    className: "resize-expand-trigger"
  });
  var expandChild = createElement("div");
  var contract = createElement("div", {
    className: "resize-contract-trigger"
  });
  expand.appendChild(expandChild);
  triggers.appendChild(expand);
  triggers.appendChild(contract);
  elem.appendChild(triggers);
  elem.__resize_triggers__ = {
    triggers,
    expand,
    expandChild,
    contract
  };
  resetTriggers(elem);
  elem.addEventListener("scroll", handleScroll, true);
  elem.__resize_last__ = {
    width: elem.offsetWidth,
    height: elem.offsetHeight
  };
}
function resetTriggers(elem) {
  var ref = elem.__resize_triggers__;
  var expand = ref.expand;
  var expandChild = ref.expandChild;
  var contract = ref.contract;
  var csw = contract.scrollWidth;
  var csh = contract.scrollHeight;
  var eow = expand.offsetWidth;
  var eoh = expand.offsetHeight;
  var esw = expand.scrollWidth;
  var esh = expand.scrollHeight;
  contract.scrollLeft = csw;
  contract.scrollTop = csh;
  expandChild.style.width = eow + 1 + "px";
  expandChild.style.height = eoh + 1 + "px";
  expand.scrollLeft = esw;
  expand.scrollTop = esh;
}
export {
  addListener,
  removeListener
};
//# sourceMappingURL=resize-detector.js.map
