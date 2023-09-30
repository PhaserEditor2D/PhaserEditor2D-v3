

// PACK: spine-phaser/dist/SpineGameObject.d.ts
declare namespace spine {	
	class BaseSpineGameObject extends Phaser.GameObjects.GameObject {
	    constructor(scene: Phaser.Scene, type: string);
	}
	/** A bounds provider calculates the bounding box for a skeleton, which is then assigned as the size of the SpineGameObject. */
	interface SpineGameObjectBoundsProvider {
	    calculateBounds(gameObject: SpineGameObject): {
	        x: number;
	        y: number;
	        width: number;
	        height: number;
	    };
	}
	/** A bounds provider that calculates the bounding box from the setup pose. */
	class SetupPoseBoundsProvider implements SpineGameObjectBoundsProvider {
	    calculateBounds(gameObject: SpineGameObject): {
	        x: number;
	        y: number;
	        width: number;
	        height: number;
	    };
	}
	/** A bounds provider that calculates the bounding box by taking the maximumg bounding box for a combination of skins and specific animation. */
	class SkinsAndAnimationBoundsProvider implements SpineGameObjectBoundsProvider {
	    private animation;
	    private skins;
	    private timeStep;
	    /**
	     * @param animation The animation to use for calculating the bounds. If null, the setup pose is used.
	     * @param skins The skins to use for calculating the bounds. If empty, the default skin is used.
	     * @param timeStep The time step to use for calculating the bounds. A smaller time step means more precision, but slower calculation.
	     */
	    constructor(animation: string | null, skins?: string[], timeStep?: number);
	    calculateBounds(gameObject: SpineGameObject): {
	        x: number;
	        y: number;
	        width: number;
	        height: number;
	    };
	}
	const SpineGameObject_base: typeof BaseSpineGameObject & Type<Phaser.GameObjects.Components.Alpha, any[]> & Type<Phaser.GameObjects.Components.Visible, any[]> & Type<Phaser.GameObjects.Components.Transform, any[]> & Type<Phaser.GameObjects.Components.ScrollFactor, any[]> & Type<Phaser.GameObjects.Components.Flip, any[]> & Type<Phaser.GameObjects.Components.Origin, any[]> & Type<Phaser.GameObjects.Components.Depth, any[]>;
	/**
	 * A SpineGameObject is a Phaser {@link GameObject} that can be added to a Phaser Scene and render a Spine skeleton.
	 *
	 * The Spine GameObject is a thin wrapper around a Spine {@link Skeleton}, {@link AnimationState} and {@link AnimationStateData}. It is responsible for:
	 * - updating the animation state
	 * - applying the animation state to the skeleton's bones, slots, attachments, and draw order.
	 * - updating the skeleton's bone world transforms
	 * - rendering the skeleton
	 *
	 * See the {@link SpinePlugin} class for more information on how to create a `SpineGameObject`.
	 *
	 * The skeleton, animation state, and animation state data can be accessed via the repsective fields. They can be manually updated via {@link updatePose}.
	 *
	 * To modify the bone hierarchy before the world transforms are computed, a callback can be set via the {@link beforeUpdateWorldTransforms} field.
	 *
	 * To modify the bone hierarchy after the world transforms are computed, a callback can be set via the {@link afterUpdateWorldTransforms} field.
	 *
	 * The class also features methods to convert between the skeleton coordinate system and the Phaser coordinate system.
	 *
	 * See {@link skeletonToPhaserWorldCoordinates}, {@link phaserWorldCoordinatesToSkeleton}, and {@link phaserWorldCoordinatesToBoneLocal.}
	 */
	class SpineGameObject extends SpineGameObject_base {
	    private plugin;
	    boundsProvider: SpineGameObjectBoundsProvider;
	    blendMode: number;
	    skeleton: Skeleton;
	    animationStateData: AnimationStateData;
	    animationState: AnimationState;
	    beforeUpdateWorldTransforms: (object: SpineGameObject) => void;
	    afterUpdateWorldTransforms: (object: SpineGameObject) => void;
	    private premultipliedAlpha;
	    constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, dataKey: string, atlasKey: string, boundsProvider?: SpineGameObjectBoundsProvider);
	    updateSize(): void;
	    /** Converts a point from the skeleton coordinate system to the Phaser world coordinate system. */
	    skeletonToPhaserWorldCoordinates(point: {
	        x: number;
	        y: number;
	    }): void;
	    /** Converts a point from the Phaser world coordinate system to the skeleton coordinate system. */
	    phaserWorldCoordinatesToSkeleton(point: {
	        x: number;
	        y: number;
	    }): void;
	    /** Converts a point from the Phaser world coordinate system to the bone's local coordinate system. */
	    phaserWorldCoordinatesToBone(point: {
	        x: number;
	        y: number;
	    }, bone: Bone): void;
	    /**
	     * Updates the {@link AnimationState}, applies it to the {@link Skeleton}, then updates the world transforms of all bones.
	     * @param delta The time delta in milliseconds
	     */
	    updatePose(delta: number): void;
	    preUpdate(time: number, delta: number): void;
	    preDestroy(): void;
	    willRender(camera: Phaser.Cameras.Scene2D.Camera): boolean;
	    renderWebGL(renderer: Phaser.Renderer.WebGL.WebGLRenderer, src: SpineGameObject, camera: Phaser.Cameras.Scene2D.Camera, parentMatrix: Phaser.GameObjects.Components.TransformMatrix): void;
	    renderCanvas(renderer: Phaser.Renderer.Canvas.CanvasRenderer, src: SpineGameObject, camera: Phaser.Cameras.Scene2D.Camera, parentMatrix: Phaser.GameObjects.Components.TransformMatrix): void;
	}
}

// PACK: spine-phaser/dist/SpinePlugin.d.ts
declare namespace spine {	
	/**
	 * Configuration object used when creating {@link SpineGameObject} instances via a scene's
	 * {@link GameObjectCreator} (`Scene.make`).
	 */
	interface SpineGameObjectConfig extends Phaser.Types.GameObjects.GameObjectConfig {
	    /** The x-position of the object, optional, default: 0 */
	    x?: number;
	    /** The y-position of the object, optional, default: 0 */
	    y?: number;
	    /** The skeleton data key */
	    dataKey: string;
	    /** The atlas key */
	    atlasKey: string;
	    /** The bounds provider, optional, default: `SetupPoseBoundsProvider` */
	    boundsProvider?: SpineGameObjectBoundsProvider;
	}
	/**
	 * {@link ScenePlugin} implementation adding Spine Runtime capabilities to a scene.
	 *
	 * The scene's {@link LoaderPlugin} (`Scene.load`) gets these additional functions:
	 * * `spineBinary(key: string, url: string, xhrSettings?: XHRSettingsObject)`: loads a skeleton binary `.skel` file from the `url`.
	 * * `spineJson(key: string, url: string, xhrSettings?: XHRSettingsObject)`: loads a skeleton binary `.skel` file from the `url`.
	 * * `spineAtlas(key: string, url: string, premultipliedAlpha: boolean = true, xhrSettings?: XHRSettingsObject)`: loads a texture atlas `.atlas` file from the `url` as well as its correponding texture atlas page images.
	 *
	 * The scene's {@link GameObjectFactory} (`Scene.add`) gets these additional functions:
	 * * `spine(x: number, y: number, dataKey: string, atlasKey: string, boundsProvider: SpineGameObjectBoundsProvider = SetupPoseBoundsProvider())`:
	 *    creates a new {@link SpineGameObject} from the data and atlas at position `(x, y)`, using the {@link BoundsProvider} to calculate its bounding box. The object is automatically added to the scene.
	 *
	 * The scene's {@link GameObjectCreator} (`Scene.make`) gets these additional functions:
	 * * `spine(config: SpineGameObjectConfig)`: creates a new {@link SpineGameObject} from the given configuration object.
	 *
	 * The plugin has additional public methods to work with Spine Runtime core API objects:
	 * * `getAtlas(atlasKey: string)`: returns the {@link TextureAtlas} instance for the given atlas key.
	 * * `getSkeletonData(skeletonDataKey: string)`: returns the {@link SkeletonData} instance for the given skeleton data key.
	 * * `createSkeleton(skeletonDataKey: string, atlasKey: string, premultipliedAlpha: boolean = true)`: creates a new {@link Skeleton} instance from the given skeleton data and atlas key.
	 * * `isPremultipliedAlpha(atlasKey: string)`: returns `true` if the atlas with the given key has premultiplied alpha.
	 */
	class SpinePlugin extends Phaser.Plugins.ScenePlugin {
	    game: Phaser.Game;
	    private isWebGL;
	    private gl;
	    webGLRenderer: SceneRenderer | null;
	    canvasRenderer: SkeletonRenderer | null;
	    private skeletonDataCache;
	    private atlasCache;
	    constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager, pluginKey: string);
	    boot(): void;
	    onResize(): void;
	    shutdown(): void;
	    destroy(): void;
	    gameDestroy(): void;
	    /** Returns the TextureAtlas instance for the given key */
	    getAtlas(atlasKey: string): TextureAtlas;
	    /** Returns whether the TextureAtlas uses premultiplied alpha */
	    isAtlasPremultiplied(atlasKey: string): any;
	    /** Returns the SkeletonData instance for the given data and atlas key */
	    getSkeletonData(dataKey: string, atlasKey: string): SkeletonData;
	    /** Creates a new Skeleton instance from the data and atlas. */
	    createSkeleton(dataKey: string, atlasKey: string): Skeleton;
	}
}

// PACK: spine-phaser/dist/keys.d.ts
declare namespace spine {	
	const SPINE_SKELETON_FILE_CACHE_KEY = "esotericsoftware.spine.skeletonFile.cache";
	const SPINE_ATLAS_CACHE_KEY = "esotericsoftware.spine.atlas.cache";
	const SPINE_LOADER_TYPE = "spine";
	const SPINE_SKELETON_DATA_FILE_TYPE = "spineSkeletonData";
	const SPINE_ATLAS_FILE_TYPE = "spineAtlasData";
	const SPINE_GAME_OBJECT_TYPE = "spine";
	const SPINE_CONTAINER_TYPE = "spineContainer";
}

// PACK: spine-phaser/dist/mixins.d.ts
declare namespace spine {	const ComputedSize: any;
	const Depth: any;
	const Flip: any;
	const ScrollFactor: any;
	const Transform: any;
	const Visible: any;
	const Origin: any;
	const Alpha: any;
	interface Type<T, P extends any[] = any[]> extends Function {
	    new (...args: P): T;
	}
	type Mixin<GameObjectComponent, GameObjectConstraint extends Phaser.GameObjects.GameObject> = <GameObjectType extends Type<GameObjectConstraint>>(BaseGameObject: GameObjectType) => GameObjectType & Type<GameObjectComponent>;
	function createMixin<GameObjectComponent, GameObjectConstraint extends Phaser.GameObjects.GameObject = Phaser.GameObjects.GameObject>(...component: GameObjectComponent[]): Mixin<GameObjectComponent, GameObjectConstraint>;
	type ComputedSizeMixin = Mixin<Phaser.GameObjects.Components.Transform, Phaser.GameObjects.GameObject>;
	const ComputedSizeMixin: ComputedSizeMixin;
	type DepthMixin = Mixin<Phaser.GameObjects.Components.Depth, Phaser.GameObjects.GameObject>;
	const DepthMixin: DepthMixin;
	type FlipMixin = Mixin<Phaser.GameObjects.Components.Flip, Phaser.GameObjects.GameObject>;
	const FlipMixin: FlipMixin;
	type ScrollFactorMixin = Mixin<Phaser.GameObjects.Components.ScrollFactor, Phaser.GameObjects.GameObject>;
	const ScrollFactorMixin: ScrollFactorMixin;
	type TransformMixin = Mixin<Phaser.GameObjects.Components.Transform, Phaser.GameObjects.GameObject>;
	const TransformMixin: TransformMixin;
	type VisibleMixin = Mixin<Phaser.GameObjects.Components.Visible, Phaser.GameObjects.GameObject>;
	const VisibleMixin: VisibleMixin;
	type OriginMixin = Mixin<Phaser.GameObjects.Components.Origin, Phaser.GameObjects.GameObject>;
	const OriginMixin: OriginMixin;
	type AlphaMixin = Mixin<Phaser.GameObjects.Components.Alpha, Phaser.GameObjects.GameObject>;
	const AlphaMixin: AlphaMixin;
}