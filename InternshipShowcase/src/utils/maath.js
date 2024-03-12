'use strict';

import { _defineProperty, _objectSpread2 } from './objectSpread2';
import _classCallCheck from './classCallCheck';

function normalizeSeed(seed) {
  if (typeof seed === "number") {
    seed = Math.abs(seed);
  } else if (typeof seed === "string") {
    var string = seed;
    seed = 0;

    for (var i = 0; i < string.length; i++) {
      seed = (seed + (i + 1) * (string.charCodeAt(i) % 96)) % 2147483647;
    }
  }

  if (seed === 0) {
    seed = 311;
  }

  return seed;
}

function lcgRandom(seed) {
  var state = normalizeSeed(seed);
  return function () {
    var result = (state * 48271) % 2147483647;
    state = result;
    return result / 2147483647;
  };
}

var Generator = function Generator(_seed) {
  var _this = this;

  _classCallCheck(this, Generator);
  _defineProperty(this, "seed", 0);
  _defineProperty(this, "init", function (seed) {
    _this.seed = seed;
    _this.value = lcgRandom(seed);
  });

  _defineProperty(this, "value", lcgRandom(this.seed));

  this.init(_seed);
};

var defaultGen = new Generator(Math.random());

var defaultSphere = {
    radius: 1,
    center: [0,0,0],
};  // Random on surface of sphere
// - https://twitter.com/fermatslibrary/status/1430932503578226688
// - https://mathworld.wolfram.com/SpherePointPicking.html

function inSphereCustom(buffer, sphere) {
    var rng = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultGen;
  
    var _defaultSphere$sphere2 = _objectSpread2(_objectSpread2({}, defaultSphere), sphere),
        radius = _defaultSphere$sphere2.radius,
        center = _defaultSphere$sphere2.center;
  
    for (var i = 0; i < buffer.length; i += 3) {
      var u = Math.pow(rng.value(), 1 / 3);
      var x = rng.value() * 2 - 1;
      var y = rng.value() * 2 - 1;
      var z = rng.value() * 2 - 1;
      var mag = Math.sqrt(x * x + y * y + z * z);
      x = u * x / mag;
      y = u * y / mag;
      z = u * z / mag;
      buffer[i] = x * radius + center[0];
      buffer[i + 1] = y * radius + center[1];
      buffer[i + 2] = z * radius + center[2];
    }
  
    return buffer;
};

export {inSphereCustom};