

// PACK: spine-webgl/dist/AssetManager.d.ts
declare namespace spine {	
	class AssetManager extends AssetManagerBase {
	    constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, pathPrefix?: string, downloader?: Downloader);
	}
}

// PACK: spine-webgl/dist/Camera.d.ts
declare namespace spine {	
	class OrthoCamera {
	    position: Vector3;
	    direction: Vector3;
	    up: Vector3;
	    near: number;
	    far: number;
	    zoom: number;
	    viewportWidth: number;
	    viewportHeight: number;
	    projectionView: Matrix4;
	    inverseProjectionView: Matrix4;
	    projection: Matrix4;
	    view: Matrix4;
	    constructor(viewportWidth: number, viewportHeight: number);
	    update(): void;
	    screenToWorld(screenCoords: Vector3, screenWidth: number, screenHeight: number): Vector3;
	    worldToScreen(worldCoords: Vector3, screenWidth: number, screenHeight: number): Vector3;
	    setViewport(viewportWidth: number, viewportHeight: number): void;
	}
}

// PACK: spine-webgl/dist/CameraController.d.ts
declare namespace spine {	
	class CameraController {
	    canvas: HTMLElement;
	    camera: OrthoCamera;
	    constructor(canvas: HTMLElement, camera: OrthoCamera);
	}
}

// PACK: spine-webgl/dist/GLTexture.d.ts
declare namespace spine {	
	class GLTexture extends Texture implements Disposable, Restorable {
	    context: ManagedWebGLRenderingContext;
	    private texture;
	    private boundUnit;
	    private useMipMaps;
	    static DISABLE_UNPACK_PREMULTIPLIED_ALPHA_WEBGL: boolean;
	    constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, image: HTMLImageElement | ImageBitmap, useMipMaps?: boolean);
	    setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void;
	    static validateMagFilter(magFilter: TextureFilter): TextureFilter.Nearest | TextureFilter.Linear;
	    static usesMipMaps(filter: TextureFilter): boolean;
	    setWraps(uWrap: TextureWrap, vWrap: TextureWrap): void;
	    update(useMipMaps: boolean): void;
	    restore(): void;
	    bind(unit?: number): void;
	    unbind(): void;
	    dispose(): void;
	}
}

// PACK: spine-webgl/dist/Input.d.ts
declare namespace spine {	
	class Input {
	    element: HTMLElement;
	    mouseX: number;
	    mouseY: number;
	    buttonDown: boolean;
	    touch0: Touch | null;
	    touch1: Touch | null;
	    initialPinchDistance: number;
	    private listeners;
	    private eventListeners;
	    constructor(element: HTMLElement);
	    private setupCallbacks;
	    addListener(listener: InputListener): void;
	    removeListener(listener: InputListener): void;
	}
	class Touch {
	    identifier: number;
	    x: number;
	    y: number;
	    constructor(identifier: number, x: number, y: number);
	}
	interface InputListener {
	    down?(x: number, y: number): void;
	    up?(x: number, y: number): void;
	    moved?(x: number, y: number): void;
	    dragged?(x: number, y: number): void;
	    wheel?(delta: number): void;
	    zoom?(initialDistance: number, distance: number): void;
	}
}

// PACK: spine-webgl/dist/LoadingScreen.d.ts
declare namespace spine {	
	class LoadingScreen implements Disposable {
	    private renderer;
	    private logo;
	    private spinner;
	    private angle;
	    private fadeOut;
	    private fadeIn;
	    private timeKeeper;
	    backgroundColor: Color;
	    private tempColor;
	    constructor(renderer: SceneRenderer);
	    dispose(): void;
	    draw(complete?: boolean): void;
	}
}

// PACK: spine-webgl/dist/Matrix4.d.ts
declare namespace spine {	
	const M00 = 0;
	const M01 = 4;
	const M02 = 8;
	const M03 = 12;
	const M10 = 1;
	const M11 = 5;
	const M12 = 9;
	const M13 = 13;
	const M20 = 2;
	const M21 = 6;
	const M22 = 10;
	const M23 = 14;
	const M30 = 3;
	const M31 = 7;
	const M32 = 11;
	const M33 = 15;
	class Matrix4 {
	    temp: Float32Array;
	    values: Float32Array;
	    private static xAxis;
	    private static yAxis;
	    private static zAxis;
	    private static tmpMatrix;
	    constructor();
	    set(values: ArrayLike<number>): Matrix4;
	    transpose(): Matrix4;
	    identity(): Matrix4;
	    invert(): Matrix4;
	    determinant(): number;
	    translate(x: number, y: number, z: number): Matrix4;
	    copy(): Matrix4;
	    projection(near: number, far: number, fovy: number, aspectRatio: number): Matrix4;
	    ortho2d(x: number, y: number, width: number, height: number): Matrix4;
	    ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
	    multiply(matrix: Matrix4): Matrix4;
	    multiplyLeft(matrix: Matrix4): Matrix4;
	    lookAt(position: Vector3, direction: Vector3, up: Vector3): this;
	}
}

// PACK: spine-webgl/dist/Mesh.d.ts
declare namespace spine {	
	class Mesh implements Disposable, Restorable {
	    private attributes;
	    private context;
	    private vertices;
	    private verticesBuffer;
	    private verticesLength;
	    private dirtyVertices;
	    private indices;
	    private indicesBuffer;
	    private indicesLength;
	    private dirtyIndices;
	    private elementsPerVertex;
	    getAttributes(): VertexAttribute[];
	    maxVertices(): number;
	    numVertices(): number;
	    setVerticesLength(length: number): void;
	    getVertices(): Float32Array;
	    maxIndices(): number;
	    numIndices(): number;
	    setIndicesLength(length: number): void;
	    getIndices(): Uint16Array;
	    getVertexSizeInFloats(): number;
	    constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, attributes: VertexAttribute[], maxVertices: number, maxIndices: number);
	    setVertices(vertices: Array<number>): void;
	    setIndices(indices: Array<number>): void;
	    draw(shader: Shader, primitiveType: number): void;
	    drawWithOffset(shader: Shader, primitiveType: number, offset: number, count: number): void;
	    bind(shader: Shader): void;
	    unbind(shader: Shader): void;
	    private update;
	    restore(): void;
	    dispose(): void;
	}
	class VertexAttribute {
	    name: string;
	    type: VertexAttributeType;
	    numElements: number;
	    constructor(name: string, type: VertexAttributeType, numElements: number);
	}
	class Position2Attribute extends VertexAttribute {
	    constructor();
	}
	class Position3Attribute extends VertexAttribute {
	    constructor();
	}
	class TexCoordAttribute extends VertexAttribute {
	    constructor(unit?: number);
	}
	class ColorAttribute extends VertexAttribute {
	    constructor();
	}
	class Color2Attribute extends VertexAttribute {
	    constructor();
	}
	enum VertexAttributeType {
	    Float = 0
	}
}

// PACK: spine-webgl/dist/PolygonBatcher.d.ts
declare namespace spine {	
	class PolygonBatcher implements Disposable {
	    static disableCulling: boolean;
	    private context;
	    private drawCalls;
	    private static globalDrawCalls;
	    private isDrawing;
	    private mesh;
	    private shader;
	    private lastTexture;
	    private verticesLength;
	    private indicesLength;
	    private srcColorBlend;
	    private srcAlphaBlend;
	    private dstBlend;
	    private cullWasEnabled;
	    constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, twoColorTint?: boolean, maxVertices?: number);
	    begin(shader: Shader): void;
	    setBlendMode(srcColorBlend: number, srcAlphaBlend: number, dstBlend: number): void;
	    draw(texture: GLTexture, vertices: ArrayLike<number>, indices: Array<number>): void;
	    flush(): void;
	    end(): void;
	    getDrawCalls(): number;
	    static getAndResetGlobalDrawCalls(): number;
	    dispose(): void;
	}
}

// PACK: spine-webgl/dist/SceneRenderer.d.ts
declare namespace spine {	
	class SceneRenderer implements Disposable {
	    context: ManagedWebGLRenderingContext;
	    canvas: HTMLCanvasElement;
	    camera: OrthoCamera;
	    batcher: PolygonBatcher;
	    private twoColorTint;
	    private batcherShader;
	    private shapes;
	    private shapesShader;
	    private activeRenderer;
	    skeletonRenderer: SkeletonRenderer;
	    skeletonDebugRenderer: SkeletonDebugRenderer;
	    constructor(canvas: HTMLCanvasElement, context: ManagedWebGLRenderingContext | WebGLRenderingContext, twoColorTint?: boolean);
	    dispose(): void;
	    begin(): void;
	    drawSkeleton(skeleton: Skeleton, premultipliedAlpha?: boolean, slotRangeStart?: number, slotRangeEnd?: number, transform?: VertexTransformer | null): void;
	    drawSkeletonDebug(skeleton: Skeleton, premultipliedAlpha?: boolean, ignoredBones?: Array<string>): void;
	    drawTexture(texture: GLTexture, x: number, y: number, width: number, height: number, color?: Color): void;
	    drawTextureUV(texture: GLTexture, x: number, y: number, width: number, height: number, u: number, v: number, u2: number, v2: number, color?: Color): void;
	    drawTextureRotated(texture: GLTexture, x: number, y: number, width: number, height: number, pivotX: number, pivotY: number, angle: number, color?: Color): void;
	    drawRegion(region: TextureAtlasRegion, x: number, y: number, width: number, height: number, color?: Color): void;
	    line(x: number, y: number, x2: number, y2: number, color?: Color, color2?: Color): void;
	    triangle(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, color?: Color, color2?: Color, color3?: Color): void;
	    quad(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, color?: Color, color2?: Color, color3?: Color, color4?: Color): void;
	    rect(filled: boolean, x: number, y: number, width: number, height: number, color?: Color): void;
	    rectLine(filled: boolean, x1: number, y1: number, x2: number, y2: number, width: number, color?: Color): void;
	    polygon(polygonVertices: ArrayLike<number>, offset: number, count: number, color?: Color): void;
	    circle(filled: boolean, x: number, y: number, radius: number, color?: Color, segments?: number): void;
	    curve(x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, segments: number, color?: Color): void;
	    end(): void;
	    resize(resizeMode: ResizeMode): void;
	    private enableRenderer;
	}
	enum ResizeMode {
	    Stretch = 0,
	    Expand = 1,
	    Fit = 2
	}
}

// PACK: spine-webgl/dist/Shader.d.ts
declare namespace spine {	
	class Shader implements Disposable, Restorable {
	    private vertexShader;
	    private fragmentShader;
	    static MVP_MATRIX: string;
	    static POSITION: string;
	    static COLOR: string;
	    static COLOR2: string;
	    static TEXCOORDS: string;
	    static SAMPLER: string;
	    private context;
	    private vs;
	    private vsSource;
	    private fs;
	    private fsSource;
	    private program;
	    private tmp2x2;
	    private tmp3x3;
	    private tmp4x4;
	    getProgram(): WebGLProgram | null;
	    getVertexShader(): string;
	    getFragmentShader(): string;
	    getVertexShaderSource(): string;
	    getFragmentSource(): string;
	    constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, vertexShader: string, fragmentShader: string);
	    private compile;
	    private compileShader;
	    private compileProgram;
	    restore(): void;
	    bind(): void;
	    unbind(): void;
	    setUniformi(uniform: string, value: number): void;
	    setUniformf(uniform: string, value: number): void;
	    setUniform2f(uniform: string, value: number, value2: number): void;
	    setUniform3f(uniform: string, value: number, value2: number, value3: number): void;
	    setUniform4f(uniform: string, value: number, value2: number, value3: number, value4: number): void;
	    setUniform2x2f(uniform: string, value: ArrayLike<number>): void;
	    setUniform3x3f(uniform: string, value: ArrayLike<number>): void;
	    setUniform4x4f(uniform: string, value: ArrayLike<number>): void;
	    getUniformLocation(uniform: string): WebGLUniformLocation | null;
	    getAttributeLocation(attribute: string): number;
	    dispose(): void;
	    static newColoredTextured(context: ManagedWebGLRenderingContext | WebGLRenderingContext): Shader;
	    static newTwoColoredTextured(context: ManagedWebGLRenderingContext | WebGLRenderingContext): Shader;
	    static newColored(context: ManagedWebGLRenderingContext | WebGLRenderingContext): Shader;
	}
}

// PACK: spine-webgl/dist/ShapeRenderer.d.ts
declare namespace spine {	
	class ShapeRenderer implements Disposable {
	    private context;
	    private isDrawing;
	    private mesh;
	    private shapeType;
	    private color;
	    private shader;
	    private vertexIndex;
	    private tmp;
	    private srcColorBlend;
	    private srcAlphaBlend;
	    private dstBlend;
	    constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, maxVertices?: number);
	    begin(shader: Shader): void;
	    setBlendMode(srcColorBlend: number, srcAlphaBlend: number, dstBlend: number): void;
	    setColor(color: Color): void;
	    setColorWith(r: number, g: number, b: number, a: number): void;
	    point(x: number, y: number, color?: Color): void;
	    line(x: number, y: number, x2: number, y2: number, color?: Color): void;
	    triangle(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, color?: Color, color2?: Color, color3?: Color): void;
	    quad(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, color?: Color, color2?: Color, color3?: Color, color4?: Color): void;
	    rect(filled: boolean, x: number, y: number, width: number, height: number, color?: Color): void;
	    rectLine(filled: boolean, x1: number, y1: number, x2: number, y2: number, width: number, color?: Color): void;
	    x(x: number, y: number, size: number): void;
	    polygon(polygonVertices: ArrayLike<number>, offset: number, count: number, color?: Color): void;
	    circle(filled: boolean, x: number, y: number, radius: number, color?: Color, segments?: number): void;
	    curve(x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, segments: number, color?: Color): void;
	    private vertex;
	    end(): void;
	    private flush;
	    private check;
	    dispose(): void;
	}
	enum ShapeType {
	    Point = 0,
	    Line = 1,
	    Filled = 4
	}
}

// PACK: spine-webgl/dist/SkeletonDebugRenderer.d.ts
declare namespace spine {	
	class SkeletonDebugRenderer implements Disposable {
	    boneLineColor: Color;
	    boneOriginColor: Color;
	    attachmentLineColor: Color;
	    triangleLineColor: Color;
	    pathColor: Color;
	    clipColor: Color;
	    aabbColor: Color;
	    drawBones: boolean;
	    drawRegionAttachments: boolean;
	    drawBoundingBoxes: boolean;
	    drawMeshHull: boolean;
	    drawMeshTriangles: boolean;
	    drawPaths: boolean;
	    drawSkeletonXY: boolean;
	    drawClipping: boolean;
	    premultipliedAlpha: boolean;
	    scale: number;
	    boneWidth: number;
	    private context;
	    private bounds;
	    private temp;
	    private vertices;
	    private static LIGHT_GRAY;
	    private static GREEN;
	    constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext);
	    draw(shapes: ShapeRenderer, skeleton: Skeleton, ignoredBones?: Array<string>): void;
	    dispose(): void;
	}
}

// PACK: spine-webgl/dist/SkeletonRenderer.d.ts
declare namespace spine {	
	type VertexTransformer = (vertices: NumberArrayLike, numVertices: number, stride: number) => void;
	class SkeletonRenderer {
	    static QUAD_TRIANGLES: number[];
	    premultipliedAlpha: boolean;
	    private tempColor;
	    private tempColor2;
	    private vertices;
	    private vertexSize;
	    private twoColorTint;
	    private renderable;
	    private clipper;
	    private temp;
	    private temp2;
	    private temp3;
	    private temp4;
	    constructor(context: ManagedWebGLRenderingContext, twoColorTint?: boolean);
	    draw(batcher: PolygonBatcher, skeleton: Skeleton, slotRangeStart?: number, slotRangeEnd?: number, transformer?: VertexTransformer | null): void;
	}
}

// PACK: spine-webgl/dist/SpineCanvas.d.ts
declare namespace spine {	
	/** An app running inside a {@link SpineCanvas}. The app life-cycle
	 * is as follows:
	 *
	 * 1. `loadAssets()` is called. The app can queue assets for loading via {@link SpineCanvas#assetManager}.
	 * 2. `initialize()` is called when all assets are loaded. The app can setup anything it needs to enter the main application logic.
	 * 3. `update()` is called periodically at screen refresh rate. The app can update its state.
	 * 4. `render()` is called periodically at screen refresh rate. The app can render its state via {@link SpineCanvas#renderer} or directly via the WebGL context in {@link SpineCanvas.gl}`
	 *
	 * The `error()` method is called in case the assets could not be loaded.
	 */
	interface SpineCanvasApp {
	    loadAssets?(canvas: SpineCanvas): void;
	    initialize?(canvas: SpineCanvas): void;
	    update?(canvas: SpineCanvas, delta: number): void;
	    render?(canvas: SpineCanvas): void;
	    error?(canvas: SpineCanvas, errors: StringMap<string>): void;
	}
	/** Configuration passed to the {@link SpineCanvas} constructor */
	interface SpineCanvasConfig {
	    app: SpineCanvasApp;
	    pathPrefix?: string;
	    webglConfig?: any;
	}
	/** Manages the life-cycle and WebGL context of a {@link SpineCanvasApp}. The app loads
	 * assets and initializes itself, then updates and renders its state at the screen refresh rate. */
	class SpineCanvas {
	    readonly context: ManagedWebGLRenderingContext;
	    /** Tracks the current time, delta, and other time related statistics. */
	    readonly time: TimeKeeper;
	    /** The HTML canvas to render to. */
	    readonly htmlCanvas: HTMLCanvasElement;
	    /** The WebGL rendering context. */
	    readonly gl: WebGLRenderingContext;
	    /** The scene renderer for easy drawing of skeletons, shapes, and images. */
	    readonly renderer: SceneRenderer;
	    /** The asset manager to load assets with. */
	    readonly assetManager: AssetManager;
	    /** The input processor used to listen to mouse, touch, and keyboard events. */
	    readonly input: Input;
	    /** Constructs a new spine canvas, rendering to the provided HTML canvas. */
	    constructor(canvas: HTMLCanvasElement, config: SpineCanvasConfig);
	    /** Clears the canvas with the given color. The color values are given in the range [0,1]. */
	    clear(r: number, g: number, b: number, a: number): void;
	}
}

// PACK: spine-webgl/dist/Vector3.d.ts
declare namespace spine {	
	class Vector3 {
	    x: number;
	    y: number;
	    z: number;
	    constructor(x?: number, y?: number, z?: number);
	    setFrom(v: Vector3): Vector3;
	    set(x: number, y: number, z: number): Vector3;
	    add(v: Vector3): Vector3;
	    sub(v: Vector3): Vector3;
	    scale(s: number): Vector3;
	    normalize(): Vector3;
	    cross(v: Vector3): Vector3;
	    multiply(matrix: Matrix4): Vector3;
	    project(matrix: Matrix4): Vector3;
	    dot(v: Vector3): number;
	    length(): number;
	    distance(v: Vector3): number;
	}
}

// PACK: spine-webgl/dist/WebGL.d.ts
declare namespace spine {	
	class ManagedWebGLRenderingContext {
	    canvas: HTMLCanvasElement | OffscreenCanvas;
	    gl: WebGLRenderingContext;
	    private restorables;
	    constructor(canvasOrContext: HTMLCanvasElement | WebGLRenderingContext, contextConfig?: any);
	    addRestorable(restorable: Restorable): void;
	    removeRestorable(restorable: Restorable): void;
	}
	class WebGLBlendModeConverter {
	    static getDestGLBlendMode(blendMode: BlendMode): 1 | 771;
	    static getSourceColorGLBlendMode(blendMode: BlendMode, premultipliedAlpha?: boolean): 1 | 770 | 774;
	    static getSourceAlphaGLBlendMode(blendMode: BlendMode): 1 | 769 | 771;
	}
}