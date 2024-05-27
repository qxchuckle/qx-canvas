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

interface IAppOptions {
    canvas: HTMLCanvasElement;
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
    private localMatrix;
    worldMatrix: Matrix;
    position: ObservablePoint;
    pivot: ObservablePoint;
    scale: ObservablePoint;
    skew: ObservablePoint;
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
    constructor(options: Required<IAppOptions>);
    resize(width: number, height: number): void;
    get width(): number;
    get height(): number;
    get backgroundColor(): string;
    get backgroundAlpha(): number;
    abstract render(stage: Group): void;
}

declare class CanvasRenderer extends Renderer<CanvasRenderingContext2D> {
    ctx: CanvasRenderingContext2D;
    constructor(options: Required<IAppOptions>);
    render(stage: Group): void;
    private renderBackground;
}

type FillStyleType = {
    color: string | CanvasGradient | CanvasPattern;
    alpha: number;
    visible: boolean;
};
declare class FillStyle {
    color: FillStyleType["color"];
    alpha: FillStyleType["alpha"];
    visible: FillStyleType["visible"];
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
};
type LineStyleType = typeof defaultStyle & FillStyleType;
declare class LineStyle extends FillStyle {
    width: number;
    cap: LINE_CAP;
    join: LINE_JOIN;
    miterLimit: number;
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
    protected renderSelf(renderer: CanvasRenderer): this;
    beginFill(style?: Partial<FillStyleType>): this;
    beginLine(style?: Partial<LineStyleType & FillStyleType>): this;
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

declare abstract class Shape {
    abstract readonly type: ShapeType;
    abstract render(renderer: CanvasRenderer, data: GraphicsData, worldAlpha: number): void;
    abstract contains(p: Point): boolean;
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
    transform: Transform;
    cursor: Cursor;
    hitArea: Shape | null;
    protected sorted: boolean;
    abstract parent: Node | null;
    abstract readonly children: Node[];
    get zIndex(): number;
    set zIndex(value: number);
    setZIndex(index: number): this;
    setAlpha(alpha: number): this;
    setVisible(visible: boolean): this;
    setCursor(cursor: Cursor): this;
    setHitArea(hitArea: Shape): this;
    setScale(x: number, y: number): this;
    setRotation(rotation: number): this;
    setPosition(x: number, y: number): this;
    setPivot(x: number, y: number): this;
    setSkew(x: number, y: number): this;
    protected sort(): void;
    contains(p: Point): boolean;
    updateTransform(): void;
    addEventListener(type: EventType, listener: EventListener, options?: boolean | EventOptions): void;
    removeEventListener(type: EventType, listener: EventListener, capture?: boolean): void;
    private analyzeEventOptions;
}

declare class Group extends Node {
    parent: Group | null;
    readonly children: Group[];
    renderCanvas(renderer: CanvasRenderer): this | undefined;
    protected renderSelf(renderer: CanvasRenderer): this;
    protected renderChildren(renderer: CanvasRenderer): this;
    add(child: Group): this;
    remove(child: Group): this;
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

export { App, Graphics };
