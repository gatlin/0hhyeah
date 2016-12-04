/******/ (function(modules) { // webpackBootstrap
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

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, alm_1, grid_1) {
	    "use strict";
	    var app = new alm_1.App({
	        state: new grid_1.Grid(8).initialize(),
	        update: function (action, grid) {
	            if (action['type'] === 'click') {
	                var coords = action.data;
	                console.log('touched grid cell x = ' +
	                    coords[0] + ', y = ' + coords[1]);
	                grid = grid.toggle(coords[0], coords[1]);
	            }
	            if (action['type'] === 'solve') {
	                grid.solve();
	            }
	            if (action['type'] === 'generate') {
	                grid.initialize().generate();
	            }
	            return grid;
	        },
	        main: function (scope) {
	            scope.events.click
	                .filter(function (evt) { return evt.hasClass('grid-cell'); })
	                .recv(function (evt) {
	                var coordStr = evt.getId().split('-')[2];
	                var coords = coordStr.split(':').map(function (x) { return parseInt(x); });
	                scope.actions.send({
	                    'type': 'click',
	                    'data': coords
	                });
	            });
	            scope.events.click
	                .filter(function (evt) { return evt.getId() === 'solve-btn'; })
	                .recv(function (evt) {
	                scope.actions.send({
	                    'type': 'solve'
	                });
	            });
	            scope.events.click
	                .filter(function (evt) { return evt.getId() === 'generate-btn'; })
	                .recv(function (evt) {
	                scope.actions.send({
	                    'type': 'generate'
	                });
	            });
	        },
	        render: function (grid) { return grid.render(); },
	        eventRoot: 'app',
	        domRoot: 'app'
	    }).start();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, base_1, vdom_1, base_2, vdom_2) {
	    "use strict";
	    function __export(m) {
	        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	    }
	    __export(base_1);
	    exports.el = vdom_1.el;
	    /**
	     * Wraps system events and provides some convenience methods.
	     * @constructor
	     * @param evt - The raw browser event value.
	     */
	    var AlmEvent = (function () {
	        function AlmEvent(evt) {
	            this.raw = evt;
	            this.classes = evt.target.className.trim().split(/\s+/g) || [];
	            this.id = evt.target.id;
	        }
	        AlmEvent.prototype.hasClass = function (klass) {
	            return (this.classes.indexOf(klass) !== -1);
	        };
	        AlmEvent.prototype.getClasses = function () {
	            return this.classes;
	        };
	        AlmEvent.prototype.getId = function () {
	            return this.id;
	        };
	        AlmEvent.prototype.getValue = function () {
	            return this.raw.target.value;
	        };
	        AlmEvent.prototype.getRaw = function () {
	            return this.raw;
	        };
	        return AlmEvent;
	    }());
	    exports.AlmEvent = AlmEvent;
	    /**
	     * Constructs signals emitting whichever browser event names you pass in.
	     * @param {Array<string>} evts - The event names you want signals for.
	     * @return {Array<Signal>} The event signals.
	     */
	    function makeEvents(evts) {
	        var events = {};
	        for (var i = 0; i < evts.length; i++) {
	            var evtName = evts[i];
	            events[evtName] = new base_2.Signal(function (evt) { return new AlmEvent(evt); });
	        }
	        return events;
	    }
	    /**
	     * Builds the port signals for an App.
	     * @param {Object} portCfg - An object whose keys name arrays of desired port
	     *                           names.
	     *                           Eg, { outbound: ['port1','port2' ],
	     *                                 inbound: ['port3'] }.
	     *
	     * @return {Object} ports - An object with the same keys but this time they
	     *                          point to objects whose keys were in the original
	     *                          arrays and whose values are signals.
	     */
	    function makePorts(portCfg) {
	        // If it is simply an array then make ports for each string
	        if (Array.isArray(portCfg)) {
	            var _ports = {};
	            for (var i = 0; i < portCfg.length; i++) {
	                var portName = portCfg[i];
	                _ports[portName] = base_2.Signal.make();
	            }
	            return _ports;
	        }
	        var ports = (typeof portCfg === 'undefined' || portCfg === null)
	            ? { outbound: [], inbound: [] }
	            : portCfg;
	        for (var key in ports) {
	            var portNames = ports[key];
	            var portSpace = {};
	            for (var i = 0; i < portNames.length; i++) {
	                var portName = portNames[i];
	                portSpace[portName] = base_2.Signal.make();
	            }
	            ports[key] = portSpace;
	        }
	        return ports;
	    }
	    var standardEvents = [
	        'click',
	        'dblclick',
	        'keyup',
	        'keydown',
	        'keypress',
	        'blur',
	        'focusout',
	        'input',
	        'change',
	        'load'
	    ];
	    /**
	     * A self-contained application.
	     * @constructor
	     * @param {AppConfig} cfg - the configuration object.
	     */
	    var App = (function () {
	        function App(cfg) {
	            this.gui = typeof cfg.gui === 'undefined'
	                ? true
	                : cfg.gui;
	            this.eventRoot = typeof cfg.eventRoot === 'string'
	                ? document.getElementById(cfg.eventRoot)
	                : typeof cfg.eventRoot === 'undefined'
	                    ? document
	                    : cfg.eventRoot;
	            this.domRoot = typeof cfg.domRoot === 'string'
	                ? document.getElementById(cfg.domRoot)
	                : typeof cfg.domRoot === 'undefined'
	                    ? document.body
	                    : cfg.domRoot;
	            var events = standardEvents.concat(typeof cfg.extraEvents !== 'undefined'
	                ? cfg.extraEvents
	                : []);
	            this.events = makeEvents(events);
	            this.ports = makePorts(cfg.ports);
	            // create the signal graph
	            var actions = new base_2.Mailbox(null);
	            var state = actions.reduce(cfg.state, function (action, model) {
	                if (action === null) {
	                    return model;
	                }
	                return cfg.update(action, model);
	            });
	            this.scope = Object.seal({
	                events: this.events,
	                ports: this.ports,
	                actions: actions,
	                state: state
	            });
	            cfg.main(this.scope);
	            this.render = this.gui ? cfg.render : null;
	        }
	        /**
	         * Internal method which registers a given signal to emit upstream browser
	         * events.
	         */
	        App.prototype.registerEvent = function (evtName, sig) {
	            var fn = function (evt) { return sig.send(evt); };
	            this.eventRoot.addEventListener(evtName, fn, true);
	        };
	        /**
	         * Provides access to the application scope for any other configuration.
	         *
	         * @param f - A function which accepts a scope and returns nothing.
	         * @return @this
	         */
	        App.prototype.editScope = function (cb) {
	            cb(this.scope);
	            return this;
	        };
	        /**
	         * Set the root element in the page to which we will attach listeners.
	         * @param er - Either an HTML element, the whole document, or an element ID
	         *             as a string.
	         * @return @this
	         */
	        App.prototype.setEventRoot = function (er) {
	            this.eventRoot = typeof er === 'string'
	                ? document.getElementById(er)
	                : er;
	            return this;
	        };
	        /**
	         * Set the root element in the page in which we will render.
	         * @param er - Either an HTML element, the whole document, or an element ID
	         *             as a string.
	         * @return @this
	         */
	        App.prototype.setDomRoot = function (dr) {
	            this.domRoot = typeof dr === 'string'
	                ? document.getElementById(dr)
	                : dr;
	            return this;
	        };
	        /**
	         * This method actually registers the desired events and creates the ports.
	         * @return An object containing the App's port signals and a state update
	         * signal.
	         */
	        App.prototype.start = function () {
	            /* Find all the event listeners the user cared about and bind those */
	            for (var evtName in this.events) {
	                var sig = this.events[evtName];
	                if (sig.numListeners() > 0) {
	                    this.registerEvent(evtName, sig);
	                }
	            }
	            if (this.gui) {
	                var view = this.scope.state.map(this.render);
	                vdom_2.render(view, this.domRoot);
	            }
	            return {
	                ports: this.scope.ports,
	                state: this.scope.state
	            };
	        };
	        return App;
	    }());
	    exports.App = App;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	/*
	[1]: The proper thing for it to wrap would be the type `Event`. However I also
	want to be able to make assumptions about the target because I'll be getting
	them exclusively from the browser. I do not know the proper TypeScript-fu yet
	for expressing this properly.

	[2]: I don't know the typescript way of saying "an object of string literal keys
	which point to arrays of names. any number of such keys, or none at all."
	*/


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    /**
	     * Permits something akin to traits and automatically derived functions. The
	     * type receiving the traits must implement stub properties with the correct
	     * names.
	     *
	     * @param derivedCtor - the constructor you want to add traits to.
	     * @param baseCtors - the parent constructors you wish to inherit traits from.
	     */
	    function derive(derivedCtor, baseCtors) {
	        baseCtors.forEach(function (baseCtor) {
	            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
	                derivedCtor.prototype[name] = baseCtor.prototype[name];
	            });
	        });
	    }
	    exports.derive = derive;
	    /**
	     * Using `derive` you can get an implementation of flatMap for free by
	     * implementing this class as an interface with a null return value for flatMap.
	     */
	    var FlatMap = (function () {
	        function FlatMap() {
	        }
	        FlatMap.pipe = function (ms) {
	            var v = ms[0];
	            for (var i = 1; i < ms.length; i++) {
	                v = v.flatMap(ms[i]);
	            }
	            return v;
	        };
	        FlatMap.prototype.flatMap = function (f) {
	            return this.map(f).flatten();
	        };
	        FlatMap.prototype.pipe = function (ms) {
	            var me = this;
	            for (var i = 0; i < ms.length; i++) {
	                me = me.flatMap(ms[i]);
	            }
	            return me;
	        };
	        return FlatMap;
	    }());
	    exports.FlatMap = FlatMap;
	    /** Utility function to perform some function asynchronously. */
	    function async(f) {
	        setTimeout(f, 0);
	    }
	    exports.async = async;
	    /**
	     * Signals route data through an application.
	    
	     * A signal is a unary function paired with an array of listeners. When a signal
	     * receives a value it computes a result using its function and then sends that
	     * to each of its listeners.
	     *
	     * @constructor
	     * @param fn - A unary function.
	     */
	    var Signal = (function () {
	        function Signal(fn) {
	            this.fn = fn;
	            this.listeners = [];
	        }
	        /** Attaches the argument as a listener and then returns the argument. */
	        Signal.prototype.connect = function (sig) {
	            this.listeners.push(sig);
	            return sig;
	        };
	        /** Convenience constructor. */
	        Signal.make = function () {
	            return new Signal(function (x) { return x; });
	        };
	        /**
	         * Gives the argument to the signal's internal function and then sends the
	         * result to all its listeners.
	         *
	         * @param x - The value to send.
	         * @return Nothing
	         */
	        Signal.prototype.send = function (x) {
	            var v = this.fn(x);
	            if (typeof v !== 'undefined') {
	                for (var i = 0; i < this.listeners.length; i++) {
	                    var r = this.listeners[i];
	                    r.send(v);
	                }
	            }
	        };
	        Signal.prototype.recv = function (f) {
	            this.connect(new Signal(function (v) { return f(v); }));
	        };
	        /**
	         * Creates a new signal with the specified function, attaches it to this
	         * signal, and returns the newly created signal.
	         *
	         * @param f - A unary function with which to create a new signal.
	         * @return a new signal attached to this one.
	         */
	        Signal.prototype.map = function (f) {
	            var sig = new Signal(f);
	            return this.connect(sig);
	        };
	        /**
	         * Creates a new signal which will only propagate a value if a condition
	         * is met. The new signal will be attached as a listener to this one.
	         *
	         * @param cond - A unary function returning a boolean.
	         * @return a new Signal attached as a listener to this Signal.
	         */
	        Signal.prototype.filter = function (cond) {
	            var r = new Signal(function (v) {
	                if (cond(v)) {
	                    return v;
	                }
	            });
	            return this.connect(r);
	        };
	        /**
	         * Creates a new signal which reduces incoming values using a supplied
	         * function and an initial value. The new signal will be attached as a
	         * listener to this one.
	         *
	         * @param initial - An initial value for the reduction.
	         * @param reducer - A function accepting new signal values and the old
	         *                  reduced value.
	         * @return a new Signal attached as a listener to this Signal.
	         */
	        Signal.prototype.reduce = function (initial, reducer) {
	            var state = initial;
	            var r = new Signal(function (v) {
	                state = reducer(v, state);
	                return state;
	            });
	            return this.connect(r);
	        };
	        Signal.prototype.numListeners = function () {
	            return this.listeners.length;
	        };
	        return Signal;
	    }());
	    exports.Signal = Signal;
	    /**
	     * A signal to which you may send and receive values. Messages are sent
	     * asynchronously. You must supply an initial value to send.
	     *
	     * This makes Mailboxes useful for kicking off any initial actions that must
	     * be taken. Internally a Mailbox is used for initial state reduction by App.
	     */
	    var Mailbox = (function (_super) {
	        __extends(Mailbox, _super);
	        function Mailbox(t) {
	            _super.call(this, function (x) { return x; });
	            this.send(t);
	        }
	        Mailbox.prototype.send = function (t) {
	            var _this = this;
	            async(function () {
	                _super.prototype.send.call(_this, t);
	            });
	        };
	        Mailbox.prototype.recv = function (k) {
	            _super.prototype.recv.call(this, k);
	        };
	        return Mailbox;
	    }(Signal));
	    exports.Mailbox = Mailbox;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    /** Helper function for creating VTrees exported to the top level. */
	    function el(tag, attrs, children) {
	        var children_trees = (typeof children === 'undefined')
	            ? []
	            : children.map(function (kid, idx) {
	                return typeof kid === 'string'
	                    ? new VTree(kid, [], VTreeType.Text)
	                    : kid;
	            });
	        return new VTree({
	            tag: tag,
	            attrs: attrs
	        }, children_trees, VTreeType.Node);
	    }
	    exports.el = el;
	    var VTreeType;
	    (function (VTreeType) {
	        VTreeType[VTreeType["Text"] = 0] = "Text";
	        VTreeType[VTreeType["Node"] = 1] = "Node";
	    })(VTreeType || (VTreeType = {}));
	    ;
	    /**
	     * A rose tree representing DOM elements. Can represent either an element node
	     * or a text node.
	     *
	     * Because VTree is lighter weight than actual DOM elements an efficient diff
	     * procedure can be used to compare old and new trees and determine what needs
	     * to be done to the actual DOM.
	     *
	     * The {@link VTree#key} property is used to determine equality. If a `key`
	     * attribute is provided, it will be used. If there is not one, then `id` will
	     * be used. Failing that the tag name will be used. If this is a text node, the
	     * text itself will be used. I'm open to other possibilities, especially
	     * regarding that last one.
	     */
	    var VTree = (function () {
	        function VTree(content, children, treeType) {
	            this.content = content;
	            this.children = children;
	            this.treeType = treeType;
	            this.mailbox = null;
	            /* There must be a key */
	            if (treeType === VTreeType.Node) {
	                if ('key' in this.content.attrs) {
	                    this.key = this.content.attrs.key;
	                    delete this.content.attrs.key;
	                }
	                else if ('id' in this.content.attrs) {
	                    this.key = this.content.attrs.id;
	                }
	                else {
	                    this.key = this.content.tag;
	                }
	            }
	            else {
	                this.key = 'text-node';
	            }
	        }
	        /**
	         * Whenever this VTree is re-rendered the DOM node will be sent to this
	         * Mailbox. This is useful in case an important element is recreated and you
	         * need an up to date reference to it.
	         */
	        VTree.prototype.subscribe = function (mailbox) {
	            this.mailbox = mailbox;
	            return this;
	        };
	        /** Equality based on the key. */
	        VTree.prototype.eq = function (other) {
	            if (!other) {
	                return false;
	            }
	            return (this.key === other.key);
	        };
	        return VTree;
	    }());
	    exports.VTree = VTree;
	    /** Constructs an actual DOM node from a {@link VTree}. */
	    function makeDOMNode(tree) {
	        if (tree === null) {
	            return null;
	        }
	        if (tree.treeType === VTreeType.Text) {
	            return document.createTextNode(tree.content);
	        }
	        var el = document.createElement(tree.content.tag);
	        for (var key in tree.content.attrs) {
	            el.setAttribute(key, tree.content.attrs[key]);
	        }
	        for (var i = 0; i < tree.children.length; i++) {
	            var child = makeDOMNode(tree.children[i]);
	            el.appendChild(child);
	        }
	        // if a mailbox was subscribed, notify it the element was re-rendered
	        if (tree.mailbox !== null) {
	            tree.mailbox.send(el);
	        }
	        return el;
	    }
	    /** Constructs an initial DOM from a {@link VTree}. */
	    function initialDOM(domRoot, tree) {
	        var root = domRoot;
	        var domTree = makeDOMNode(tree);
	        while (root.firstChild) {
	            root.removeChild(root.firstChild);
	        }
	        root.appendChild(domTree);
	    }
	    /**
	     * A simple enum representing three kinds of array edit operations.
	     */
	    var Op;
	    (function (Op) {
	        Op[Op["Merge"] = 0] = "Merge";
	        Op[Op["Delete"] = 1] = "Delete";
	        Op[Op["Insert"] = 2] = "Insert";
	    })(Op || (Op = {}));
	    ;
	    /**
	     * Computes an array of edit operations allowing the first argument to be
	     * transformed into the second argument.
	     *
	     * @param a - The original array
	     * @param b - The the desired array
	     * @param eq - An equality testing function for elements in the arrays.
	     * @return An array of {@link Op} values.
	     */
	    function diff_array(a, b, eq) {
	        if (!a.length) {
	            return b.map(function (c) { return [Op.Insert, null, c]; });
	        }
	        if (!b.length) {
	            return a.map(function (c) { return [Op.Delete, c, null]; });
	        }
	        var m = a.length + 1;
	        var n = b.length + 1;
	        var d = new Array(m * n);
	        var moves = [];
	        for (var i_1 = 0; i_1 < m; i_1++) {
	            d[i_1 * n] = i_1;
	        }
	        for (var j_1 = 0; j_1 < n; j_1++) {
	            d[j_1] = j_1;
	        }
	        for (var j_2 = 1; j_2 < n; j_2++) {
	            for (var i_2 = 1; i_2 < m; i_2++) {
	                if (eq(a[i_2 - 1], b[j_2 - 1])) {
	                    d[i_2 * n + j_2] = d[(i_2 - 1) * n + (j_2 - 1)];
	                }
	                else {
	                    d[i_2 * n + j_2] = Math.min(d[(i_2 - 1) * n + j_2], d[i_2 * n + (j_2 - 1)])
	                        + 1;
	                }
	            }
	        }
	        var i = m - 1, j = n - 1;
	        while (!(i === 0 && j === 0)) {
	            if (eq(a[i - 1], b[j - 1])) {
	                i--;
	                j--;
	                moves.unshift([Op.Merge, a[i], b[j]]);
	            }
	            else {
	                if (d[i * n + (j - 1)] <= d[(i - 1) * n + j]) {
	                    j--;
	                    moves.unshift([Op.Insert, null, b[j]]);
	                }
	                else {
	                    i--;
	                    moves.unshift([Op.Delete, a[i], null]);
	                }
	            }
	        }
	        return moves;
	    }
	    exports.diff_array = diff_array;
	    /**
	     * The name is a little misleading. This takes an old and a current
	     * {@link VTree}, the parent node of the one the old tree represents,
	     * and an (optional) index into that parent's childNodes array.
	     *
	     * If either of the trees is null or undefined this triggers DOM node creation
	     * or destruction.
	     *
	     * If both are nodes then attributes are reconciled followed by children.
	     *
	     * Otherwise the new tree simply overwrites the old one.
	     *
	     * While this does not perform a perfect tree diff it doesn't need to and
	     * performance is (probably) the better for it. In typical cases a DOM node will
	     * add or remove a few children at once, and the grandchildren will not need to
	     * be recovered from their parents. Meaning starting from the root node we can
	     * treat this as a list diff problem for the children and then, once children
	     * are paired up, we can recurse on them.
	     */
	    function diff_dom(parent, a, b, index) {
	        if (index === void 0) { index = 0; }
	        if (typeof b === 'undefined' || b === null) {
	            parent.removeChild(parent.childNodes[index]);
	            return;
	        }
	        if (typeof a === 'undefined' || a === null) {
	            parent.insertBefore(makeDOMNode(b), parent.childNodes[index]);
	            return;
	        }
	        if (b.treeType === VTreeType.Node) {
	            if (a.treeType === VTreeType.Node) {
	                if (a.content.tag === b.content.tag) {
	                    // contend with attributes. only necessary changes.
	                    var dom = parent.childNodes[index];
	                    for (var attr in a.content.attrs) {
	                        if (!(attr in b.content.attrs)) {
	                            dom.removeAttribute(attr);
	                            delete dom[attr];
	                        }
	                    }
	                    for (var attr in b.content.attrs) {
	                        var v = b.content.attrs[attr];
	                        if (!(attr in a.content.attrs) ||
	                            v !== a.content.attrs[attr]) {
	                            dom[attr] = v;
	                            dom.setAttribute(attr, v);
	                        }
	                    }
	                    // contend with the children.
	                    var moves = diff_array(a.children, b.children, function (a, b) {
	                        if (typeof a === 'undefined')
	                            return false;
	                        return a.eq(b);
	                    });
	                    var domIndex = 0;
	                    for (var i = 0; i < moves.length; i++) {
	                        var move = moves[i];
	                        diff_dom(parent.childNodes[index], move[1], move[2], domIndex);
	                        if (move[0] !== Op.Delete) {
	                            domIndex++;
	                        }
	                    }
	                }
	            }
	        }
	        else {
	            // different types of nodes, `b` is a text node, or they have different
	            // tags. in all cases just replace the DOM element.
	            parent.replaceChild(makeDOMNode(b), parent.childNodes[index]);
	        }
	    }
	    exports.diff_dom = diff_dom;
	    /**
	     * This reduces a Signal producing VTrees.
	     *
	     * @param view_signal - the Signal of VTrees coming from the App.
	     * @param domRoot - The root element we will be rendering the VTree in.
	     */
	    function render(view_signal, domRoot) {
	        view_signal.reduce(null, function (update, tree) {
	            if (tree === null) {
	                initialDOM(domRoot, update);
	            }
	            else {
	                diff_dom(domRoot, tree, update);
	            }
	            return update;
	        });
	    }
	    exports.render = render;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, alm_1, util_1) {
	    "use strict";
	    var Grid = (function () {
	        function Grid(size) {
	            this.size = size;
	            this.data = new Array(size * size);
	        }
	        Grid.prototype.at = function (x, y) {
	            return this.data[y * this.size + x];
	        };
	        Grid.prototype.set = function (x, y, v) {
	            this.data[y * this.size + x] = v;
	            return this;
	        };
	        Grid.prototype.toggle = function (x, y) {
	            return this.set(x, y, (this.at(x, y) + 1) % 3);
	        };
	        Grid.prototype.initialize = function () {
	            for (var i = 0; i < this.size; i++) {
	                for (var j = 0; j < this.size; j++) {
	                    this.set(i, j, 2);
	                }
	            }
	            return this;
	        };
	        Grid.prototype.verify = function () {
	            if (!this.completed()) {
	                return false;
	            }
	            var len = this.size; // it's a square, dummy!
	            var rowsSeen = {};
	            var colsSeen = {};
	            var colSet = new Array(this.size);
	            for (var i = 0; i < this.size; i++) {
	                colSet[i] = new Array(this.size);
	            }
	            for (var j = 0; j < this.size; j++) {
	                var row = [];
	                for (var i = 0; i < this.size; i++) {
	                    var val = this.at(i, j);
	                    if (val === 2) {
	                        return false;
	                    }
	                    row.push(val);
	                    // build up the columns as well
	                    colSet[i][j] = val;
	                }
	                var rowNum = util_1.bits2int(row);
	                if (rowNum in rowsSeen) {
	                    return false;
	                }
	                else {
	                    rowsSeen[rowNum] = 1;
	                }
	                if (util_1.sum_bits(row) !== (len / 2)) {
	                    return false;
	                }
	            }
	            // now study the columns
	            for (var c = 0; c < this.size; c++) {
	                var col = colSet[c];
	                var colNum = util_1.bits2int(col);
	                if (colNum in colsSeen) {
	                    return false;
	                }
	                else {
	                    colsSeen[colNum] = 1;
	                }
	                if (util_1.sum_bits(col) !== (len / 2)) {
	                    return false;
	                }
	            }
	            return true;
	        };
	        Grid.prototype.completed = function () {
	            return this.data.reduce(function (res, v) { return res && (v !== 2); }, true);
	        };
	        Grid.prototype.left_bounded_cell = function (idx) {
	            return (idx % this.size) === 0;
	        };
	        Grid.prototype.right_bounded_cell = function (idx) {
	            return (idx % this.size) === (this.size - 1);
	        };
	        Grid.prototype.top_bounded_cell = function (idx) {
	            return idx < this.size;
	        };
	        Grid.prototype.bottom_bounded_cell = function (idx) {
	            return idx > (this.size * (this.size - 1));
	        };
	        Grid.prototype.solve_pass = function () {
	            var size = this.size;
	            var s1 = this.size; // for brevity
	            var s2 = this.size * 2;
	            // go through and fill in any gaps or doubles
	            for (var idx = 0; idx < (size * size); idx++) {
	                if (this.data[idx] === 2) {
	                    continue;
	                }
	                // look for horizontal doubles
	                if (!this.right_bounded_cell(idx) &&
	                    this.data[idx] === this.data[idx + 1] &&
	                    (this.right_bounded_cell(idx + 1) ||
	                        this.data[idx + 2] !== this.data[idx]) &&
	                    (this.left_bounded_cell(idx) ||
	                        this.data[idx - 1] !== this.data[idx])) {
	                    if (!this.left_bounded_cell(idx) &&
	                        this.data[idx - 1] === 2) {
	                        this.data[idx - 1] = (this.data[idx] + 1) % 2;
	                    }
	                    if (!this.right_bounded_cell(idx + 1) &&
	                        this.data[idx + 2] === 2) {
	                        this.data[idx + 2] = (this.data[idx] + 1) % 2;
	                    }
	                }
	                // look for vertical doubles
	                if (!this.bottom_bounded_cell(idx) &&
	                    this.data[idx] === this.data[idx + s1] &&
	                    (this.bottom_bounded_cell(idx + s1) ||
	                        this.data[idx + s2] !== this.data[idx]) &&
	                    (this.top_bounded_cell(idx) ||
	                        this.data[idx - s1] !== this.data[idx])) {
	                    if (!this.top_bounded_cell(idx) &&
	                        this.data[idx - s1] === 2) {
	                        this.data[idx - s1] =
	                            (this.data[idx] + 1) % 2;
	                    }
	                    if (!this.bottom_bounded_cell(idx + s1) &&
	                        this.data[idx + s2] === 2) {
	                        this.data[idx + s2] = (this.data[idx] + 1) % 2;
	                    }
	                }
	                // look for horizontal gaps
	                if (!this.right_bounded_cell(idx) &&
	                    !this.right_bounded_cell(idx + 1) &&
	                    this.data[idx] === this.data[idx + 2] &&
	                    this.data[idx + 1] === 2) {
	                    this.data[idx + 1] = (this.data[idx] + 1) % 2;
	                }
	                // look for vertical gaps
	                if (!this.bottom_bounded_cell(idx) &&
	                    !this.bottom_bounded_cell(idx + s1) &&
	                    this.data[idx] === this.data[idx + s2] &&
	                    this.data[idx + s1] === 2) {
	                    this.data[idx + s1] = (this.data[idx] + 1) % 2;
	                }
	            }
	            var completedRows = [];
	            var missing2Rows = [];
	            // check to see if any rows are almost done
	            for (var j = 0; j < size; j++) {
	                var totals = [0, 0];
	                var remaining = 0;
	                var row = new Array(size);
	                for (var i = 0; i < size; i++) {
	                    var val = this.at(i, j);
	                    if (val !== 2) {
	                        totals[val] = totals[val] + 1;
	                    }
	                    else {
	                        remaining++;
	                    }
	                    row[i] = val;
	                }
	                if (remaining === 0) {
	                    completedRows.push({
	                        idx: j,
	                        row: row
	                    });
	                }
	                if (remaining === 2) {
	                    missing2Rows.push({
	                        idx: j,
	                        row: row
	                    });
	                }
	                var color_fill = void 0;
	                if (totals[0] === size / 2) {
	                    color_fill = 1;
	                }
	                else if (totals[1] === size / 2) {
	                    color_fill = 0;
	                }
	                else {
	                    continue;
	                }
	                for (var i = 0; i < size; i++) {
	                    if (this.at(i, j) === 2) {
	                        this.set(i, j, color_fill);
	                    }
	                }
	            }
	            var completedCols = [];
	            var missing2Cols = [];
	            // check to see if any columns are almost done
	            for (var i = 0; i < size; i++) {
	                var totals = [0, 0];
	                var remaining = 0;
	                var col = new Array(size);
	                for (var j = 0; j < size; j++) {
	                    var val = this.at(i, j);
	                    col[j] = val;
	                    if (val !== 2) {
	                        totals[val] = totals[val] + 1;
	                    }
	                    else {
	                        remaining++;
	                    }
	                }
	                if (remaining === 0) {
	                    completedCols.push({
	                        idx: i,
	                        col: col
	                    });
	                }
	                if (remaining === 2) {
	                    missing2Cols.push({
	                        idx: i,
	                        col: col
	                    });
	                }
	                var color_fill = void 0;
	                if (totals[0] === size / 2) {
	                    color_fill = 1;
	                }
	                else if (totals[1] === size / 2) {
	                    color_fill = 0;
	                }
	                else {
	                    continue;
	                }
	                for (var j = 0; j < size; j++) {
	                    if (this.at(i, j) === 2) {
	                        this.set(i, j, color_fill);
	                    }
	                }
	            }
	            // go over the rows missing 2, compare them to completed rows, and then
	            // finish them
	            console.log('missing2Rows', missing2Rows);
	            for (var _i = 0, missing2Rows_1 = missing2Rows; _i < missing2Rows_1.length; _i++) {
	                var urow = missing2Rows_1[_i];
	                for (var _a = 0, completedRows_1 = completedRows; _a < completedRows_1.length; _a++) {
	                    var frow = completedRows_1[_a];
	                    var row_diff = util_1.array_diff(urow.row, frow.row);
	                    console.log('row_diff', row_diff);
	                    if (row_diff.length === 2) {
	                        this.set(row_diff[0], urow.idx, frow.row[row_diff[1]]);
	                        this.set(row_diff[1], urow.idx, frow.row[row_diff[0]]);
	                    }
	                }
	            }
	            // and the same for columns
	            console.log('missing2Cols', missing2Cols);
	            for (var _b = 0, missing2Cols_1 = missing2Cols; _b < missing2Cols_1.length; _b++) {
	                var ucol = missing2Cols_1[_b];
	                for (var _c = 0, completedCols_1 = completedCols; _c < completedCols_1.length; _c++) {
	                    var fcol = completedCols_1[_c];
	                    var col_diff = util_1.array_diff(ucol.col, fcol.col);
	                    console.log('col_diff', col_diff);
	                    if (col_diff.length === 2) {
	                        this.set(ucol.idx, col_diff[0], fcol.col[col_diff[1]]);
	                        this.set(ucol.idx, col_diff[1], fcol.col[col_diff[0]]);
	                    }
	                }
	            }
	        };
	        Grid.prototype.solve = function () {
	            var limit = 0;
	            while (limit++ < 200 && !this.completed()) {
	                this.solve_pass();
	            }
	        };
	        Grid.prototype.randomUnder = function (n) {
	            return Math.floor(Math.random() * n);
	        };
	        Grid.prototype.clear = function () {
	            for (var idx in this.data) {
	                this.data[idx] = 2;
	            }
	        };
	        Grid.prototype.generate = function () {
	            this.clear();
	            var choices = [];
	            var done = false;
	            while (!done) {
	                var locationFound = false;
	                var location_1 = void 0;
	                while (!locationFound) {
	                    location_1 = this.randomUnder(this.size * this.size);
	                    if (this.data[location_1] === 2) {
	                        locationFound = true;
	                    }
	                }
	                var color = this.randomUnder(2);
	                this.data[location_1] = color;
	                choices.push([location_1, color]);
	                this.solve();
	                var verified = this.verify();
	                var completed = this.completed();
	                if (verified) {
	                    done = true;
	                }
	                else if (completed) {
	                    choices.pop();
	                }
	                else if (choices.length > 25) {
	                    choices = [];
	                    this.clear();
	                }
	            }
	            this.clear();
	            for (var _i = 0, choices_1 = choices; _i < choices_1.length; _i++) {
	                var choice = choices_1[_i];
	                this.data[choice[0]] = choice[1];
	            }
	            return this;
	        };
	        Grid.prototype.render = function () {
	            var tblRows = new Array(this.size);
	            var count = 0;
	            for (var j = 0; j < this.size; j++) {
	                var tblRow = [];
	                for (var i = 0; i < this.size; i++) {
	                    //const val = (i + j) % 2;
	                    var val = this.at(i, j);
	                    var td = alm_1.el('td', {
	                        'class': 'grid-cell-td',
	                        'id': 'grid-cell-td-' + count.toString()
	                    }, [alm_1.el('span', {
	                            'class': 'grid-cell grid-cell-' + val.toString(),
	                            'id': 'grid-cell-' + i.toString() + ':' + j.toString()
	                        }, [''])]);
	                    tblRow.push(td);
	                    count++;
	                }
	                tblRows[j] = alm_1.el('tr', {
	                    'class': 'grid-row',
	                    'id': 'grid-row-' + j.toString()
	                }, tblRow);
	            }
	            var gridTable = alm_1.el('table', {
	                'class': 'grid-table'
	            }, tblRows);
	            return alm_1.el('div', {}, [
	                gridTable,
	                alm_1.el('div', {
	                    'id': 'grid-status'
	                }, [(this.verify() ? 'Correct' : 'Incorrect')]),
	                alm_1.el('button', {
	                    'id': 'solve-btn'
	                }, ['Solve']),
	                alm_1.el('button', {
	                    'id': 'generate-btn'
	                }, ['Generate'])
	            ]);
	        };
	        return Grid;
	    }());
	    exports.Grid = Grid;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    function bits2int(bitArray) {
	        var num = 0;
	        var mask = 1;
	        for (var i = 0; i < bitArray.length; i++) {
	            var digit = bitArray[i];
	            num = num << 1;
	            if (digit) {
	                num = num | mask;
	            }
	        }
	        return num;
	    }
	    exports.bits2int = bits2int;
	    function sum_bits(bitArray) {
	        return bitArray.reduce(function (total, n) { return total + n; }, 0);
	    }
	    exports.sum_bits = sum_bits;
	    function random_bit() {
	        return Math.floor(Math.random() * 2);
	    }
	    exports.random_bit = random_bit;
	    // return the indices which are different for two arrays
	    function array_diff(a, b) {
	        if (a.length !== b.length) {
	            return [];
	        }
	        var result = [];
	        for (var i = 0; i < a.length; i++) {
	            if (a[i] !== b[i]) {
	                result.push(i);
	            }
	        }
	        return result;
	    }
	    exports.array_diff = array_diff;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ]);