declare enum ShapeType {
    Rectangle = "rectangle",
    Polygon = "polygon",
    Circle = "circle",
    Ellipse = "ellipse",
    RoundRect = "roundRect",
    Path = "path"
}
declare enum LINE_CAP {
    BUTT = "butt",
    ROUND = "round",
    SQUARE = "square"
}
declare enum LINE_JOIN {
    MITER = "miter",
    BEVEL = "bevel",
    ROUND = "round"
}
declare enum EventPhase {
    NONE = "none",
    CAPTURING = "capturing",
    AT_TARGET = "atTarget",
    BUBBLING = "bubbling"
}
declare enum LifecycleKey {
    BeforeMount = "beforeMount",
    Mounted = "mounted",
    BeforeRender = "beforeRender",
    Rendering = "rendering",
    Rendered = "rendered",
    BeforeUnmount = "beforeUnmount",
    Unmounted = "unmounted"
}

interface IAppOptions {
    canvas: HTMLCanvasElement;
    width?: number;
    height?: number;
    backgroundColor?: string;
    backgroundAlpha?: number;
}
interface IContext {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext;
}

type Cursor = "auto" | "default" | "none" | "context-menu" | "help" | "pointer" | "progress" | "wait" | "cell" | "crosshair" | "text" | "vertical-text" | "alias" | "copy" | "move" | "no-drop" | "not-allowed" | "e-resize" | "n-resize" | "ne-resize" | "nw-resize" | "s-resize" | "se-resize" | "sw-resize" | "w-resize" | "ns-resize" | "ew-resize" | "nesw-resize" | "col-resize" | "nwse-resize" | "row-resize" | "all-scroll" | "zoom-in" | "zoom-out" | "grab" | "grabbing";

declare class Point {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x?: number, y?: number): void;
    clone(): Point;
}
declare class ObservablePoint {
    private _x;
    private _y;
    private cb;
    constructor(cb: (...anyArgs: any[]) => any, x?: number, y?: number);
    set(x?: number, y?: number): void;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
}

declare class Matrix {
    a: number;
    b: number;
    c: number;
    d: number;
    tx: number;
    ty: number;
    constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
    set(a: number, b: number, c: number, d: number, tx: number, ty: number): this;
    append(m: Matrix): this;
    prepend(m: Matrix): this;
    apply(p: Point): Point;
    applyInverse(p: Point): Point;
    clone(): Matrix;
    getID(): string;
}

declare class Transform {
    private readonly localMatrix;
    readonly worldMatrix: Matrix;
    readonly position: ObservablePoint;
    readonly pivot: ObservablePoint;
    readonly scale: ObservablePoint;
    readonly skew: ObservablePoint;
    private _rotate;
    private rotateMatrix;
    private skewMatrix;
    private scaleMatrix;
    private shouldUpdateLocalMatrix;
    private parentID;
    constructor();
    get wordID(): string;
    get rotate(): number;
    set rotate(r: number);
    private onChange;
    private onScaleChange;
    private onSkewChange;
    private updateLocalMatrix;
    private updateWorldMatrix;
    updateTransform(parentTransform: Transform): void;
}

declare abstract class Renderer<T extends IContext["ctx"]> {
    protected canvas: IContext["canvas"];
    private options;
    abstract ctx: T;
    private originalState;
    constructor(options: Required<IAppOptions>);
    resize(width: number, height: number): void;
    get width(): number;
    get height(): number;
    get backgroundColor(): string;
    get backgroundAlpha(): number;
    protected abstract dprInit(): void;
    abstract render(stage: Group): void;
}

declare class CanvasRenderer extends Renderer<CanvasRenderingContext2D> {
    ctx: CanvasRenderingContext2D;
    constructor(options: Required<IAppOptions>);
    render(stage: Group): void;
    private renderBackground;
    protected dprInit: () => void;
}

declare const defaultStyle$1: {
    color: string | CanvasGradient | CanvasPattern;
    alpha: number;
    visible: boolean;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowBlur: number;
    shadowColor: string;
};
type FillStyleType = typeof defaultStyle$1;
declare class FillStyle {
    color: string | CanvasGradient | CanvasPattern;
    alpha: number;
    visible: boolean;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowBlur: number;
    shadowColor: string;
    constructor(style?: Partial<FillStyleType>);
    set(style?: Partial<FillStyleType>): void;
    clone(): FillStyle;
    reset(): void;
    isSameOf(style: FillStyleType): boolean;
}

declare const defaultStyle: {
    width: number;
    cap: LINE_CAP;
    join: LINE_JOIN;
    miterLimit: number;
    lineDash: number[];
};
type LineStyleType = typeof defaultStyle & FillStyleType;
declare class LineStyle extends FillStyle {
    width: number;
    cap: LINE_CAP;
    join: LINE_JOIN;
    miterLimit: number;
    lineDash: number[];
    constructor(style?: Partial<LineStyleType>);
    set(style?: Partial<LineStyleType>): void;
    clone(): LineStyle;
    reset(): void;
    isSameOf(style: LineStyleType): boolean;
}

declare class GraphicsData {
    shape: Shape;
    lineStyle: LineStyle;
    fillStyle: FillStyle;
    constructor(shape: Shape, fillStyle: FillStyle, lineStyle: LineStyle);
}

declare class Graphics extends Group {
    readonly graphicsDataList: GraphicsData[];
    private readonly fillStyle;
    private readonly lineStyle;
    private currentPath;
    constructor();
    private setCtxStyle;
    protected renderSelf(renderer: CanvasRenderer): this;
    beginFill(style?: Partial<FillStyleType>): this;
    beginLine(style?: Partial<LineStyleType>): this;
    private drawShape;
    contains(p: Point): boolean;
    drawRect(x: number, y: number, width: number, height: number): this;
    drawCircle(x: number, y: number, radius: number): this;
    drawEllipse(x: number, y: number, radiusX: number, radiusY: number): this;
    drawRoundRect(x: number, y: number, width: number, height: number, radius: number): this;
    drawPolygon(points: number[]): this;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    closePath(): this;
    beginPath(): this;
    endFill(): this;
    endLine(): this;
}

type SetCtxStyle = (ctx: CanvasRenderingContext2D, data: GraphicsData, isFill: boolean) => void;
declare abstract class Shape {
    abstract readonly type: ShapeType;
    abstract render(renderer: CanvasRenderer, data: GraphicsData, worldAlpha: number, setCtxStyle: SetCtxStyle): void;
    abstract contains(p: Point): boolean;
}

declare class Rectangle extends Shape {
    readonly type = ShapeType.Rectangle;
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    contains(p: Point): boolean;
    render(renderer: CanvasRenderer, data: GraphicsData, worldAlpha: number, setCtxStyle: SetCtxStyle): void;
}

declare class Circle extends Shape {
    readonly type = ShapeType.Circle;
    x: number;
    y: number;
    radius: number;
    constructor(x: number, y: number, radius: number);
    contains(p: Point): boolean;
    render(renderer: CanvasRenderer, data: GraphicsData, worldAlpha: number, setCtxStyle: SetCtxStyle): void;
}

declare class Ellipse extends Shape {
    readonly type = ShapeType.Ellipse;
    x: number;
    y: number;
    radiusX: number;
    radiusY: number;
    constructor(x: number, y: number, radiusX: number, radiusY: number);
    contains(p: Point): boolean;
    render(renderer: CanvasRenderer, data: GraphicsData, worldAlpha: number, setCtxStyle: SetCtxStyle): void;
}

declare class RoundRect extends Shape {
    readonly type = ShapeType.RoundRect;
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    constructor(x: number, y: number, width: number, height: number, radius: number);
    contains(p: Point): boolean;
    render(renderer: CanvasRenderer, data: GraphicsData, worldAlpha: number, setCtxStyle: SetCtxStyle): void;
}

declare class Polygon extends Shape {
    readonly type = ShapeType.Polygon;
    private points;
    private closePath;
    constructor(points: number[], closePath?: boolean);
    contains(p: Point): boolean;
    render(renderer: CanvasRenderer, data: GraphicsData, worldAlpha: number, setCtxStyle: SetCtxStyle): void;
    reset(): void;
    clone(): Polygon;
}

type EventListener$1 = (...args: any[]) => void;
declare class EventClient {
    private _events;
    on(event: string, listener: EventListener$1): void;
    once(event: string, listener: EventListener$1): void;
    emit(event: string, ...args: any[]): void;
    off(event: string, listener: EventListener$1): void;
    offAll(event: string): void;
    offAllEvents(): void;
}

declare abstract class Node extends EventClient {
    visible: boolean;
    protected alpha: number;
    protected worldAlpha: number;
    private _zIndex;
    readonly transform: Transform;
    cursor: Cursor;
    hitArea: Shape | null;
    protected sorted: boolean;
    parent: this | null;
    readonly children: this[];
    id: string;
    class: string[];
    get zIndex(): number;
    set zIndex(value: number);
    setZIndex(index: number): this;
    setAlpha(alpha: number): this;
    setVisible(visible: boolean): this;
    setCursor(cursor: Cursor): this;
    setHitArea(hitArea: Shape): this;
    setId(id: string): this;
    setClass(className: string): this;
    addClass(className: string): this;
    removeClass(className: string): this;
    setScale(x: number, y: number): this;
    setRotation(rotation: number): this;
    setPosition(x: number, y: number): this;
    setPivot(x: number, y: number): this;
    setSkew(x: number, y: number): this;
    protected sort(): void;
    contains(p: Point): boolean;
    updateTransform(): void;
    addEventListener(type: EventType, listener: EventListener, options?: boolean | EventOptions): this;
    removeEventListener(type: EventType, listener: EventListener, capture?: boolean): this;
    private analyzeEventOptions;
    findById(id: string): this | null;
    findByClass(className: string): this[];
}

declare class Group extends Node {
    private lifecycleHooks;
    private addLifecycleHook;
    onBeforeMount(handler: (item: this) => void): this;
    onMounted(handler: (item: this) => void): this;
    onBeforeRender(handler: (item: this, renderer: CanvasRenderer) => void): this;
    onRendering(handler: (item: this, renderer: CanvasRenderer) => void): this;
    onRendered(handler: (item: this, renderer: CanvasRenderer) => void): this;
    onBeforeUnmount(handler: (item: this) => void): this;
    onUnmounted(handler: (item: this) => void): this;
    protected callLifecycleHook(key: LifecycleKey, item: this, renderer?: CanvasRenderer): void;
    renderCanvas(renderer: CanvasRenderer): this | undefined;
    protected renderSelf(renderer: CanvasRenderer): this;
    protected renderChildren(renderer: CanvasRenderer): this;
    private addOneChild;
    add(child: this | this[]): this;
    remove(child: this): this;
    removeChildren(): this;
    removeSelf(): this;
    destroy(): void;
    protected applyTransform(renderer: CanvasRenderer): void;
    getSpreadPath(): Group[];
}

declare class EventObject {
    isTrusted: boolean;
    timeStamp: number;
    type: EventType;
    button: number;
    buttons: number;
    global: Point;
    propagationStopped: boolean;
    eventPhase: EventPhase;
    target: Group;
    currentTarget: Group;
    stopPropagation(): void;
    convertPointerEvent(nativeEvent: PointerEvent): void;
    clone(): EventObject;
}

type EventMap = {
    click: EventObject;
    mousedown: EventObject;
    mouseup: EventObject;
    mouseenter: EventObject;
    mouseleave: EventObject;
    mousemove: EventObject;
    mouseout: EventObject;
    mouseover: EventObject;
};
type EventType = keyof EventMap;
type EventListener = (e: EventObject) => any;
type EventOptions = Pick<AddEventListenerOptions, "capture" | "once">;

declare class App<T extends IContext["ctx"] = CanvasRenderingContext2D> {
    private renderer;
    private options;
    readonly stage: Group;
    private eventSystem;
    constructor(options: IAppOptions);
    private init;
    private render;
    clear(): void;
    resize(width: number, height: number): void;
    get ctx(): T;
    get canvas(): HTMLCanvasElement;
}

declare const shapes: {
    Circle: typeof Circle;
    Ellipse: typeof Ellipse;
    Polygon: typeof Polygon;
    Rectangle: typeof Rectangle;
    RoundRect: typeof RoundRect;
};

export { App, Graphics, shapes };
