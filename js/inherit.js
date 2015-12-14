/**
 * Created by Julia on 10.12.2015.
 */
'use strict';
(function() {
  /**
   * @function inherit
   * @param child
   * @param parent
   */
  function inherit(child, parent) {
    /**@constructor */
    var EmptyConstructor = function() {};
    EmptyConstructor.prototype = parent.prototype;
    child.prototype = new EmptyConstructor();
  }
})();
