if (window.at === undefined) {
  var at = (function() {
    "use strict";

    var regPropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        regEscape = /\\(\\)?/g;

    var DEFAULT_MAX_SIZE = 2;
    
    var REST_FROM_INDEX = 1;    

    var isArray = Array.isArray,
        toArray = Array.from; 

    var stringToPath = function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46) {
        result.push('');
      }
      string.replace(regPropName, function(match, number, quote, name) {
        result.push(quote ? name.replace(regEscape, '$1') : (number || match));
      });
      return result;
    };    

    var basePlainProp = function(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    };

    var baseGet = function(keys, length) {
      var get;
      return get = function(object, index) {
        var getValue = basePlainProp('' + keys[index]);
        return index < length - 1 
          ? get(getValue(object), index + 1) 
          : getValue(object);
      };
    };

    var baseAt = function(object, paths) {
      var result = [],
          index = -1,
          length = paths.length;

      while (++index < length) {
        var path = paths[index],
            keys = isArray(path) ? path : stringToPath('' + path),
            get = baseGet(keys, keys.length);

        result.push(get(object, 0));    
      }    
      return result;
    };

    return function(object, paths) {
      var length = arguments.length;
      if (!isArray(paths) || length > DEFAULT_MAX_SIZE) {
        paths = toArray(arguments).slice(REST_FROM_INDEX);
      }
      return baseAt(object, paths);
    };    
  })();
}  
