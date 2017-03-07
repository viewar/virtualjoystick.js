(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["virtualJoystick"] = factory();
	else
		root["virtualJoystick"] = factory();
})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
		/******/ 	// The module cache
		/******/ 	var installedModules = {};

		/******/ 	// The require function
		/******/ 	function __webpack_require__(moduleId) {

			/******/ 		// Check if module is in cache
			/******/ 		if(installedModules[moduleId])
			/******/ 			return installedModules[moduleId].exports;

			/******/ 		// Create a new module (and put it into the cache)
			/******/ 		var module = installedModules[moduleId] = {
				/******/ 			exports: {},
				/******/ 			id: moduleId,
				/******/ 			loaded: false
				/******/ 		};

			/******/ 		// Execute the module function
			/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

			/******/ 		// Flag the module as loaded
			/******/ 		module.loaded = true;

			/******/ 		// Return the exports of the module
			/******/ 		return module.exports;
			/******/ 	}


		/******/ 	// expose the modules object (__webpack_modules__)
		/******/ 	__webpack_require__.m = modules;

		/******/ 	// expose the module cache
		/******/ 	__webpack_require__.c = installedModules;

		/******/ 	// __webpack_public_path__
		/******/ 	__webpack_require__.p = "";

		/******/ 	// Load entry module and return exports
		/******/ 	return __webpack_require__(0);
		/******/ })
	/************************************************************************/
	/******/ ([
		/* 0 */
		/***/ function(module, exports, __webpack_require__) {

			/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
			"use strict";

			Object.defineProperty(exports, "__esModule", {
				value: true
			});

			var _translateComponent = __webpack_require__(1);

			var _translateComponent2 = _interopRequireDefault(_translateComponent);

			var _componentEvents = __webpack_require__(4);

			var _componentEvents2 = _interopRequireDefault(_componentEvents);

			var _componentEmitter = __webpack_require__(10);

			var _componentEmitter2 = _interopRequireDefault(_componentEmitter);

			var _autoscaleCanvas = __webpack_require__(11);

			var _autoscaleCanvas2 = _interopRequireDefault(_autoscaleCanvas);

			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

			exports.default = VirtualJoystick;


			function VirtualJoystick(options) {
				options = options || {};
				this._checkValid = options.checkValid || function () {
							return true;
						};
				this._container = options.container || document.body;
				this._strokeStyle = options.strokeStyle || 'cyan';
        this._stickBaseHidden  = options.stickBaseHidden !== undefined ? options.stickBaseHidden : false;
        this._stickDisplayRadius = options.stickDisplayRadius !== undefined ? options.stickDisplayRadius : 40;
        this._stickBaseDisplayRadius = options.stickBaseDisplayRadius !== undefined ? options.stickBaseDisplayRadius : 60;
				this._stickEl = options.stickElement || this._buildJoystickStick();
				this._baseEl = options.baseElement || this._buildJoystickBase();
				this._stationaryBase = options.stationaryBase || false;
				this._baseX = this._stickX = options.baseX || 0;
				this._baseY = this._stickY = options.baseY || 0;
				this._limitStickTravel = options.limitStickTravel || false;
				this._stickRadius = options.stickRadius !== undefined ? options.stickRadius : 100;

				this._container.appendChild(this._baseEl);
				this._baseEl.style.position = "absolute";
				this._baseEl.style.display = "none";
				this._container.appendChild(this._stickEl);
				this._stickEl.style.position = "absolute";
				this._stickEl.style.display = "none";

				this._pressed = false;
				this._touchIdx = null;

				if (this._stationaryBase) {
					this._baseEl.style.display = "block";
					this._baseEl.style.left = this._baseX - this._baseEl.width / 2 + "px";
					this._baseEl.style.top = this._baseY - this._baseEl.height / 2 + "px";
				}

				this._containerevents = (0, _componentEvents2.default)(this._container, this);
				this._containerevents.bind('mousedown', '_onMouseDown');
				this._containerevents.bind('touchstart', '_onTouchStart');
				this._docevents = (0, _componentEvents2.default)(document.body, this);
				this._docevents.bind('mousemove', '_onMouseMove');
				this._docevents.bind('mouseup', '_onMouseUp');
				this._docevents.bind('touchend', '_onTouchEnd');
				this._docevents.bind('touchmove', '_onTouchMove');
				this._docevents.bind('touchcancel', '_onTouchCancel');
			}

			(0, _componentEmitter2.default)(VirtualJoystick.prototype);

			VirtualJoystick.prototype.destroy = function () {
				this._container.removeChild(this._baseEl);
				this._container.removeChild(this._stickEl);
				this._containerevents.unbind();
				this._docevents.unbind();
			};

			VirtualJoystick.prototype.deltaX = function () {
				return this._stickX - this._baseX;
			};
			VirtualJoystick.prototype.deltaY = function () {
				return this._stickY - this._baseY;
			};

			VirtualJoystick.prototype._onUp = function () {
				this.emit('end');
				this._pressed = false;
				this._stickEl.style.display = "none";

				if (!this._stationaryBase) {
					this._baseEl.style.display = "none";
				}

				this._baseX = this._baseY = 0;
				this._stickX = this._stickY = 0;
			};

			VirtualJoystick.prototype._onDown = function (coords) {
				var x = coords[0],
						y = coords[1];
				if (!this._checkValid(x, y)) return;

				this.emit('start', x, y);
				this._pressed = true;
				if (!this._stationaryBase) {
					this._baseX = x;
					this._baseY = y;
					this._baseEl.style.display = "block";
					(0, _translateComponent2.default)(this._baseEl, this._baseX - this._baseEl.width / 2, this._baseY - this._baseEl.height / 2);
				}

				this._stickX = x;
				this._stickY = y;

				if (this._limitStickTravel) {
					var deltaX = this.deltaX();
					var deltaY = this.deltaY();
					var stickDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
					if (stickDistance > this._stickRadius) {
						var stickNormalizedX = deltaX / stickDistance;
						var stickNormalizedY = deltaY / stickDistance;

						this._stickX = stickNormalizedX * this._stickRadius + this._baseX;
						this._stickY = stickNormalizedY * this._stickRadius + this._baseY;
					}
				}

				this._stickEl.style.display = "block";
				(0, _translateComponent2.default)(this._stickEl, this._stickX - this._stickEl.width / 2, this._stickY - this._stickEl.height / 2);
			};

			VirtualJoystick.prototype._onMove = function (coords) {
				if (!this._pressed) return;

				var x = coords[0],
						y = coords[1];
				this.emit('move', x, y);
				this._stickX = x;
				this._stickY = y;

				if (this._limitStickTravel) {
					var deltaX = this.deltaX();
					var deltaY = this.deltaY();
					var stickDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
					if (stickDistance > this._stickRadius) {
						var stickNormalizedX = deltaX / stickDistance;
						var stickNormalizedY = deltaY / stickDistance;

						this._stickX = stickNormalizedX * this._stickRadius + this._baseX;
						this._stickY = stickNormalizedY * this._stickRadius + this._baseY;
					}
				}
				(0, _translateComponent2.default)(this._stickEl, this._stickX - this._stickEl.width / 2, this._stickY - this._stickEl.height / 2);
			};

			VirtualJoystick.prototype._onMouseUp = function (event) {
				return this._onUp();
			};

			VirtualJoystick.prototype._offset = function (ev) {
				var coords = [ev.clientX, ev.clientY];
				var offset = this._container;
				do {
					coords[0] -= offset.offsetLeft;
					coords[1] -= offset.offsetTop;
				} while (offset = offset.offsetParent);
				return coords;
			};

			VirtualJoystick.prototype._onMouseDown = function (event) {
				event.preventDefault();
				return this._onDown(this._offset(event));
			};

			VirtualJoystick.prototype._onMouseMove = function (event) {
				return this._onMove(this._offset(event));
			};

			VirtualJoystick.prototype._onTouchStart = function (event) {
				// if there is already a touch inprogress do nothing
				if (this._touchIdx !== null) return;

				event.preventDefault();
				// get the first who changed
				var touch = event.changedTouches[0];
				// set the touchIdx of this joystick
				this._touchIdx = touch.identifier;

				// forward the action
				return this._onDown(this._offset(touch));
			};

			VirtualJoystick.prototype._onTouchEnd = function (event) {
				// if there is no touch in progress, do nothing
				if (this._touchIdx === null) return;

				// try to find our touch event
				var touchList = event.changedTouches;
				for (var i = 0; i < touchList.length && touchList[i].identifier !== this._touchIdx; i++) {}
				// if touch event isnt found,
				if (i === touchList.length) return;

				// reset touchIdx - mark it as no-touch-in-progress
				this._touchIdx = null;

				//??????
				// no preventDefault to get click event on ios
				event.preventDefault();

				return this._onUp();
			};

			VirtualJoystick.prototype._onTouchMove = function (event) {
				// if there is no touch in progress, do nothing
				if (this._touchIdx === null) return;

				// try to find our touch event
				var touchList = event.changedTouches;
				for (var i = 0; i < touchList.length && touchList[i].identifier !== this._touchIdx; i++) {}
				// if touch event with the proper identifier isnt found, do nothing
				if (i === touchList.length) return;
				var touch = touchList[i];

				event.preventDefault();

				return this._onMove(this._offset(touch));
			};

			VirtualJoystick.prototype._onTouchCancel = function (event) {
				this._touchIdx = null;
			};

			function circle(ctx, style, width, x, y, r) {
				ctx.beginPath();
				ctx.strokeStyle = style;
				ctx.lineWidth = width;
				ctx.arc(x, y, r, 0, Math.PI * 2, true);
				ctx.stroke();
			}

			VirtualJoystick.prototype._buildJoystickBase = function () {
				var canvas = document.createElement('canvas');
				canvas.width = canvas.height = 126;
				//autoscale(canvas);

        if (!this._stickBaseHidden) {
          var ctx = canvas.getContext('2d');

          circle(ctx, this._strokeStyle, 6, 63, 63, this._stickDisplayRadius);
          circle(ctx, this._strokeStyle, 2, 63, 63, this._stickBaseDisplayRadius);
        }

				return canvas;
			};

			VirtualJoystick.prototype._buildJoystickStick = function () {
				var canvas = document.createElement('canvas');
				canvas.width = canvas.height = 86;
				//autoscale(canvas);
				var ctx = canvas.getContext('2d');

				circle(ctx, this._strokeStyle, 6, 43, 43, this._stickDisplayRadius);

				return canvas;
			};

			/***/ },
		/* 1 */
		/***/ function(module, exports, __webpack_require__) {


			/**
			 * Module dependencies.
			 */

			var transform = __webpack_require__(2);
			var has3d = __webpack_require__(3);


			/**
			 * Regexp to check "End with %"
			 */

			var percentRegexp = /%$/;


			/**
			 * Expose `translate`.
			 */

			module.exports = translate;


			/**
			 * Translate `el` by `(x, y)`.
			 *
			 * @param {Element} el
			 * @param {Number|String} x
			 * @param {Number|String} y
			 * @api public
			 */


			function translate(el, x, y){

				if (!percentRegexp.test(x)) x += 'px';
				if (!percentRegexp.test(y)) y += 'px';

				if (transform) {
					if (has3d) {
						el.style[transform] = 'translate3d(' + x + ', ' + y + ', 0)';
					} else {
						el.style[transform] = 'translate(' + x + ',' + y + ')';
					}
				} else {
					el.style.left = x;
					el.style.top = y;
				}
			};


			/***/ },
		/* 2 */
		/***/ function(module, exports) {


			var styles = [
				'webkitTransform',
				'MozTransform',
				'msTransform',
				'OTransform',
				'transform'
			];

			var el = document.createElement('p');
			var style;

			for (var i = 0; i < styles.length; i++) {
				style = styles[i];
				if (null != el.style[style]) {
					module.exports = style;
					break;
				}
			}


			/***/ },
		/* 3 */
		/***/ function(module, exports, __webpack_require__) {


			var prop = __webpack_require__(2);

			// IE <=8 doesn't have `getComputedStyle`
			if (!prop || !window.getComputedStyle) {
				module.exports = false;

			} else {
				var map = {
					webkitTransform: '-webkit-transform',
					OTransform: '-o-transform',
					msTransform: '-ms-transform',
					MozTransform: '-moz-transform',
					transform: 'transform'
				};

				// from: https://gist.github.com/lorenzopolidori/3794226
				var el = document.createElement('div');
				el.style[prop] = 'translate3d(1px,1px,1px)';
				document.body.insertBefore(el, null);
				var val = getComputedStyle(el).getPropertyValue(map[prop]);
				document.body.removeChild(el);
				module.exports = null != val && val.length && 'none' != val;
			}


			/***/ },
		/* 4 */
		/***/ function(module, exports, __webpack_require__) {


			/**
			 * Module dependencies.
			 */

			try {
				var events = __webpack_require__(5);
			} catch(err) {
				var events = __webpack_require__(5);
			}

			try {
				var delegate = __webpack_require__(6);
			} catch(err) {
				var delegate = __webpack_require__(6);
			}

			/**
			 * Expose `Events`.
			 */

			module.exports = Events;

			/**
			 * Initialize an `Events` with the given
			 * `el` object which events will be bound to,
			 * and the `obj` which will receive method calls.
			 *
			 * @param {Object} el
			 * @param {Object} obj
			 * @api public
			 */

			function Events(el, obj) {
				if (!(this instanceof Events)) return new Events(el, obj);
				if (!el) throw new Error('element required');
				if (!obj) throw new Error('object required');
				this.el = el;
				this.obj = obj;
				this._events = {};
			}

			/**
			 * Subscription helper.
			 */

			Events.prototype.sub = function(event, method, cb){
				this._events[event] = this._events[event] || {};
				this._events[event][method] = cb;
			};

			/**
			 * Bind to `event` with optional `method` name.
			 * When `method` is undefined it becomes `event`
			 * with the "on" prefix.
			 *
			 * Examples:
			 *
			 *  Direct event handling:
			 *
			 *    events.bind('click') // implies "onclick"
			 *    events.bind('click', 'remove')
			 *    events.bind('click', 'sort', 'asc')
			 *
			 *  Delegated event handling:
			 *
			 *    events.bind('click li > a')
			 *    events.bind('click li > a', 'remove')
			 *    events.bind('click a.sort-ascending', 'sort', 'asc')
			 *    events.bind('click a.sort-descending', 'sort', 'desc')
			 *
			 * @param {String} event
			 * @param {String|function} [method]
			 * @return {Function} callback
			 * @api public
			 */

			Events.prototype.bind = function(event, method){
				var e = parse(event);
				var el = this.el;
				var obj = this.obj;
				var name = e.name;
				var method = method || 'on' + name;
				var args = [].slice.call(arguments, 2);

				// callback
				function cb(){
					var a = [].slice.call(arguments).concat(args);
					obj[method].apply(obj, a);
				}

				// bind
				if (e.selector) {
					cb = delegate.bind(el, e.selector, name, cb);
				} else {
					events.bind(el, name, cb);
				}

				// subscription for unbinding
				this.sub(name, method, cb);

				return cb;
			};

			/**
			 * Unbind a single binding, all bindings for `event`,
			 * or all bindings within the manager.
			 *
			 * Examples:
			 *
			 *  Unbind direct handlers:
			 *
			 *     events.unbind('click', 'remove')
			 *     events.unbind('click')
			 *     events.unbind()
			 *
			 * Unbind delegate handlers:
			 *
			 *     events.unbind('click', 'remove')
			 *     events.unbind('click')
			 *     events.unbind()
			 *
			 * @param {String|Function} [event]
			 * @param {String|Function} [method]
			 * @api public
			 */

			Events.prototype.unbind = function(event, method){
				if (0 == arguments.length) return this.unbindAll();
				if (1 == arguments.length) return this.unbindAllOf(event);

				// no bindings for this event
				var bindings = this._events[event];
				if (!bindings) return;

				// no bindings for this method
				var cb = bindings[method];
				if (!cb) return;

				events.unbind(this.el, event, cb);
			};

			/**
			 * Unbind all events.
			 *
			 * @api private
			 */

			Events.prototype.unbindAll = function(){
				for (var event in this._events) {
					this.unbindAllOf(event);
				}
			};

			/**
			 * Unbind all events for `event`.
			 *
			 * @param {String} event
			 * @api private
			 */

			Events.prototype.unbindAllOf = function(event){
				var bindings = this._events[event];
				if (!bindings) return;

				for (var method in bindings) {
					this.unbind(event, method);
				}
			};

			/**
			 * Parse `event`.
			 *
			 * @param {String} event
			 * @return {Object}
			 * @api private
			 */

			function parse(event) {
				var parts = event.split(/ +/);
				return {
					name: parts.shift(),
					selector: parts.join(' ')
				}
			}


			/***/ },
		/* 5 */
		/***/ function(module, exports) {

			var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
					unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
					prefix = bind !== 'addEventListener' ? 'on' : '';

			/**
			 * Bind `el` event `type` to `fn`.
			 *
			 * @param {Element} el
			 * @param {String} type
			 * @param {Function} fn
			 * @param {Boolean} capture
			 * @return {Function}
			 * @api public
			 */

			exports.bind = function(el, type, fn, capture){
				el[bind](prefix + type, fn, capture || false);
				return fn;
			};

			/**
			 * Unbind `el` event `type`'s callback `fn`.
			 *
			 * @param {Element} el
			 * @param {String} type
			 * @param {Function} fn
			 * @param {Boolean} capture
			 * @return {Function}
			 * @api public
			 */

			exports.unbind = function(el, type, fn, capture){
				el[unbind](prefix + type, fn, capture || false);
				return fn;
			};

			/***/ },
		/* 6 */
		/***/ function(module, exports, __webpack_require__) {

			/**
			 * Module dependencies.
			 */

			try {
				var closest = __webpack_require__(7);
			} catch(err) {
				var closest = __webpack_require__(7);
			}

			try {
				var event = __webpack_require__(5);
			} catch(err) {
				var event = __webpack_require__(5);
			}

			/**
			 * Delegate event `type` to `selector`
			 * and invoke `fn(e)`. A callback function
			 * is returned which may be passed to `.unbind()`.
			 *
			 * @param {Element} el
			 * @param {String} selector
			 * @param {String} type
			 * @param {Function} fn
			 * @param {Boolean} capture
			 * @return {Function}
			 * @api public
			 */

			exports.bind = function(el, selector, type, fn, capture){
				return event.bind(el, type, function(e){
					var target = e.target || e.srcElement;
					e.delegateTarget = closest(target, selector, true, el);
					if (e.delegateTarget) fn.call(el, e);
				}, capture);
			};

			/**
			 * Unbind event `type`'s callback `fn`.
			 *
			 * @param {Element} el
			 * @param {String} type
			 * @param {Function} fn
			 * @param {Boolean} capture
			 * @api public
			 */

			exports.unbind = function(el, type, fn, capture){
				event.unbind(el, type, fn, capture);
			};


			/***/ },
		/* 7 */
		/***/ function(module, exports, __webpack_require__) {

			/**
			 * Module Dependencies
			 */

			try {
				var matches = __webpack_require__(8)
			} catch (err) {
				var matches = __webpack_require__(8)
			}

			/**
			 * Export `closest`
			 */

			module.exports = closest

			/**
			 * Closest
			 *
			 * @param {Element} el
			 * @param {String} selector
			 * @param {Element} scope (optional)
			 */

			function closest (el, selector, scope) {
				scope = scope || document.documentElement;

				// walk up the dom
				while (el && el !== scope) {
					if (matches(el, selector)) return el;
					el = el.parentNode;
				}

				// check scope for match
				return matches(el, selector) ? el : null;
			}


			/***/ },
		/* 8 */
		/***/ function(module, exports, __webpack_require__) {

			/**
			 * Module dependencies.
			 */

			try {
				var query = __webpack_require__(9);
			} catch (err) {
				var query = __webpack_require__(9);
			}

			/**
			 * Element prototype.
			 */

			var proto = Element.prototype;

			/**
			 * Vendor function.
			 */

			var vendor = proto.matches
					|| proto.webkitMatchesSelector
					|| proto.mozMatchesSelector
					|| proto.msMatchesSelector
					|| proto.oMatchesSelector;

			/**
			 * Expose `match()`.
			 */

			module.exports = match;

			/**
			 * Match `el` to `selector`.
			 *
			 * @param {Element} el
			 * @param {String} selector
			 * @return {Boolean}
			 * @api public
			 */

			function match(el, selector) {
				if (!el || el.nodeType !== 1) return false;
				if (vendor) return vendor.call(el, selector);
				var nodes = query.all(selector, el.parentNode);
				for (var i = 0; i < nodes.length; ++i) {
					if (nodes[i] == el) return true;
				}
				return false;
			}


			/***/ },
		/* 9 */
		/***/ function(module, exports) {

			function one(selector, el) {
				return el.querySelector(selector);
			}

			exports = module.exports = function(selector, el){
				el = el || document;
				return one(selector, el);
			};

			exports.all = function(selector, el){
				el = el || document;
				return el.querySelectorAll(selector);
			};

			exports.engine = function(obj){
				if (!obj.one) throw new Error('.one callback required');
				if (!obj.all) throw new Error('.all callback required');
				one = obj.one;
				exports.all = obj.all;
				return exports;
			};


			/***/ },
		/* 10 */
		/***/ function(module, exports, __webpack_require__) {


			/**
			 * Expose `Emitter`.
			 */

			if (true) {
				module.exports = Emitter;
			}

			/**
			 * Initialize a new `Emitter`.
			 *
			 * @api public
			 */

			function Emitter(obj) {
				if (obj) return mixin(obj);
			};

			/**
			 * Mixin the emitter properties.
			 *
			 * @param {Object} obj
			 * @return {Object}
			 * @api private
			 */

			function mixin(obj) {
				for (var key in Emitter.prototype) {
					obj[key] = Emitter.prototype[key];
				}
				return obj;
			}

			/**
			 * Listen on the given `event` with `fn`.
			 *
			 * @param {String} event
			 * @param {Function} fn
			 * @return {Emitter}
			 * @api public
			 */

			Emitter.prototype.on =
					Emitter.prototype.addEventListener = function(event, fn){
						this._callbacks = this._callbacks || {};
						(this._callbacks['$' + event] = this._callbacks['$' + event] || [])
								.push(fn);
						return this;
					};

			/**
			 * Adds an `event` listener that will be invoked a single
			 * time then automatically removed.
			 *
			 * @param {String} event
			 * @param {Function} fn
			 * @return {Emitter}
			 * @api public
			 */

			Emitter.prototype.once = function(event, fn){
				function on() {
					this.off(event, on);
					fn.apply(this, arguments);
				}

				on.fn = fn;
				this.on(event, on);
				return this;
			};

			/**
			 * Remove the given callback for `event` or all
			 * registered callbacks.
			 *
			 * @param {String} event
			 * @param {Function} fn
			 * @return {Emitter}
			 * @api public
			 */

			Emitter.prototype.off =
					Emitter.prototype.removeListener =
							Emitter.prototype.removeAllListeners =
									Emitter.prototype.removeEventListener = function(event, fn){
										this._callbacks = this._callbacks || {};

										// all
										if (0 == arguments.length) {
											this._callbacks = {};
											return this;
										}

										// specific event
										var callbacks = this._callbacks['$' + event];
										if (!callbacks) return this;

										// remove all handlers
										if (1 == arguments.length) {
											delete this._callbacks['$' + event];
											return this;
										}

										// remove specific handler
										var cb;
										for (var i = 0; i < callbacks.length; i++) {
											cb = callbacks[i];
											if (cb === fn || cb.fn === fn) {
												callbacks.splice(i, 1);
												break;
											}
										}
										return this;
									};

			/**
			 * Emit `event` with the given args.
			 *
			 * @param {String} event
			 * @param {Mixed} ...
			 * @return {Emitter}
			 */

			Emitter.prototype.emit = function(event){
				this._callbacks = this._callbacks || {};
				var args = [].slice.call(arguments, 1)
						, callbacks = this._callbacks['$' + event];

				if (callbacks) {
					callbacks = callbacks.slice(0);
					for (var i = 0, len = callbacks.length; i < len; ++i) {
						callbacks[i].apply(this, args);
					}
				}

				return this;
			};

			/**
			 * Return array of callbacks for `event`.
			 *
			 * @param {String} event
			 * @return {Array}
			 * @api public
			 */

			Emitter.prototype.listeners = function(event){
				this._callbacks = this._callbacks || {};
				return this._callbacks['$' + event] || [];
			};

			/**
			 * Check if this emitter has `event` handlers.
			 *
			 * @param {String} event
			 * @return {Boolean}
			 * @api public
			 */

			Emitter.prototype.hasListeners = function(event){
				return !! this.listeners(event).length;
			};


			/***/ },
		/* 11 */
		/***/ function(module, exports) {


			/**
			 * Retina-enable the given `canvas`.
			 *
			 * @param {Canvas} canvas
			 * @return {Canvas}
			 * @api public
			 */

			module.exports = function(canvas){
				var ctx = canvas.getContext('2d');
				var ratio = window.devicePixelRatio || 1;
				if (1 != ratio) {
					canvas.style.width = canvas.width + 'px';
					canvas.style.height = canvas.height + 'px';
					canvas.width *= ratio;
					canvas.height *= ratio;
					ctx.scale(ratio, ratio);
				}
				return canvas;
			};

			/***/ }
		/******/ ])
});
;
