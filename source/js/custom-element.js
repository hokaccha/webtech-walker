(function() {

var CustomElement = {};

CustomElement.register = function register(name, opts) {
  opts = opts || {};

  var proto = Object.create(HTMLElement.prototype);
  var currentScript = document._currentScript || document.currentScript;
  var doc = currentScript.ownerDocument;
  var template = doc.querySelector('#tmpl-' + name);

  proto.createdCallback = function() {
    var shadow = this.createShadowRoot();
    var tmpl = document.importNode(template.content, true);
    shadow.appendChild(tmpl);

    if (opts.onCreate) {
      opts.onCreate.call(this, shadow);
    }
  };

  return document.registerElement(name, { prototype: proto });
};

window.CustomElement = CustomElement;

})();
