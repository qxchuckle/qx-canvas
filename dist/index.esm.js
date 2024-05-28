class Renderer {
    canvas;
    options;
    constructor(options) {
        this.canvas = options.canvas;
        this.options = options;
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    get backgroundColor() {
        return this.options.backgroundColor;
    }
    get backgroundAlpha() {
        return this.options.backgroundAlpha;
    }
}

class CanvasRenderer extends Renderer {
    ctx;
    constructor(options) {
        super(options);
        console.log("使用Canvas2D渲染中");
        this.ctx = this.canvas.getContext("2d");
    }
    render(stage) {
        stage.updateTransform();
        this.renderBackground();
        stage.renderCanvas(this);
    }
    renderBackground() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.globalAlpha = this.backgroundAlpha;
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.restore();
    }
}

var ShapeType;
(function (ShapeType) {
    ShapeType["Rectangle"] = "rectangle";
    ShapeType["Polygon"] = "polygon";
    ShapeType["Circle"] = "circle";
    ShapeType["Ellipse"] = "ellipse";
    ShapeType["RoundRect"] = "roundRect";
    ShapeType["Path"] = "path";
})(ShapeType || (ShapeType = {}));
var LINE_CAP;
(function (LINE_CAP) {
    LINE_CAP["BUTT"] = "butt";
    LINE_CAP["ROUND"] = "round";
    LINE_CAP["SQUARE"] = "square";
})(LINE_CAP || (LINE_CAP = {}));
var LINE_JOIN;
(function (LINE_JOIN) {
    LINE_JOIN["MITER"] = "miter";
    LINE_JOIN["BEVEL"] = "bevel";
    LINE_JOIN["ROUND"] = "round";
})(LINE_JOIN || (LINE_JOIN = {}));
var EventPhase;
(function (EventPhase) {
    EventPhase["NONE"] = "none";
    EventPhase["CAPTURING"] = "capturing";
    EventPhase["AT_TARGET"] = "atTarget";
    EventPhase["BUBBLING"] = "bubbling";
})(EventPhase || (EventPhase = {}));
var LifecycleKey;
(function (LifecycleKey) {
    LifecycleKey["BeforeMount"] = "beforeMount";
    LifecycleKey["Mounted"] = "mounted";
    LifecycleKey["BeforeRender"] = "beforeRender";
    LifecycleKey["Rendering"] = "rendering";
    LifecycleKey["Rendered"] = "rendered";
    LifecycleKey["BeforeUnmount"] = "beforeUnmount";
    LifecycleKey["Unmounted"] = "unmounted";
})(LifecycleKey || (LifecycleKey = {}));

const getArrLast = (arr) => {
    return arr.length > 0 ? arr[arr.length - 1] : null;
};
function matrixMultiply(m1, m2) {
    return {
        a: m1.a * m2.a + m1.c * m2.b,
        b: m1.b * m2.a + m1.d * m2.b,
        c: m1.a * m2.c + m1.c * m2.d,
        d: m1.b * m2.c + m1.d * m2.d,
        tx: m1.a * m2.tx + m1.c * m2.ty + m1.tx,
        ty: m1.b * m2.tx + m1.d * m2.ty + m1.ty,
    };
}
function isIntersect(ox, oy, px1, py1, px2, py2) {
    if (py1 < oy && py2 < oy)
        return false;
    if (py1 > oy && py2 > oy)
        return false;
    if (px1 < ox && px2 < ox)
        return false;
    if (px1 > ox && px2 > ox)
        return true;
    const x = ((oy - py1) * (px2 - px1)) / (py2 - py1) + px1;
    return x > ox;
}
function isSameArray(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    return arr1.every((item, index) => item === arr2[index]);
}
function nextTick(fn) {
    if (typeof Promise !== "undefined") {
        Promise.resolve().then(fn);
    }
    else {
        setTimeout(fn, 0);
    }
}

class Point {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    set(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Point(this.x, this.y);
    }
}
class ObservablePoint {
    _x;
    _y;
    cb;
    constructor(cb, x = 0, y = 0) {
        this._x = x;
        this._y = y;
        this.cb = cb;
    }
    set(x = 0, y = x) {
        this._x = x;
        this._y = y;
        this.cb(this._x, this._y);
    }
    get x() {
        return this._x;
    }
    set x(value) {
        if (this._x !== value) {
            this._x = value;
            this.cb(this._x, this._y);
        }
    }
    get y() {
        return this._y;
    }
    set y(value) {
        if (this._y !== value) {
            this._y = value;
            this.cb(this._x, this._y);
        }
    }
}

class Matrix {
    a;
    b;
    c;
    d;
    tx;
    ty;
    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }
    set(a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        return this;
    }
    append(m) {
        const { a, b, c, d, tx, ty } = matrixMultiply(this, m);
        this.set(a, b, c, d, tx, ty);
        return this;
    }
    prepend(m) {
        const { a, b, c, d, tx, ty } = matrixMultiply(m, this);
        this.set(a, b, c, d, tx, ty);
        return this;
    }
    apply(p) {
        const newPos = new Point();
        const x = p.x;
        const y = p.y;
        newPos.x = this.a * x + this.c * y + this.tx;
        newPos.y = this.b * x + this.d * y + this.ty;
        return newPos;
    }
    applyInverse(p) {
        const newPos = new Point();
        const id = 1 / (this.a * this.d + this.c * -this.b);
        const x = p.x;
        const y = p.y;
        newPos.x =
            this.d * id * x +
                -this.c * id * y +
                (this.ty * this.c - this.tx * this.d) * id;
        newPos.y =
            this.a * id * y +
                -this.b * id * x +
                (-this.ty * this.a + this.tx * this.b) * id;
        return newPos;
    }
    clone() {
        const matrix = new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        return matrix;
    }
    getID() {
        return `${this.a},${this.b},${this.c},${this.d},${this.tx},${this.ty}`;
    }
}

const DEG_TO_RAD = Math.PI / 180;

class Transform {
    localMatrix = new Matrix();
    worldMatrix = new Matrix();
    position;
    pivot;
    scale;
    skew;
    _rotate = 0;
    rotateMatrix = new Matrix();
    skewMatrix = new Matrix();
    scaleMatrix = new Matrix();
    shouldUpdateLocalMatrix = false;
    parentID = "";
    constructor() {
        this.position = new ObservablePoint(this.onChange);
        this.pivot = new ObservablePoint(this.onChange);
        this.scale = new ObservablePoint(this.onScaleChange, 1, 1);
        this.skew = new ObservablePoint(this.onSkewChange);
    }
    get wordID() {
        return this.worldMatrix.getID();
    }
    get rotate() {
        return this._rotate;
    }
    set rotate(r) {
        this._rotate = r * DEG_TO_RAD;
        this.rotateMatrix.set(Math.cos(this.rotate), Math.sin(this.rotate), -Math.sin(this.rotate), Math.cos(this.rotate), 0, 0);
        this.shouldUpdateLocalMatrix = true;
    }
    onChange = () => {
        this.shouldUpdateLocalMatrix = true;
    };
    onScaleChange = (scaleX, scaleY) => {
        this.scaleMatrix.set(scaleX, 0, 0, scaleY, 0, 0);
        this.shouldUpdateLocalMatrix = true;
    };
    onSkewChange = (skewX, skewY) => {
        skewX *= DEG_TO_RAD;
        skewY *= DEG_TO_RAD;
        this.skewMatrix.set(Math.cos(skewY), Math.sin(skewY), Math.sin(skewX), Math.cos(skewX), 0, 0);
        this.shouldUpdateLocalMatrix = true;
    };
    updateLocalMatrix() {
        if (!this.shouldUpdateLocalMatrix) {
            return;
        }
        const { a, b, c, d } = new Matrix()
            .append(this.rotateMatrix)
            .append(this.skewMatrix)
            .append(this.scaleMatrix);
        const newPivotX = a * this.pivot.x + c * this.pivot.y;
        const newPivotY = b * this.pivot.x + d * this.pivot.y;
        const tx = this.position.x - newPivotX;
        const ty = this.position.y - newPivotY;
        this.localMatrix
            .set(a, b, c, d, tx, ty)
            .prepend(new Matrix(1, 0, 0, 1, this.pivot.x, this.pivot.y));
        this.shouldUpdateLocalMatrix = false;
        this.parentID = "";
    }
    updateWorldMatrix(parentTransform) {
        if (this.parentID === parentTransform.wordID) {
            return;
        }
        const { a, b, c, d, tx, ty } = matrixMultiply(parentTransform.worldMatrix, this.localMatrix);
        this.worldMatrix.set(a, b, c, d, tx, ty);
        this.parentID = parentTransform.wordID;
    }
    updateTransform(parentTransform) {
        this.updateLocalMatrix();
        this.updateWorldMatrix(parentTransform);
    }
}

class EventClient {
    _events = new Map();
    on(event, listener) {
        if (!this._events.has(event)) {
            this._events.set(event, new Set());
        }
        this._events.get(event).add(listener);
    }
    once(event, listener) {
        const onceListener = (...args) => {
            listener(...args);
            this.off(event, onceListener);
        };
        this.on(event, onceListener);
    }
    emit(event, ...args) {
        if (this._events.has(event)) {
            this._events.get(event).forEach((listener) => {
                listener(...args);
            });
        }
    }
    off(event, listener) {
        if (this._events.has(event)) {
            this._events.get(event).delete(listener);
        }
    }
    offAll(event) {
        if (this._events.has(event)) {
            this._events.delete(event);
        }
    }
    offAllEvents() {
        this._events.clear();
    }
}

class Node extends EventClient {
    visible = true;
    alpha = 1;
    worldAlpha = 1;
    _zIndex = 0;
    transform = new Transform();
    cursor = "auto";
    hitArea = null;
    sorted = false;
    parent = null;
    children = [];
    id = "";
    class = [];
    get zIndex() {
        return this._zIndex;
    }
    set zIndex(value) {
        if (this._zIndex === value)
            return;
        this._zIndex = value;
        this.parent && (this.parent.sorted = false);
    }
    setZIndex(index) {
        this.zIndex = index;
        return this;
    }
    setAlpha(alpha) {
        this.alpha = alpha;
        return this;
    }
    setVisible(visible) {
        this.visible = visible;
        return this;
    }
    setCursor(cursor) {
        this.cursor = cursor;
        return this;
    }
    setHitArea(hitArea) {
        this.hitArea = hitArea;
        return this;
    }
    setId(id) {
        this.id = id;
        return this;
    }
    setClass(className) {
        this.class = className.split(" ");
        return this;
    }
    addClass(className) {
        this.class.push(...className.split(" "));
        return this;
    }
    removeClass(className) {
        const classes = className.split(" ");
        this.class = this.class.filter((c) => !classes.includes(c));
        return this;
    }
    setScale(x, y) {
        this.transform.scale.set(x, y);
        return this;
    }
    setRotation(rotation) {
        this.transform.rotate = rotation;
        return this;
    }
    setPosition(x, y) {
        this.transform.position.set(x, y);
        return this;
    }
    setPivot(x, y) {
        this.transform.pivot.set(x, y);
        return this;
    }
    setSkew(x, y) {
        this.transform.skew.set(x, y);
        return this;
    }
    sort() {
        if (this.sorted)
            return;
        this.children.sort((a, b) => a.zIndex - b.zIndex);
        this.sorted = true;
    }
    contains(p) {
        if (!this.hitArea) {
            return false;
        }
        return this.hitArea.contains(p);
    }
    updateTransform() {
        this.sort();
        this.transform.updateTransform(this.parent?.transform ?? new Transform());
        this.worldAlpha = (this.parent?.worldAlpha ?? 1) * this.alpha;
        if (this.worldAlpha <= 0 || !this.visible) {
            return;
        }
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].updateTransform();
        }
    }
    addEventListener(type, listener, options) {
        const opts = this.analyzeEventOptions(options);
        const realType = opts.capture ? `${type}_capture` : `${type}_bubble`;
        if (opts.once) {
            this.once(realType, listener);
        }
        else {
            this.on(realType, listener);
        }
        return this;
    }
    removeEventListener(type, listener, capture) {
        const realType = capture ? `${type}_capture` : `${type}_bubble`;
        this.off(realType, listener);
        return this;
    }
    analyzeEventOptions(options) {
        if (typeof options === "boolean") {
            return {
                capture: options,
                once: false,
            };
        }
        return {
            capture: options?.capture ?? false,
            once: options?.once ?? false,
        };
    }
    findById(id) {
        if (this.id === id) {
            return this;
        }
        for (let i = 0; i < this.children.length; i++) {
            const node = this.children[i].findById(id);
            if (node) {
                return node;
            }
        }
        return null;
    }
    findByClass(className) {
        const result = [];
        if (this.class.includes(className)) {
            result.push(this);
        }
        for (let i = 0; i < this.children.length; i++) {
            result.push(...this.children[i].findByClass(className));
        }
        return result;
    }
}

class Group extends Node {
    lifecycleHooks = new Map();
    addLifecycleHook(key, handler) {
        if (!this.lifecycleHooks.has(key)) {
            this.lifecycleHooks.set(key, new Set());
        }
        this.lifecycleHooks.get(key)?.add(handler);
    }
    onBeforeMount(handler) {
        this.addLifecycleHook(LifecycleKey.BeforeMount, handler);
        return this;
    }
    onMounted(handler) {
        this.addLifecycleHook(LifecycleKey.Mounted, handler);
        return this;
    }
    onBeforeRender(handler) {
        this.addLifecycleHook(LifecycleKey.BeforeRender, handler);
        return this;
    }
    onRendering(handler) {
        this.addLifecycleHook(LifecycleKey.Rendering, handler);
        return this;
    }
    onRendered(handler) {
        this.addLifecycleHook(LifecycleKey.Rendered, handler);
        return this;
    }
    onBeforeUnmount(handler) {
        this.addLifecycleHook(LifecycleKey.BeforeUnmount, handler);
        return this;
    }
    onUnmounted(handler) {
        this.addLifecycleHook(LifecycleKey.Unmounted, handler);
        return this;
    }
    callLifecycleHook(key, item, renderer) {
        const hooks = this.lifecycleHooks.get(key);
        if (hooks && hooks.size > 0) {
            for (const hook of hooks) {
                hook.call(this, item, renderer);
            }
        }
    }
    renderCanvas(renderer) {
        this.callLifecycleHook(LifecycleKey.BeforeRender, this, renderer);
        if (!this.visible) {
            return;
        }
        this.renderSelf(renderer);
        this.callLifecycleHook(LifecycleKey.Rendering, this, renderer);
        this.renderChildren(renderer);
        this.callLifecycleHook(LifecycleKey.Rendered, this, renderer);
        return this;
    }
    renderSelf(renderer) {
        renderer.ctx.save();
        this.applyTransform(renderer);
        renderer.ctx.restore();
        return this;
    }
    renderChildren(renderer) {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].renderCanvas(renderer);
        }
        return this;
    }
    addOneChild(child) {
        child.parent?.remove(child);
        child.callLifecycleHook(LifecycleKey.BeforeMount, child);
        this.children.push(child);
        child.parent = this;
        this.sorted = false;
        child.callLifecycleHook(LifecycleKey.Mounted, child);
    }
    add(child) {
        nextTick(() => {
            if (Array.isArray(child)) {
                for (let i = 0; i < child.length; i++) {
                    this.addOneChild(child[i]);
                }
            }
            else {
                this.addOneChild(child);
            }
        });
        return this;
    }
    remove(child) {
        nextTick(() => {
            const index = this.children.indexOf(child);
            if (index !== -1) {
                child.callLifecycleHook(LifecycleKey.BeforeUnmount, child);
                this.children.splice(index, 1);
                child.parent = null;
                child.callLifecycleHook(LifecycleKey.Unmounted, child);
            }
        });
        return this;
    }
    removeChildren() {
        for (let i = 0; i < this.children.length; i++) {
            this.remove(this.children[i]);
        }
        return this;
    }
    removeSelf() {
        this.parent?.remove(this);
        return this;
    }
    destroy() {
        this.removeChildren();
        this.removeSelf();
    }
    applyTransform(renderer) {
        const { a, b, c, d, tx, ty } = this.transform.worldMatrix;
        renderer.ctx.setTransform(a, b, c, d, tx, ty);
    }
    getSpreadPath() {
        const res = [];
        let target = this;
        while (target) {
            res.push(target);
            target = target.parent;
        }
        return res.reverse();
    }
}

const eventMap = {
    pointermove: "mousemove",
    pointerleave: "mouseleave",
    pointerdown: "mousedown",
    pointerup: "mouseup",
};
class EventObject {
    isTrusted = true;
    timeStamp = 0;
    type = "mousemove";
    button = 0;
    buttons = 0;
    global = new Point();
    propagationStopped = false;
    eventPhase = EventPhase.NONE;
    target = new Group();
    currentTarget = new Group();
    stopPropagation() {
        this.propagationStopped = true;
    }
    convertPointerEvent(nativeEvent) {
        this.isTrusted = nativeEvent.isTrusted;
        this.timeStamp = nativeEvent.timeStamp;
        this.type = eventMap[nativeEvent.type];
        this.button = nativeEvent.button;
        this.buttons = nativeEvent.buttons;
        this.global.set(nativeEvent.offsetX, nativeEvent.offsetY);
    }
    clone() {
        const event = new EventObject();
        event.isTrusted = this.isTrusted;
        event.timeStamp = this.timeStamp;
        event.type = this.type;
        event.button = this.button;
        event.buttons = this.buttons;
        event.global = this.global.clone();
        event.propagationStopped = this.propagationStopped;
        event.eventPhase = this.eventPhase;
        event.target = this.target;
        event.currentTarget = this.currentTarget;
        return event;
    }
}

class EventAdmin {
    stage;
    cursor = "auto";
    hitTarget = null;
    eventHandlerMap = {};
    pressTargetsMap = {};
    overTargets = [];
    constructor(stage) {
        this.stage = stage;
        this.eventHandlerMap.mousemove = this.onMouseMove;
        this.eventHandlerMap.mousedown = this.onMouseDown;
        this.eventHandlerMap.mouseup = this.onMouseUp;
        this.eventHandlerMap.mouseleave = this.onMouseLeave;
    }
    onMouseMove = (e) => {
        const hitTarget = this.hitTest(e.global);
        const topTarget = getArrLast(this.overTargets);
        let hitPath;
        if (topTarget && hitTarget !== topTarget) {
            e.target = topTarget;
            e.type = "mouseout";
            this.dispatchEvent(e);
            !hitPath && (hitPath = this.spreadPath(hitTarget));
            if (!hitTarget || !hitPath.includes(topTarget)) {
                e.type = "mouseleave";
                if (!hitTarget) {
                    for (let i = this.overTargets.length - 1; i >= 0; i--) {
                        this.emitAtTargetEvent(this.overTargets[i], e);
                    }
                }
                else {
                    for (let i = this.overTargets.length - 1; i >= 0; i--) {
                        if (hitPath.includes(this.overTargets[i])) {
                            break;
                        }
                        this.emitAtTargetEvent(this.overTargets[i], e);
                    }
                }
            }
        }
        if (hitTarget && hitTarget !== topTarget) {
            e.target = hitTarget;
            e.type = "mouseover";
            this.dispatchEvent(e);
            !hitPath && (hitPath = this.spreadPath(hitTarget));
            e.type = "mouseenter";
            if (!topTarget) {
                for (let i = 0; i < hitPath.length; i++) {
                    this.emitAtTargetEvent(hitPath[i], e);
                }
            }
            else {
                for (let i = hitPath.length - 1; i >= 0; i--) {
                    if (this.overTargets.includes(hitPath[i])) {
                        break;
                    }
                    this.emitAtTargetEvent(hitPath[i], e);
                }
            }
        }
        if (hitTarget) {
            !hitPath && (hitPath = this.spreadPath(hitTarget));
            e.target = hitTarget;
            e.type = "mousemove";
            this.dispatchEvent(e);
        }
        this.overTargets = hitPath ?? [];
        this.cursor = "auto";
        for (let i = this.overTargets.length - 1; i >= 0; i--) {
            this.cursor = this.overTargets[i].cursor;
            if (this.cursor !== "auto") {
                break;
            }
        }
    };
    onMouseDown = (e) => {
        const hitTarget = this.hitTest(e.global);
        if (!hitTarget) {
            return;
        }
        e.target = hitTarget;
        e.type = "mousedown";
        this.dispatchEvent(e);
        this.pressTargetsMap[e.button] = this.spreadPath(hitTarget);
    };
    onMouseUp = (e) => {
        const hitTarget = this.hitTest(e.global);
        if (!hitTarget) {
            return;
        }
        e.target = hitTarget;
        e.type = "mouseup";
        this.dispatchEvent(e);
        const propagationPath = this.pressTargetsMap[e.button];
        if (!propagationPath) {
            return;
        }
        const pressTarget = propagationPath[propagationPath.length - 1];
        let clickTarget = pressTarget;
        if (pressTarget !== hitTarget) {
            const hitPath = this.spreadPath(hitTarget);
            for (let i = propagationPath.length - 2; i >= 0; i--) {
                if (hitPath.includes(propagationPath[i])) {
                    clickTarget = propagationPath[i];
                    break;
                }
            }
        }
        if (clickTarget) {
            e.target = clickTarget;
            e.type = "click";
            this.dispatchEvent(e);
        }
    };
    onMouseLeave = (e) => {
        this.overTargets = [];
    };
    emitEvent = (e) => {
        this.eventHandlerMap[e.type]?.(e);
    };
    hitTest = (p) => {
        this.hitTarget = null;
        this.hitTestRecursive(this.stage, p);
        return this.hitTarget;
    };
    hitTestRecursive = (curTarget, p) => {
        if (!curTarget.visible) {
            return;
        }
        for (let i = curTarget.children.length - 1; i >= 0; i--) {
            this.hitTestRecursive(curTarget.children[i], p);
            if (this.hitTarget) {
                return;
            }
        }
        if (curTarget.contains(p)) {
            this.hitTarget = curTarget;
        }
    };
    spreadPath = (target) => {
        return target?.getSpreadPath() ?? [];
    };
    dispatchEvent(e) {
        e.propagationStopped = false;
        const spreadPath = this.spreadPath(e.target);
        this.propagateEvent(e, spreadPath);
    }
    propagateEvent(e, spreadPath) {
        e.eventPhase = EventPhase.CAPTURING;
        for (let i = 0; i < spreadPath.length; i++) {
            e.currentTarget = spreadPath[i];
            e.currentTarget.emit(`${e.type}_capture`, e);
            if (e.propagationStopped) {
                return;
            }
        }
        this.emitAtTargetEvent(e.target, e);
        if (e.propagationStopped) {
            return;
        }
        e.eventPhase = EventPhase.BUBBLING;
        for (let i = spreadPath.length - 2; i >= 0; i--) {
            e.currentTarget = spreadPath[i];
            e.currentTarget.emit(`${e.type}_bubble`, e);
            if (e.propagationStopped) {
                return;
            }
        }
    }
    emitAtTargetEvent(target, e) {
        e.eventPhase = EventPhase.AT_TARGET;
        e.target = target;
        e.currentTarget = target;
        e.currentTarget.emit(`${e.type}_capture`, e);
        e.currentTarget.emit(`${e.type}_bubble`, e);
    }
    isDescendantOf(e1, e2) {
        return this.spreadPath(e1).includes(e2);
    }
}

class EventSystem {
    canvas;
    rootEvent = new EventObject();
    eventAdmin;
    constructor(canvas, stage) {
        this.canvas = canvas;
        this.eventAdmin = new EventAdmin(stage);
        this.addDomEvents();
    }
    addDomEvents = () => {
        this.canvas.addEventListener("pointermove", this.onPointerMove, true);
        this.canvas.addEventListener("pointerleave", this.onPointerLeave, true);
        this.canvas.addEventListener("pointerdown", this.onPointerDown, true);
        this.canvas.addEventListener("pointerup", this.onPointerup, true);
    };
    onPointerMove = (nativeEvent) => {
        this.onEvent(nativeEvent);
        this.setCursor();
    };
    onPointerLeave = (nativeEvent) => {
        this.onEvent(nativeEvent);
    };
    onPointerDown = (nativeEvent) => {
        this.onEvent(nativeEvent);
    };
    onPointerup = (nativeEvent) => {
        this.onEvent(nativeEvent);
    };
    onEvent = (nativeEvent) => {
        this.rootEvent.convertPointerEvent(nativeEvent);
        this.eventAdmin.emitEvent(this.rootEvent);
    };
    setCursor = () => {
        this.canvas.style.cursor = this.eventAdmin.cursor;
    };
}

class Shape {
}

class Rectangle extends Shape {
    type = ShapeType.Rectangle;
    x;
    y;
    width;
    height;
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    contains(p) {
        if (p.x > this.x &&
            p.x < this.x + this.width &&
            p.y > this.y &&
            p.y < this.y + this.height) {
            return true;
        }
        else {
            return false;
        }
    }
    render(renderer, data, worldAlpha, setCtxStyle) {
        const ctx = renderer.ctx;
        const fillStyle = data.fillStyle;
        const lineStyle = data.lineStyle;
        if (fillStyle.visible) {
            setCtxStyle(ctx, data, true);
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if (lineStyle.visible) {
            setCtxStyle(ctx, data, false);
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

class Circle extends Shape {
    type = ShapeType.Circle;
    x;
    y;
    radius;
    constructor(x, y, radius) {
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    contains(p) {
        return (Math.pow(p.x - this.x, 2) + Math.pow(p.y - this.y, 2) <=
            Math.pow(this.radius, 2));
    }
    render(renderer, data, worldAlpha, setCtxStyle) {
        const ctx = renderer.ctx;
        const fillStyle = data.fillStyle;
        const lineStyle = data.lineStyle;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        if (fillStyle.visible) {
            setCtxStyle(ctx, data, true);
            ctx.fill();
        }
        if (lineStyle.visible) {
            setCtxStyle(ctx, data, false);
            ctx.stroke();
        }
    }
}

class Ellipse extends Shape {
    type = ShapeType.Ellipse;
    x;
    y;
    radiusX;
    radiusY;
    constructor(x, y, radiusX, radiusY) {
        super();
        this.x = x;
        this.y = y;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
    }
    contains(p) {
        return (Math.pow(p.x - this.x, 2) / Math.pow(this.radiusX, 2) +
            Math.pow(p.y - this.y, 2) / Math.pow(this.radiusY, 2) <=
            1);
    }
    render(renderer, data, worldAlpha, setCtxStyle) {
        const ctx = renderer.ctx;
        const fillStyle = data.fillStyle;
        const lineStyle = data.lineStyle;
        ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
        if (fillStyle.visible) {
            setCtxStyle(ctx, data, true);
            ctx.fill();
        }
        if (lineStyle.visible) {
            setCtxStyle(ctx, data, false);
            ctx.stroke();
        }
    }
}

class RoundRect extends Shape {
    type = ShapeType.RoundRect;
    x;
    y;
    width;
    height;
    radius;
    constructor(x, y, width, height, radius) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        const r = Math.min(width, height) / 2;
        this.radius = radius > r ? r : radius;
    }
    contains(p) {
        if (!(p.x > this.x &&
            p.x < this.x + this.width &&
            p.y > this.y &&
            p.y < this.y + this.height)) {
            return false;
        }
        const x1 = this.x + this.radius;
        const y1 = this.y + this.radius;
        if (p.x < x1 && p.y < y1) {
            return (Math.pow(p.x - x1, 2) + Math.pow(p.y - y1, 2) <=
                Math.pow(this.radius, 2));
        }
        const x2 = this.x + this.width - this.radius;
        const y2 = this.y + this.radius;
        if (p.x > x2 && p.y < y2) {
            return (Math.pow(p.x - x2, 2) + Math.pow(p.y - y2, 2) <=
                Math.pow(this.radius, 2));
        }
        const x3 = this.x + this.radius;
        const y3 = this.y + this.height - this.radius;
        if (p.x < x3 && p.y > y3) {
            return (Math.pow(p.x - x3, 2) + Math.pow(p.y - y3, 2) <=
                Math.pow(this.radius, 2));
        }
        const x4 = this.x + this.width - this.radius;
        const y4 = this.y + this.height - this.radius;
        if (p.x > x4 && p.y > y4) {
            return (Math.pow(p.x - x4, 2) + Math.pow(p.y - y4, 2) <=
                Math.pow(this.radius, 2));
        }
        return true;
    }
    render(renderer, data, worldAlpha, setCtxStyle) {
        const ctx = renderer.ctx;
        ctx.roundRect(this.x, this.y, this.width, this.height, this.radius);
        const fillStyle = data.fillStyle;
        const lineStyle = data.lineStyle;
        if (fillStyle.visible) {
            setCtxStyle(ctx, data, true);
            ctx.fill();
        }
        if (lineStyle.visible) {
            setCtxStyle(ctx, data, false);
            ctx.stroke();
        }
    }
}

class Polygon extends Shape {
    type = ShapeType.Polygon;
    points;
    closePath;
    constructor(points, closePath = false) {
        super();
        this.points = points;
        this.closePath = closePath;
    }
    contains(p) {
        let count = 0;
        const len = this.points.length;
        for (let i = 0; i < len - 2; i += 2) {
            if (isIntersect(p.x, p.y, this.points[i], this.points[i + 1], this.points[i + 2], this.points[i + 3])) {
                count++;
            }
        }
        if (isIntersect(p.x, p.y, this.points[0], this.points[1], this.points[len - 2], this.points[len - 1])) {
            count++;
        }
        if (count % 2 === 0) {
            return false;
        }
        else {
            return true;
        }
    }
    render(renderer, data, worldAlpha, setCtxStyle) {
        const ctx = renderer.ctx;
        const fillStyle = data.fillStyle;
        const lineStyle = data.lineStyle;
        ctx.moveTo(this.points[0], this.points[1]);
        for (let i = 2; i < this.points.length; i += 2) {
            const x = this.points[i];
            const y = this.points[i + 1];
            if (Number.isNaN(x) || Number.isNaN(y)) {
                ctx.moveTo(this.points[i + 2], this.points[i + 3]);
            }
            else {
                ctx.lineTo(x, y);
            }
        }
        if (this.closePath) {
            ctx.closePath();
        }
        if (fillStyle.visible) {
            setCtxStyle(ctx, data, true);
            ctx.fill();
        }
        if (lineStyle.visible) {
            setCtxStyle(ctx, data, false);
            ctx.stroke();
        }
    }
    reset() {
        this.points = [];
        this.closePath = false;
    }
    clone() {
        return new Polygon(this.points.slice(), this.closePath);
    }
}

const defaultStyle$1 = {
    color: "#000",
    alpha: 1,
    visible: false,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowColor: "#000",
};
class FillStyle {
    color = defaultStyle$1.color;
    alpha = defaultStyle$1.alpha;
    visible = defaultStyle$1.visible;
    shadowOffsetX = defaultStyle$1.shadowOffsetX;
    shadowOffsetY = defaultStyle$1.shadowOffsetY;
    shadowBlur = defaultStyle$1.shadowBlur;
    shadowColor = defaultStyle$1.shadowColor;
    constructor(style = {}) {
        this.set(style);
    }
    set(style = {}) {
        this.color = style.color ?? defaultStyle$1.color;
        this.alpha = style.alpha ?? defaultStyle$1.alpha;
        this.visible = style.visible ?? defaultStyle$1.visible;
        this.shadowOffsetX = style.shadowOffsetX ?? defaultStyle$1.shadowOffsetX;
        this.shadowOffsetY = style.shadowOffsetY ?? defaultStyle$1.shadowOffsetY;
        this.shadowBlur = style.shadowBlur ?? defaultStyle$1.shadowBlur;
        this.shadowColor = style.shadowColor ?? defaultStyle$1.shadowColor;
    }
    clone() {
        const obj = new FillStyle();
        obj.set(this);
        return obj;
    }
    reset() {
        this.set(defaultStyle$1);
    }
    isSameOf(style) {
        return (this.color === style.color &&
            this.alpha === style.alpha &&
            this.visible === style.visible &&
            this.shadowOffsetX === style.shadowOffsetX &&
            this.shadowOffsetY === style.shadowOffsetY &&
            this.shadowBlur === style.shadowBlur &&
            this.shadowColor === style.shadowColor);
    }
}

const defaultStyle = {
    width: 0,
    cap: LINE_CAP.BUTT,
    join: LINE_JOIN.MITER,
    miterLimit: 10,
    lineDash: [],
};
class LineStyle extends FillStyle {
    width = defaultStyle.width;
    cap = LINE_CAP.BUTT;
    join = LINE_JOIN.MITER;
    miterLimit = 10;
    lineDash = [];
    constructor(style = {}) {
        super(style);
        this.set(style);
    }
    set(style = {}) {
        super.set(style);
        this.width = style.width ?? defaultStyle.width;
        this.cap = style.cap ?? defaultStyle.cap;
        this.join = style.join ?? defaultStyle.join;
        this.miterLimit = style.miterLimit ?? defaultStyle.miterLimit;
        this.lineDash = style.lineDash ?? defaultStyle.lineDash;
    }
    clone() {
        const obj = new LineStyle();
        obj.set(this);
        return obj;
    }
    reset() {
        super.reset();
        this.set(defaultStyle);
    }
    isSameOf(style) {
        return (super.isSameOf({
            color: style.color,
            alpha: style.alpha,
            visible: style.visible,
            shadowOffsetX: style.shadowOffsetX,
            shadowOffsetY: style.shadowOffsetY,
            shadowBlur: style.shadowBlur,
            shadowColor: style.shadowColor,
        }) &&
            this.width === style.width &&
            this.cap === style.cap &&
            this.join === style.join &&
            this.miterLimit === style.miterLimit &&
            isSameArray(this.lineDash, style.lineDash));
    }
}

class Path extends Shape {
    type = ShapeType.Path;
    points;
    state = {};
    lastStateIndex = -1;
    fillStyle = new FillStyle();
    lineStyle = new LineStyle();
    closePath = false;
    path2D = {
        fillPath: new Path2D(),
        linePath: new Path2D(),
    };
    constructor(points = []) {
        super();
        this.points = points;
    }
    contains(p) {
        let count = 0;
        const len = this.points.length;
        for (let i = 0; i < len - 2; i += 2) {
            if (isIntersect(p.x, p.y, this.points[i], this.points[i + 1], this.points[i + 2], this.points[i + 3])) {
                count++;
            }
        }
        if (isIntersect(p.x, p.y, this.points[0], this.points[1], this.points[len - 2], this.points[len - 1])) {
            count++;
        }
        if (count % 2 === 0) {
            return false;
        }
        else {
            return true;
        }
    }
    pushState(style, closePath = false) {
        const index = Math.max(this.points.length - 1, 0);
        if (!this.state[index]) {
            this.state[index] = {
                lineStyle: undefined,
                fillStyle: undefined,
                closePath: false,
            };
        }
        if (style) {
            if (style instanceof LineStyle) {
                this.state[index].lineStyle = style;
            }
            else {
                this.state[index].fillStyle = style;
            }
        }
        this.state[index].closePath = closePath;
        this.lastStateIndex = index;
    }
    pushClosePath() {
        this.pushState(undefined, true);
    }
    updateStyle(ctx, index, worldAlpha) {
        const style = this.state[index];
        if (!style) {
            return;
        }
        if (style.lineStyle) {
            this.stroke(ctx, worldAlpha);
            this.lineStyle.set(style.lineStyle);
        }
        if (style.fillStyle) {
            this.fill(ctx, worldAlpha);
            this.fillStyle.set(style.fillStyle);
        }
        this.closePath = style.closePath ?? false;
    }
    stroke(ctx, worldAlpha) {
        if (this.lineStyle.visible && this.points.length > 0) {
            ctx.lineWidth = this.lineStyle.width;
            ctx.lineCap = this.lineStyle.cap;
            ctx.lineJoin = this.lineStyle.join;
            ctx.strokeStyle = this.lineStyle.color;
            ctx.globalAlpha = this.lineStyle.alpha * worldAlpha;
            ctx.shadowOffsetX = this.lineStyle.shadowOffsetX;
            ctx.shadowOffsetY = this.lineStyle.shadowOffsetY;
            ctx.shadowBlur = this.lineStyle.shadowBlur;
            ctx.shadowColor = this.lineStyle.shadowColor;
            ctx.setLineDash(this.lineStyle.lineDash);
            if (this.closePath) {
                this.path2D.linePath.closePath();
            }
            ctx.stroke(this.path2D.linePath);
        }
        this.path2D.linePath = new Path2D();
    }
    fill(ctx, worldAlpha) {
        if (this.fillStyle.visible && this.points.length > 0) {
            ctx.fillStyle = this.fillStyle.color;
            ctx.globalAlpha = this.fillStyle.alpha * worldAlpha;
            ctx.shadowOffsetX = this.fillStyle.shadowOffsetX;
            ctx.shadowOffsetY = this.fillStyle.shadowOffsetY;
            ctx.shadowBlur = this.fillStyle.shadowBlur;
            ctx.shadowColor = this.fillStyle.shadowColor;
            ctx.fill(this.path2D.fillPath);
        }
        this.path2D.fillPath = new Path2D();
    }
    moveTo(x, y) {
        this.fillStyle.visible && this.path2D.fillPath.moveTo(x, y);
        this.lineStyle.visible && this.path2D.linePath.moveTo(x, y);
    }
    lineTo(x, y) {
        this.fillStyle.visible && this.path2D.fillPath.lineTo(x, y);
        this.lineStyle.visible && this.path2D.linePath.lineTo(x, y);
    }
    render(renderer, data, worldAlpha) {
        const ctx = renderer.ctx;
        this.updateStyle(ctx, 0, worldAlpha);
        this.updateStyle(ctx, 1, worldAlpha);
        this.moveTo(this.points[0], this.points[1]);
        for (let i = 2; i < this.points.length; i += 2) {
            const x = this.points[i];
            const y = this.points[i + 1];
            if (this.closePath) {
                this.path2D.linePath.closePath();
                this.closePath = false;
            }
            if (Number.isNaN(x) || Number.isNaN(y)) {
                this.moveTo(this.points[i + 2], this.points[i + 3]);
            }
            else {
                this.lineTo(x, y);
            }
            this.updateStyle(ctx, i, worldAlpha);
            this.updateStyle(ctx, i + 1, worldAlpha);
        }
        if (this.lastStateIndex >= 0) {
            this.stroke(ctx, worldAlpha);
            this.fill(ctx, worldAlpha);
        }
        this.lineStyle.reset();
        this.fillStyle.reset();
    }
    pushPoint(x, y) {
        this.points.push(x, y);
    }
}

class App {
    renderer;
    options;
    stage = new Group();
    eventSystem;
    constructor(options) {
        this.options = {
            canvas: options.canvas,
            backgroundColor: options.backgroundColor ?? "#fff",
            backgroundAlpha: options.backgroundAlpha ?? 1,
        };
        this.renderer = new CanvasRenderer(this.options);
        this.eventSystem = new EventSystem(this.options.canvas, this.stage);
        this.init();
    }
    init() {
        this.stage.setHitArea(new Rectangle(0, 0, this.renderer.width, this.renderer.height));
        this.render();
    }
    render = () => {
        this.renderer.render(this.stage);
        requestAnimationFrame(this.render);
    };
    clear() {
        this.stage.removeChildren();
    }
    resize(width, height) {
        this.renderer.resize(width, height);
    }
    get ctx() {
        return this.renderer.ctx;
    }
    get canvas() {
        return this.options.canvas;
    }
}

class GraphicsData {
    shape;
    lineStyle;
    fillStyle;
    constructor(shape, fillStyle, lineStyle) {
        this.shape = shape;
        this.lineStyle = lineStyle;
        this.fillStyle = fillStyle;
    }
}

class Graphics extends Group {
    graphicsDataList = [];
    fillStyle = new FillStyle();
    lineStyle = new LineStyle();
    currentPath = new Path();
    constructor() {
        super();
        this.drawShape(this.currentPath);
    }
    setCtxStyle = (ctx, data, isFill) => {
        if (data.fillStyle.visible && isFill) {
            ctx.fillStyle = data.fillStyle.color;
            ctx.globalAlpha = data.fillStyle.alpha * this.worldAlpha;
            ctx.shadowOffsetX = data.fillStyle.shadowOffsetX;
            ctx.shadowOffsetY = data.fillStyle.shadowOffsetY;
            ctx.shadowBlur = data.fillStyle.shadowBlur;
            ctx.shadowColor = data.fillStyle.shadowColor;
        }
        if (data.lineStyle.visible && !isFill) {
            ctx.lineWidth = data.lineStyle.width;
            ctx.lineCap = data.lineStyle.cap;
            ctx.lineJoin = data.lineStyle.join;
            ctx.strokeStyle = data.lineStyle.color;
            ctx.globalAlpha = data.lineStyle.alpha * this.worldAlpha;
            ctx.shadowOffsetX = data.lineStyle.shadowOffsetX;
            ctx.shadowOffsetY = data.lineStyle.shadowOffsetY;
            ctx.shadowBlur = data.lineStyle.shadowBlur;
            ctx.shadowColor = data.lineStyle.shadowColor;
            ctx.setLineDash(data.lineStyle.lineDash);
        }
    };
    renderSelf(renderer) {
        const ctx = renderer.ctx;
        ctx.save();
        this.applyTransform(renderer);
        for (let i = 0; i < this.graphicsDataList.length; i++) {
            const data = this.graphicsDataList[i];
            ctx.save();
            ctx.beginPath();
            data.shape.render(renderer, data, this.worldAlpha, this.setCtxStyle);
            ctx.restore();
        }
        ctx.restore();
        return this;
    }
    beginFill(style = {}) {
        this.fillStyle.set(style);
        this.fillStyle.visible = style.visible ?? true;
        this.currentPath.pushState(this.fillStyle.clone());
        return this;
    }
    beginLine(style = {}) {
        this.lineStyle.set(style);
        this.lineStyle.visible = style.visible ?? true;
        this.currentPath.pushState(this.lineStyle.clone());
        return this;
    }
    drawShape(shape) {
        const data = new GraphicsData(shape, this.fillStyle.clone(), this.lineStyle.clone());
        this.graphicsDataList.push(data);
    }
    contains(p) {
        p = this.transform.worldMatrix.applyInverse(p);
        if (this.hitArea) {
            return this.hitArea.contains(p);
        }
        for (let i = 0; i < this.graphicsDataList.length; i++) {
            const data = this.graphicsDataList[i];
            if (data.fillStyle.visible && data.shape.contains(p)) {
                return true;
            }
        }
        return false;
    }
    drawRect(x, y, width, height) {
        this.drawShape(new Rectangle(x, y, width, height));
        return this;
    }
    drawCircle(x, y, radius) {
        this.drawShape(new Circle(x, y, radius));
        return this;
    }
    drawEllipse(x, y, radiusX, radiusY) {
        this.drawShape(new Ellipse(x, y, radiusX, radiusY));
        return this;
    }
    drawRoundRect(x, y, width, height, radius) {
        this.drawShape(new RoundRect(x, y, width, height, radius));
        return this;
    }
    drawPolygon(points) {
        this.drawShape(new Polygon(points, true));
        return this;
    }
    moveTo(x, y) {
        const points = this.currentPath.points;
        const len = points.length;
        if (len > 1) {
            const lastX = points[len - 2];
            const lastY = points[len - 1];
            if (lastX === x && lastY === y) {
                return this;
            }
            if (!Number.isNaN(lastX) && !Number.isNaN(lastY)) {
                this.currentPath.pushPoint(NaN, NaN);
            }
        }
        this.currentPath.pushPoint(x, y);
        return this;
    }
    lineTo(x, y) {
        this.currentPath.pushPoint(x, y);
        return this;
    }
    closePath() {
        this.currentPath.pushClosePath();
        return this;
    }
    beginPath() {
        this.currentPath = new Path();
        this.drawShape(this.currentPath);
        return this;
    }
    endFill() {
        this.beginFill({ visible: false });
        return this;
    }
    endLine() {
        this.beginLine({ visible: false });
        return this;
    }
}

const shapes = {
    Circle,
    Ellipse,
    Polygon,
    Rectangle,
    RoundRect,
};

export { App, Graphics, shapes };
