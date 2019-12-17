var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ide = colibri.ui.ide;
        scene.ICON_GROUP = "group";
        scene.ICON_TRANSLATE = "translate";
        scene.ICON_ANGLE = "angle";
        scene.ICON_SCALE = "scale";
        scene.ICON_ORIGIN = "origin";
        class ScenePlugin extends colibri.Plugin {
            constructor() {
                super("phasereditor2d.scene");
            }
            static getInstance() {
                return this._instance;
            }
            registerExtensions(reg) {
                // content type resolvers
                reg.addExtension(new colibri.core.ContentTypeExtension([new scene.core.SceneContentTypeResolver()], 5));
                // content type renderer
                reg.addExtension(new phasereditor2d.files.ui.viewers.SimpleContentTypeCellRendererExtension(scene.core.CONTENT_TYPE_SCENE, new scene.ui.viewers.SceneFileCellRenderer()));
                // icons loader
                reg.addExtension(ide.IconLoaderExtension.withPluginFiles(this, [
                    scene.ICON_GROUP,
                    scene.ICON_ANGLE,
                    scene.ICON_ORIGIN,
                    scene.ICON_SCALE,
                    scene.ICON_TRANSLATE
                ]));
                // commands
                reg.addExtension(new ide.commands.CommandExtension(scene.ui.editor.commands.SceneEditorCommands.registerCommands));
                // editors
                reg.addExtension(new ide.EditorExtension([
                    scene.ui.editor.SceneEditor.getFactory()
                ]));
                // new file wizards
                reg.addExtension(new scene.ui.dialogs.NewSceneFileDialogExtension());
            }
        }
        ScenePlugin._instance = new ScenePlugin();
        scene.ScenePlugin = ScenePlugin;
        colibri.Platform.addPlugin(ScenePlugin.getInstance());
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core_1) {
            var core = colibri.core;
            core_1.CONTENT_TYPE_SCENE = "phasereditor2d.core.scene.SceneContentType";
            class SceneContentTypeResolver extends core.ContentTypeResolver {
                constructor() {
                    super("phasereditor2d.scene.core.SceneContentTypeResolver");
                }
                async computeContentType(file) {
                    if (file.getExtension() === "scene") {
                        const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);
                        if (content !== null) {
                            try {
                                const data = JSON.parse(content);
                                if (data.meta.contentType === core_1.CONTENT_TYPE_SCENE) {
                                    return core_1.CONTENT_TYPE_SCENE;
                                }
                            }
                            catch (e) {
                            }
                        }
                    }
                    return core.CONTENT_TYPE_ANY;
                }
            }
            core_1.SceneContentTypeResolver = SceneContentTypeResolver;
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            Phaser.Cameras.Scene2D.Camera.prototype.getScreenPoint = function (worldX, worldY) {
                let x = worldX * this.zoom - this.scrollX * this.zoom;
                let y = worldY * this.zoom - this.scrollY * this.zoom;
                return new Phaser.Math.Vector2(x, y);
            };
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            class GameScene extends Phaser.Scene {
                constructor(inEditor = true) {
                    super("ObjectScene");
                    this._inEditor = inEditor;
                    this._sceneType = "Scene";
                }
                getDisplayListChildren() {
                    return this.sys.displayList.getChildren();
                }
                visit(visitor) {
                    for (const obj of this.getDisplayListChildren()) {
                        visitor(obj);
                        if (obj instanceof ui.gameobjects.EditorContainer) {
                            for (const child of obj.list) {
                                visitor(child);
                            }
                        }
                    }
                }
                makeNewName(baseName) {
                    const nameMaker = new colibri.ui.ide.utils.NameMaker((obj) => {
                        return obj.getEditorLabel();
                    });
                    this.visit(obj => nameMaker.update([obj]));
                    return nameMaker.makeName(baseName);
                }
                getByEditorId(id) {
                    const obj = GameScene.findByEditorId(this.getDisplayListChildren(), id);
                    if (!obj) {
                        console.error(`Object with id=${id} not found.`);
                    }
                    return obj;
                }
                static findByEditorId(list, id) {
                    for (const obj of list) {
                        if (obj.getEditorId() === id) {
                            return obj;
                        }
                        if (obj instanceof ui.gameobjects.EditorContainer) {
                            const result = this.findByEditorId(obj.list, id);
                            if (result) {
                                return result;
                            }
                        }
                    }
                    return null;
                }
                getSceneType() {
                    return this._sceneType;
                }
                setSceneType(sceneType) {
                    this._sceneType = sceneType;
                }
                getCamera() {
                    return this.cameras.main;
                }
                setInitialState(state) {
                    this._initialState = state;
                }
                create() {
                    var _a, _b, _c;
                    if (this._inEditor) {
                        const camera = this.getCamera();
                        camera.setOrigin(0, 0);
                        //camera.backgroundColor = Phaser.Display.Color.ValueToColor("#6e6e6e");
                        camera.backgroundColor = Phaser.Display.Color.ValueToColor("#8e8e8e");
                        if (this._initialState) {
                            camera.zoom = (_a = this._initialState.cameraZoom, (_a !== null && _a !== void 0 ? _a : camera.zoom));
                            camera.scrollX = (_b = this._initialState.cameraScrollX, (_b !== null && _b !== void 0 ? _b : camera.scrollX));
                            camera.scrollY = (_c = this._initialState.cameraScrollY, (_c !== null && _c !== void 0 ? _c : camera.scrollY));
                            this._initialState = null;
                        }
                    }
                }
            }
            ui.GameScene = GameScene;
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_1) {
        var ui;
        (function (ui) {
            var ide = colibri.ui.ide;
            class SceneMaker {
                constructor(scene) {
                    this._scene = scene;
                }
                createObject(objData) {
                    const reader = new ui.json.SceneParser(this._scene);
                    return reader.createObject(objData);
                }
                createContainerWithObjects(objects) {
                    const container = ui.gameobjects.EditorContainer.add(this._scene, 0, 0, objects);
                    const name = this._scene.makeNewName("container");
                    container.setEditorLabel(name);
                    ui.json.SceneParser.setNewId(container);
                    return container;
                }
                async createWithDropEvent_async(e, dropDataArray) {
                    const nameMaker = new ide.utils.NameMaker(obj => {
                        return obj.getEditorLabel();
                    });
                    this._scene.visit(obj => nameMaker.update([obj]));
                    const worldPoint = this._scene.getCamera().getWorldPoint(e.offsetX, e.offsetY);
                    const x = worldPoint.x;
                    const y = worldPoint.y;
                    const parser = new ui.json.SceneParser(this._scene);
                    for (const data of dropDataArray) {
                        await parser.addToCache_async(data);
                    }
                    const sprites = [];
                    for (const data of dropDataArray) {
                        if (data instanceof phasereditor2d.pack.core.AssetPackImageFrame) {
                            const sprite = ui.gameobjects.EditorImage.add(this._scene, x, y, data.getPackItem().getKey(), data.getName());
                            sprite.setEditorLabel(nameMaker.makeName(data.getName()));
                            sprite.setEditorTexture(data.getPackItem().getKey(), data.getName());
                            sprites.push(sprite);
                        }
                        else if (data instanceof phasereditor2d.pack.core.AssetPackItem) {
                            switch (data.getType()) {
                                case phasereditor2d.pack.core.IMAGE_TYPE: {
                                    const sprite = ui.gameobjects.EditorImage.add(this._scene, x, y, data.getKey());
                                    sprite.setEditorLabel(nameMaker.makeName(data.getKey()));
                                    sprite.setEditorTexture(data.getKey(), null);
                                    sprites.push(sprite);
                                    break;
                                }
                            }
                        }
                    }
                    for (const sprite of sprites) {
                        sprite.setEditorScene(this._scene);
                        ui.json.SceneParser.setNewId(sprite);
                        ui.json.SceneParser.initSprite(sprite);
                    }
                    return sprites;
                }
            }
            ui.SceneMaker = SceneMaker;
        })(ui = scene_1.ui || (scene_1.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_2) {
        var ui;
        (function (ui) {
            var controls = colibri.ui.controls;
            var ide = colibri.ui.ide;
            class ThumbnailScene extends ui.GameScene {
                constructor(data, callback) {
                    super(false);
                    this._data = data;
                    this._callback = callback;
                }
                create() {
                    const parser = new ui.json.SceneParser(this);
                    parser.createSceneCache_async(this._data)
                        .then(() => {
                        parser.createScene(this._data);
                        this.sys.renderer.snapshot(img => {
                            this._callback(img);
                        });
                    });
                }
            }
            class SceneThumbnail {
                constructor(file) {
                    this._file = file;
                    this._image = null;
                }
                paint(context, x, y, w, h, center) {
                    if (this._image) {
                        this._image.paint(context, x, y, w, h, center);
                    }
                }
                paintFrame(context, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH) {
                    if (this._image) {
                        this._image.paintFrame(context, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
                    }
                }
                getWidth() {
                    return this._image ? this._image.getWidth() : 16;
                }
                getHeight() {
                    return this._image ? this._image.getHeight() : 16;
                }
                preloadSize() {
                    return this.preload();
                }
                async preload() {
                    if (this._image == null) {
                        if (this._promise) {
                            return this._promise;
                        }
                        this._promise = ide.FileUtils.preloadFileString(this._file)
                            .then(() => this.createImageElement())
                            .then(imageElement => {
                            this._image = new controls.ImageWrapper(imageElement);
                            this._promise = null;
                            return controls.PreloadResult.RESOURCES_LOADED;
                        });
                        return this._promise;
                    }
                    return controls.Controls.resolveNothingLoaded();
                }
                createImageElement() {
                    return new Promise((resolve, reject) => {
                        const content = ide.FileUtils.getFileString(this._file);
                        const data = JSON.parse(content);
                        const width = 800;
                        const height = 600;
                        const canvas = document.createElement("canvas");
                        canvas.style.width = (canvas.width = width) + "px";
                        canvas.style.height = (canvas.height = height) + "px";
                        const parent = document.createElement("div");
                        parent.style.position = "fixed";
                        parent.style.left = -width - 10 + "px";
                        parent.appendChild(canvas);
                        document.body.appendChild(parent);
                        const scene = new ThumbnailScene(data, image => {
                            resolve(image);
                            parent.remove();
                        });
                        const game = new Phaser.Game({
                            type: Phaser.WEBGL,
                            canvas: canvas,
                            parent: null,
                            width: width,
                            height: height,
                            scale: {
                                mode: Phaser.Scale.NONE
                            },
                            render: {
                                pixelArt: true,
                                transparent: true
                            },
                            audio: {
                                noAudio: true
                            },
                            scene: scene,
                        });
                    });
                }
            }
            ui.SceneThumbnail = SceneThumbnail;
        })(ui = scene_2.ui || (scene_2.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var core = colibri.core;
            class SceneThumbnailCache extends core.io.FileContentCache {
                constructor() {
                    super(async (file) => {
                        const image = new ui.SceneThumbnail(file);
                        await image.preload();
                        return Promise.resolve(image);
                    });
                }
                static getInstance() {
                    if (!this._instance) {
                        this._instance = new SceneThumbnailCache();
                    }
                    return this._instance;
                }
            }
            ui.SceneThumbnailCache = SceneThumbnailCache;
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var blocks;
            (function (blocks) {
                class SceneEditorBlocksCellRendererProvider extends phasereditor2d.pack.ui.viewers.AssetPackCellRendererProvider {
                    constructor() {
                        super("grid");
                    }
                    getCellRenderer(element) {
                        if (element instanceof colibri.core.io.FilePath) {
                            return new ui.viewers.SceneFileCellRenderer();
                        }
                        return super.getCellRenderer(element);
                    }
                }
                blocks.SceneEditorBlocksCellRendererProvider = SceneEditorBlocksCellRendererProvider;
            })(blocks = ui.blocks || (ui.blocks = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var blocks;
            (function (blocks) {
                var ide = colibri.ui.ide;
                const SCENE_EDITOR_BLOCKS_PACK_ITEM_TYPES = new Set(["image", "atlas", "atlasXML", "multiatlas", "unityAtlas", "spritesheet"]);
                class SceneEditorBlocksContentProvider extends phasereditor2d.pack.ui.viewers.AssetPackContentProvider {
                    constructor(getPacks) {
                        super();
                        this._getPacks = getPacks;
                    }
                    getPackItems() {
                        return this._getPacks()
                            .flatMap(pack => pack.getItems())
                            .filter(item => SCENE_EDITOR_BLOCKS_PACK_ITEM_TYPES.has(item.getType()));
                    }
                    getRoots(input) {
                        const roots = [];
                        roots.push(...this.getSceneFiles());
                        roots.push(...this.getPackItems());
                        return roots;
                    }
                    getSceneFiles() {
                        return ide.FileUtils.getAllFiles().filter(file => file.getExtension() === "scene");
                    }
                    getChildren(parent) {
                        if (typeof (parent) === "string") {
                            switch (parent) {
                                case phasereditor2d.pack.core.ATLAS_TYPE:
                                    return this.getPackItems()
                                        .filter(item => item instanceof phasereditor2d.pack.core.BaseAtlasAssetPackItem);
                                case blocks.PREFAB_SECTION:
                                    //TODO: we need to implement the PrefabFinder
                                    const files = this.getSceneFiles();
                                    return files;
                            }
                            return this.getPackItems()
                                .filter(item => item.getType() === parent);
                        }
                        return super.getChildren(parent);
                    }
                }
                blocks.SceneEditorBlocksContentProvider = SceneEditorBlocksContentProvider;
            })(blocks = ui.blocks || (ui.blocks = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var blocks;
            (function (blocks) {
                var core = colibri.core;
                class SceneEditorBlocksLabelProvider extends phasereditor2d.pack.ui.viewers.AssetPackLabelProvider {
                    getLabel(obj) {
                        if (obj instanceof core.io.FilePath) {
                            return obj.getName();
                        }
                        return super.getLabel(obj);
                    }
                }
                blocks.SceneEditorBlocksLabelProvider = SceneEditorBlocksLabelProvider;
            })(blocks = ui.blocks || (ui.blocks = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var blocks;
            (function (blocks) {
                class SceneEditorBlocksPropertyProvider extends phasereditor2d.pack.ui.properties.AssetPackPreviewPropertyProvider {
                    addSections(page, sections) {
                        super.addSections(page, sections);
                    }
                }
                blocks.SceneEditorBlocksPropertyProvider = SceneEditorBlocksPropertyProvider;
            })(blocks = ui.blocks || (ui.blocks = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var blocks;
            (function (blocks) {
                var ide = colibri.ui.ide;
                class SceneEditorBlocksProvider extends ide.EditorViewerProvider {
                    constructor(editor) {
                        super();
                        this._editor = editor;
                        this._packs = [];
                    }
                    async preload() {
                        const finder = new phasereditor2d.pack.core.PackFinder();
                        await finder.preload();
                        this._packs = finder.getPacks();
                    }
                    prepareViewerState(state) {
                        if (state.expandedObjects) {
                            state.expandedObjects = this.getFreshItems(state.expandedObjects);
                        }
                        if (state.selectedObjects) {
                            state.selectedObjects = this.getFreshItems(state.selectedObjects);
                        }
                    }
                    getFreshItems(items) {
                        const set = new Set();
                        for (const obj of items) {
                            if (obj instanceof phasereditor2d.pack.core.AssetPackItem) {
                                const item = this.getFreshItem(obj);
                                if (item) {
                                    set.add(item);
                                }
                            }
                            else if (obj instanceof phasereditor2d.pack.core.AssetPackImageFrame) {
                                const item = this.getFreshItem(obj.getPackItem());
                                if (item instanceof phasereditor2d.pack.core.ImageFrameContainerAssetPackItem) {
                                    const frame = item.findFrame(obj.getName());
                                    if (frame) {
                                        set.add(frame);
                                    }
                                }
                            }
                            else {
                                set.add(obj);
                            }
                        }
                        return set;
                    }
                    getFreshItem(item) {
                        const freshPack = this._packs.find(pack => pack.getFile() === item.getPack().getFile());
                        const finder = new phasereditor2d.pack.core.PackFinder(freshPack);
                        return finder.findAssetPackItem(item.getKey());
                    }
                    getContentProvider() {
                        return new blocks.SceneEditorBlocksContentProvider(() => this._packs);
                    }
                    getLabelProvider() {
                        return new blocks.SceneEditorBlocksLabelProvider();
                    }
                    getCellRendererProvider() {
                        return new blocks.SceneEditorBlocksCellRendererProvider();
                    }
                    getTreeViewerRenderer(viewer) {
                        return new blocks.SceneEditorBlocksTreeRendererProvider(viewer);
                    }
                    getUndoManager() {
                        return this._editor;
                    }
                    getPropertySectionProvider() {
                        return new blocks.SceneEditorBlocksPropertyProvider();
                    }
                    getInput() {
                        return this;
                    }
                }
                blocks.SceneEditorBlocksProvider = SceneEditorBlocksProvider;
            })(blocks = ui.blocks || (ui.blocks = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var blocks;
            (function (blocks) {
                blocks.PREFAB_SECTION = "Prefab";
                class SceneEditorBlocksTreeRendererProvider extends phasereditor2d.pack.ui.viewers.AssetPackTreeViewerRenderer {
                    constructor(viewer) {
                        super(viewer, false);
                        this.setSections([
                            blocks.PREFAB_SECTION,
                            phasereditor2d.pack.core.IMAGE_TYPE,
                            phasereditor2d.pack.core.ATLAS_TYPE,
                            phasereditor2d.pack.core.SPRITESHEET_TYPE
                        ]);
                    }
                }
                blocks.SceneEditorBlocksTreeRendererProvider = SceneEditorBlocksTreeRendererProvider;
            })(blocks = ui.blocks || (ui.blocks = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                class NewSceneFileDialogExtension extends phasereditor2d.files.ui.dialogs.NewFileContentExtension {
                    constructor() {
                        super({
                            id: "phasereditor2d.scene.ui.wizards.NewSceneFileWizardExtension",
                            wizardName: "Scene File",
                            icon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_GROUP),
                            fileExtension: "scene",
                            initialFileName: "Scene",
                            fileContent: JSON.stringify({
                                sceneType: "Scene",
                                displayList: [],
                                meta: {
                                    app: "Phaser Editor 2D - Scene Editor",
                                    url: "https://phasereditor2d.com",
                                    contentType: scene.core.CONTENT_TYPE_SCENE
                                }
                            })
                        });
                    }
                    getInitialFileLocation() {
                        return super.findInitialFileLocationBasedOnContentType(scene.core.CONTENT_TYPE_SCENE);
                    }
                }
                dialogs.NewSceneFileDialogExtension = NewSceneFileDialogExtension;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/*

`{
                    "sceneType": "Scene",
                    "displayList": [],
                    "meta": {

                    }
                }`

                */ 
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_1) {
                class ActionManager {
                    constructor(editor) {
                        this._editor = editor;
                    }
                    deleteObjects() {
                        const objects = this._editor.getSelectedGameObjects();
                        // create the undo-operation before destroy the objects
                        this._editor.getUndoManager().add(new editor_1.undo.RemoveObjectsOperation(this._editor, objects));
                        for (const obj of objects) {
                            obj.destroy();
                        }
                        this._editor.refreshOutline();
                        this._editor.getSelectionManager().refreshSelection();
                        this._editor.setDirty(true);
                        this._editor.repaint();
                    }
                    joinObjectsInContainer() {
                        const sel = this._editor.getSelectedGameObjects();
                        for (const obj of sel) {
                            if (obj instanceof Phaser.GameObjects.Container || obj.parentContainer) {
                                alert("Nested containers are not supported");
                                return;
                            }
                        }
                        const container = this._editor.getSceneMaker().createContainerWithObjects(sel);
                        this._editor.getUndoManager().add(new editor_1.undo.JoinObjectsInContainerOperation(this._editor, container));
                        this._editor.setSelection([container]);
                        this._editor.refreshOutline();
                        this._editor.setDirty(true);
                        this._editor.repaint();
                    }
                }
                editor_1.ActionManager = ActionManager;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_3) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_2) {
                class CameraManager {
                    constructor(editor) {
                        this._editor = editor;
                        this._dragStartPoint = null;
                        const canvas = this._editor.getOverlayLayer().getCanvas();
                        canvas.addEventListener("wheel", e => this.onWheel(e));
                        canvas.addEventListener("mousedown", e => this.onMouseDown(e));
                        canvas.addEventListener("mousemove", e => this.onMouseMove(e));
                        canvas.addEventListener("mouseup", e => this.onMouseUp(e));
                    }
                    getCamera() {
                        return this._editor.getGameScene().getCamera();
                    }
                    onMouseDown(e) {
                        if (e.button === 1) {
                            const camera = this.getCamera();
                            this._dragStartPoint = new Phaser.Math.Vector2(e.offsetX, e.offsetY);
                            this._dragStartCameraScroll = new Phaser.Math.Vector2(camera.scrollX, camera.scrollY);
                            e.preventDefault();
                        }
                    }
                    onMouseMove(e) {
                        if (this._dragStartPoint === null) {
                            return;
                        }
                        const dx = this._dragStartPoint.x - e.offsetX;
                        const dy = this._dragStartPoint.y - e.offsetY;
                        const camera = this.getCamera();
                        camera.scrollX = this._dragStartCameraScroll.x + dx / camera.zoom;
                        camera.scrollY = this._dragStartCameraScroll.y + dy / camera.zoom;
                        this._editor.repaint();
                        e.preventDefault();
                    }
                    onMouseUp(e) {
                        this._dragStartPoint = null;
                        this._dragStartCameraScroll = null;
                    }
                    onWheel(e) {
                        const scene = this._editor.getGameScene();
                        const camera = scene.getCamera();
                        const delta = e.deltaY;
                        const zoomDelta = (delta > 0 ? 0.9 : 1.1);
                        //const pointer = scene.input.activePointer;
                        const point1 = camera.getWorldPoint(e.offsetX, e.offsetY);
                        camera.zoom *= zoomDelta;
                        // update the camera matrix
                        camera.preRender(scene.scale.resolution);
                        const point2 = camera.getWorldPoint(e.offsetX, e.offsetY);
                        const dx = point2.x - point1.x;
                        const dy = point2.y - point1.y;
                        camera.scrollX += -dx;
                        camera.scrollY += -dy;
                        this._editor.repaint();
                    }
                }
                editor_2.CameraManager = CameraManager;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene_3.ui || (scene_3.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_3) {
                var controls = colibri.ui.controls;
                var ide = colibri.ui.ide;
                class DropManager {
                    constructor(editor) {
                        this._editor = editor;
                        const canvas = this._editor.getOverlayLayer().getCanvas();
                        canvas.addEventListener("dragover", e => this.onDragOver(e));
                        canvas.addEventListener("drop", e => this.onDragDrop_async(e));
                    }
                    async onDragDrop_async(e) {
                        const dataArray = controls.Controls.getApplicationDragDataAndClean();
                        if (this.acceptsDropDataArray(dataArray)) {
                            e.preventDefault();
                            const sprites = await this._editor.getSceneMaker().createWithDropEvent_async(e, dataArray);
                            this._editor.getUndoManager().add(new editor_3.undo.AddObjectsOperation(this._editor, sprites));
                            this._editor.setSelection(sprites);
                            this._editor.refreshOutline();
                            this._editor.setDirty(true);
                            this._editor.repaint();
                            ide.Workbench.getWorkbench().setActivePart(this._editor);
                        }
                    }
                    onDragOver(e) {
                        if (this.acceptsDropDataArray(controls.Controls.getApplicationDragData())) {
                            e.preventDefault();
                        }
                    }
                    acceptsDropData(data) {
                        if (data instanceof phasereditor2d.pack.core.AssetPackItem) {
                            if (data.getType() === phasereditor2d.pack.core.IMAGE_TYPE) {
                                return true;
                            }
                        }
                        else if (data instanceof phasereditor2d.pack.core.AssetPackImageFrame) {
                            return true;
                        }
                        return false;
                    }
                    acceptsDropDataArray(dataArray) {
                        if (!dataArray) {
                            return false;
                        }
                        for (const item of dataArray) {
                            if (!this.acceptsDropData(item)) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                editor_3.DropManager = DropManager;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_4) {
                class OverlayLayer {
                    constructor(editor) {
                        this._editor = editor;
                        this._canvas = document.createElement("canvas");
                        this._canvas.style.position = "absolute";
                    }
                    getCanvas() {
                        return this._canvas;
                    }
                    resetContext() {
                        this._ctx = this._canvas.getContext("2d");
                        this._ctx.imageSmoothingEnabled = false;
                        this._ctx.font = "12px Monospace";
                    }
                    resizeTo() {
                        const parent = this._canvas.parentElement;
                        this._canvas.width = parent.clientWidth | 0;
                        this._canvas.height = parent.clientHeight | 0;
                        this._canvas.style.width = this._canvas.width + "px";
                        this._canvas.style.height = this._canvas.height + "px";
                        this.resetContext();
                    }
                    render() {
                        if (!this._ctx) {
                            this.resetContext();
                        }
                        this.renderGrid();
                        this.renderSelection();
                    }
                    renderSelection() {
                        const ctx = this._ctx;
                        ctx.save();
                        const camera = this._editor.getGameScene().getCamera();
                        for (const obj of this._editor.getSelection()) {
                            if (obj instanceof Phaser.GameObjects.GameObject) {
                                const sprite = obj;
                                const points = sprite.getScreenBounds(camera);
                                if (points.length === 4) {
                                    ctx.strokeStyle = "black";
                                    ctx.lineWidth = 4;
                                    ctx.beginPath();
                                    ctx.moveTo(points[0].x, points[0].y);
                                    ctx.lineTo(points[1].x, points[1].y);
                                    ctx.lineTo(points[2].x, points[2].y);
                                    ctx.lineTo(points[3].x, points[3].y);
                                    ctx.closePath();
                                    ctx.stroke();
                                    ctx.strokeStyle = "#00ff00";
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(points[0].x, points[0].y);
                                    ctx.lineTo(points[1].x, points[1].y);
                                    ctx.lineTo(points[2].x, points[2].y);
                                    ctx.lineTo(points[3].x, points[3].y);
                                    ctx.closePath();
                                    ctx.stroke();
                                }
                            }
                        }
                        ctx.restore();
                    }
                    renderGrid() {
                        const camera = this._editor.getGameScene().getCamera();
                        // parameters from settings
                        const snapEnabled = false;
                        const snapX = 10;
                        const snapY = 10;
                        const borderX = 0;
                        const borderY = 0;
                        const borderWidth = 800;
                        const borderHeight = 600;
                        const ctx = this._ctx;
                        const canvasWidth = this._canvas.width;
                        const canvasHeight = this._canvas.height;
                        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                        // render grid
                        ctx.strokeStyle = "#aeaeae";
                        ctx.lineWidth = 1;
                        let gapX = 4;
                        let gapY = 4;
                        if (snapEnabled) {
                            gapX = snapX;
                            gapY = snapY;
                        }
                        {
                            for (let i = 1; true; i++) {
                                const delta = camera.getScreenPoint(gapX * i, gapY * i).subtract(camera.getScreenPoint(0, 0));
                                if (delta.x > 64 && delta.y > 64) {
                                    gapX = gapX * i;
                                    gapY = gapY * i;
                                    break;
                                }
                            }
                        }
                        const worldStartPoint = camera.getWorldPoint(0, 0);
                        worldStartPoint.x = Phaser.Math.Snap.Floor(worldStartPoint.x, gapX);
                        worldStartPoint.y = Phaser.Math.Snap.Floor(worldStartPoint.y, gapY);
                        const worldEndPoint = camera.getWorldPoint(canvasWidth, canvasHeight);
                        const grid = (render) => {
                            let worldY = worldStartPoint.y;
                            while (worldY < worldEndPoint.y) {
                                let point = camera.getScreenPoint(0, worldY);
                                render.horizontal(worldY, point.y | 0);
                                worldY += gapY;
                            }
                            let worldX = worldStartPoint.x;
                            while (worldX < worldEndPoint.x) {
                                let point = camera.getScreenPoint(worldX, 0);
                                render.vertical(worldX, point.x | 0);
                                worldX += gapX;
                            }
                        };
                        let labelWidth = 0;
                        ctx.save();
                        ctx.fillStyle = ctx.strokeStyle;
                        // labels
                        grid({
                            horizontal: (worldY, screenY) => {
                                const w = ctx.measureText(worldY.toString()).width;
                                labelWidth = Math.max(labelWidth, w + 2);
                                ctx.save();
                                ctx.fillStyle = "#000000";
                                ctx.fillText(worldY.toString(), 0 + 1, screenY + 4 + 1);
                                ctx.restore();
                                ctx.fillText(worldY.toString(), 0, screenY + 4);
                            },
                            vertical: (worldX, screenX) => {
                                if (screenX < labelWidth) {
                                    return;
                                }
                                const w = ctx.measureText(worldX.toString()).width;
                                ctx.save();
                                ctx.fillStyle = "#000000";
                                ctx.fillText(worldX.toString(), screenX - w / 2 + 1, 15 + 1);
                                ctx.restore();
                                ctx.fillText(worldX.toString(), screenX - w / 2, 15);
                            }
                        });
                        // lines 
                        grid({
                            horizontal: (worldY, screenY) => {
                                if (screenY < 20) {
                                    return;
                                }
                                ctx.beginPath();
                                ctx.moveTo(labelWidth, screenY);
                                ctx.lineTo(canvasWidth, screenY);
                                ctx.stroke();
                            },
                            vertical: (worldX, screenX) => {
                                if (screenX < labelWidth) {
                                    return;
                                }
                                ctx.beginPath();
                                ctx.moveTo(screenX, 20);
                                ctx.lineTo(screenX, canvasHeight);
                                ctx.stroke();
                            }
                        });
                        ctx.restore();
                        {
                            ctx.save();
                            ctx.lineWidth = 2;
                            const a = camera.getScreenPoint(borderX, borderY);
                            const b = camera.getScreenPoint(borderX + borderWidth, borderY + borderHeight);
                            ctx.save();
                            ctx.strokeStyle = "#404040";
                            ctx.strokeRect(a.x + 2, a.y + 2, b.x - a.x, b.y - a.y);
                            ctx.restore();
                            ctx.lineWidth = 1;
                            ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
                            ctx.restore();
                        }
                    }
                }
                editor_4.OverlayLayer = OverlayLayer;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var controls = colibri.ui.controls;
                var io = colibri.core.io;
                class SceneEditorFactory extends colibri.ui.ide.EditorFactory {
                    constructor() {
                        super("phasereditor2d.SceneEditorFactory");
                    }
                    acceptInput(input) {
                        if (input instanceof io.FilePath) {
                            const contentType = colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(input);
                            return contentType === scene.core.CONTENT_TYPE_SCENE;
                        }
                        return false;
                    }
                    createEditor() {
                        return new SceneEditor();
                    }
                }
                class SceneEditor extends colibri.ui.ide.FileEditor {
                    constructor() {
                        super("phasereditor2d.SceneEditor");
                        this.addClass("SceneEditor");
                        this._blocksProvider = new ui.blocks.SceneEditorBlocksProvider(this);
                        this._outlineProvider = new editor.outline.SceneEditorOutlineProvider(this);
                        this._propertyProvider = new editor.properties.SceneEditorSectionProvider();
                    }
                    static getFactory() {
                        return new SceneEditorFactory();
                    }
                    async doSave() {
                        const writer = new ui.json.SceneWriter(this.getGameScene());
                        const data = writer.toJSON();
                        const content = JSON.stringify(data, null, 4);
                        try {
                            await colibri.ui.ide.FileUtils.setFileString_async(this.getInput(), content);
                            this.setDirty(false);
                            this.updateTitleIcon();
                        }
                        catch (e) {
                            console.error(e);
                        }
                        const win = colibri.Platform.getWorkbench().getActiveWindow();
                        win.saveWindowState();
                    }
                    saveState(state) {
                        if (!this._gameScene) {
                            return;
                        }
                        const camera = this._gameScene.cameras.main;
                        state.cameraZoom = camera.zoom;
                        state.cameraScrollX = camera.scrollX;
                        state.cameraScrollY = camera.scrollY;
                    }
                    restoreState(state) {
                        this._gameScene.setInitialState(state);
                    }
                    onEditorInputContentChanged() {
                        //TODO: missing to implement
                    }
                    setInput(file) {
                        super.setInput(file);
                        // we do this here because the icon should be shown even if the editor is not created yet.
                        this.updateTitleIcon();
                    }
                    createPart() {
                        this.setLayoutChildren(false);
                        const container = document.createElement("div");
                        container.classList.add("SceneEditorContainer");
                        this.getElement().appendChild(container);
                        this._gameCanvas = document.createElement("canvas");
                        this._gameCanvas.style.position = "absolute";
                        this.getElement().appendChild(container);
                        container.appendChild(this._gameCanvas);
                        this._overlayLayer = new editor.OverlayLayer(this);
                        container.appendChild(this._overlayLayer.getCanvas());
                        // create game scene
                        this._gameScene = new ui.GameScene();
                        this._game = new Phaser.Game({
                            type: Phaser.WEBGL,
                            canvas: this._gameCanvas,
                            scale: {
                                mode: Phaser.Scale.NONE
                            },
                            render: {
                                pixelArt: true,
                                transparent: true
                            },
                            audio: {
                                noAudio: true
                            },
                            scene: this._gameScene,
                        });
                        this._sceneRead = false;
                        this._gameBooted = false;
                        this._game.config.postBoot = () => {
                            // the scene is created just at this moment!
                            this.onGameBoot();
                        };
                        // init managers and factories
                        this._sceneMaker = new ui.SceneMaker(this.getGameScene());
                        this._dropManager = new editor.DropManager(this);
                        this._cameraManager = new editor.CameraManager(this);
                        this._selectionManager = new editor.SelectionManager(this);
                        this._actionManager = new editor.ActionManager(this);
                    }
                    async updateTitleIcon() {
                        const file = this.getInput();
                        await ui.SceneThumbnailCache.getInstance().preload(file);
                        const img = this.getIcon();
                        if (img) {
                            img.preload().then(w => this.dispatchTitleUpdatedEvent());
                        }
                        else {
                            this.dispatchTitleUpdatedEvent();
                        }
                    }
                    getIcon() {
                        const file = this.getInput();
                        if (file) {
                            const img = ui.SceneThumbnailCache.getInstance().getContent(file);
                            if (img) {
                                return img;
                            }
                        }
                        return super.getIcon();
                    }
                    createEditorToolbar(parent) {
                        const manager = new controls.ToolbarManager(parent);
                        manager.add(new controls.Action({
                            icon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_TRANSLATE),
                            callback: () => { }
                        }));
                        manager.add(new controls.Action({
                            icon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_SCALE),
                            callback: () => { }
                        }));
                        manager.add(new controls.Action({
                            icon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_ANGLE),
                            callback: () => { }
                        }));
                        manager.add(new controls.Action({
                            icon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_ORIGIN),
                            callback: () => { }
                        }));
                        manager.add(new controls.Action({
                            icon: colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_PLUS),
                            callback: () => { }
                        }));
                        return manager;
                    }
                    async readScene() {
                        this._sceneRead = true;
                        try {
                            const file = this.getInput();
                            await colibri.ui.ide.FileUtils.preloadFileString(file);
                            const content = colibri.ui.ide.FileUtils.getFileString(file);
                            const data = JSON.parse(content);
                            if (ui.json.SceneParser.isValidSceneDataFormat(data)) {
                                const parser = new ui.json.SceneParser(this.getGameScene());
                                await parser.createSceneCache_async(data);
                                await parser.createScene(data);
                            }
                            else {
                                alert("Invalid file format.");
                            }
                        }
                        catch (e) {
                            alert(e.message);
                            throw e;
                        }
                    }
                    getSelectedGameObjects() {
                        return this.getSelection()
                            .filter(obj => obj instanceof Phaser.GameObjects.GameObject)
                            .map(obj => obj);
                    }
                    getActionManager() {
                        return this._actionManager;
                    }
                    getSelectionManager() {
                        return this._selectionManager;
                    }
                    getOverlayLayer() {
                        return this._overlayLayer;
                    }
                    getGameCanvas() {
                        return this._gameCanvas;
                    }
                    getGameScene() {
                        return this._gameScene;
                    }
                    getGame() {
                        return this._game;
                    }
                    getSceneMaker() {
                        return this._sceneMaker;
                    }
                    layout() {
                        super.layout();
                        this._overlayLayer.resizeTo();
                        const parent = this._gameCanvas.parentElement;
                        const w = parent.clientWidth;
                        const h = parent.clientHeight;
                        this._game.scale.resize(w, h);
                        if (this._gameBooted) {
                            this._gameScene.getCamera().setSize(w, h);
                            this.repaint();
                        }
                    }
                    getPropertyProvider() {
                        return this._propertyProvider;
                    }
                    async onPartActivated() {
                        super.onPartActivated();
                        if (this._blocksProvider) {
                            await this._blocksProvider.preload();
                            this._blocksProvider.repaint();
                        }
                    }
                    getEditorViewerProvider(key) {
                        switch (key) {
                            case phasereditor2d.blocks.ui.views.BlocksView.EDITOR_VIEWER_PROVIDER_KEY:
                                return this._blocksProvider;
                            case phasereditor2d.outline.ui.views.OutlineView.EDITOR_VIEWER_PROVIDER_KEY:
                                return this._outlineProvider;
                            default:
                                break;
                        }
                        return null;
                    }
                    getOutlineProvider() {
                        return this._outlineProvider;
                    }
                    refreshOutline() {
                        this._outlineProvider.repaint();
                    }
                    async onGameBoot() {
                        this._gameBooted = true;
                        if (!this._sceneRead) {
                            await this.readScene();
                        }
                        this.layout();
                        this.refreshOutline();
                        // for some reason, we should do this after a time, or the game is not stopped well.
                        setTimeout(() => this._game.loop.stop(), 500);
                    }
                    repaint() {
                        if (!this._gameBooted) {
                            return;
                        }
                        this._game.loop.tick();
                        this._overlayLayer.render();
                    }
                }
                editor.SceneEditor = SceneEditor;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_4) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_5) {
                var controls = colibri.ui.controls;
                class SelectionManager {
                    constructor(editor) {
                        this._editor = editor;
                        const canvas = this._editor.getOverlayLayer().getCanvas();
                        canvas.addEventListener("click", e => this.onMouseClick(e));
                        this._editor.addEventListener(controls.EVENT_SELECTION_CHANGED, e => this.updateOutlineSelection());
                    }
                    clearSelection() {
                        this._editor.setSelection([]);
                        this._editor.repaint();
                    }
                    refreshSelection() {
                        this._editor.setSelection(this._editor.getSelection().filter(obj => {
                            if (obj instanceof Phaser.GameObjects.GameObject) {
                                return this._editor.getGameScene().sys.displayList.exists(obj);
                            }
                            return true;
                        }));
                    }
                    selectAll() {
                        const sel = this._editor.getGameScene().getDisplayListChildren();
                        this._editor.setSelection(sel);
                        this._editor.repaint();
                    }
                    updateOutlineSelection() {
                        const provider = this._editor.getOutlineProvider();
                        provider.setSelection(this._editor.getSelection(), true, true);
                        provider.repaint();
                    }
                    onMouseClick(e) {
                        const result = this.hitTestOfActivePointer();
                        let next = [];
                        if (result) {
                            const current = this._editor.getSelection();
                            const selected = result.pop();
                            if (e.ctrlKey || e.metaKey) {
                                if (new Set(current).has(selected)) {
                                    next = current.filter(obj => obj !== selected);
                                }
                                else {
                                    next = current;
                                    next.push(selected);
                                }
                            }
                            else {
                                next = [selected];
                            }
                        }
                        this._editor.setSelection(next);
                        this._editor.repaint();
                    }
                    hitTestOfActivePointer() {
                        const scene = this._editor.getGameScene();
                        const input = scene.input;
                        // const real = input["real_hitTest"];
                        // const fake = input["hitTest"];
                        // input["hitTest"] = real;
                        const result = input.hitTestPointer(scene.input.activePointer);
                        // input["hitTest"] = fake;
                        return result;
                    }
                }
                editor_5.SelectionManager = SelectionManager;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene_4.ui || (scene_4.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_6) {
                var commands;
                (function (commands) {
                    const CMD_JOIN_IN_CONTAINER = "joinObjectsInContainer";
                    function isSceneScope(args) {
                        return args.activePart instanceof editor_6.SceneEditor ||
                            args.activePart instanceof phasereditor2d.outline.ui.views.OutlineView && args.activeEditor instanceof editor_6.SceneEditor;
                    }
                    class SceneEditorCommands {
                        static registerCommands(manager) {
                            // select all
                            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_SELECT_ALL, args => args.activePart instanceof editor_6.SceneEditor, args => {
                                const editor = args.activeEditor;
                                editor.getSelectionManager().selectAll();
                            });
                            // clear selection
                            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_ESCAPE, isSceneScope, args => {
                                const editor = args.activeEditor;
                                editor.getSelectionManager().clearSelection();
                            });
                            // delete 
                            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_DELETE, isSceneScope, args => {
                                const editor = args.activeEditor;
                                editor.getActionManager().deleteObjects();
                            });
                            // join in container
                            manager.addCommandHelper(CMD_JOIN_IN_CONTAINER);
                            manager.addHandlerHelper(CMD_JOIN_IN_CONTAINER, args => isSceneScope(args), args => {
                                const editor = args.activeEditor;
                                editor.getActionManager().joinObjectsInContainer();
                            });
                            manager.addKeyBinding(CMD_JOIN_IN_CONTAINER, new colibri.ui.ide.commands.KeyMatcher({
                                key: "j"
                            }));
                        }
                    }
                    commands.SceneEditorCommands = SceneEditorCommands;
                })(commands = editor_6.commands || (editor_6.commands = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var outline;
                (function (outline) {
                    class GameObjectCellRenderer {
                        renderCell(args) {
                            const sprite = args.obj;
                            if (sprite instanceof ui.gameobjects.EditorImage) {
                                const { key, frame } = sprite.getEditorTexture();
                                const image = phasereditor2d.pack.core.parsers.ImageFrameParser.getSourceImageFrame(sprite.getEditorScene().game, key, frame);
                                if (image) {
                                    image.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);
                                }
                            }
                        }
                        cellHeight(args) {
                            if (args.obj instanceof ui.gameobjects.EditorImage) {
                                return args.viewer.getCellSize();
                            }
                            return colibri.ui.controls.ROW_HEIGHT;
                        }
                        async preload(args) {
                            const finder = new phasereditor2d.pack.core.PackFinder();
                            return finder.preload();
                        }
                    }
                    outline.GameObjectCellRenderer = GameObjectCellRenderer;
                })(outline = editor.outline || (editor.outline = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_7) {
                var outline;
                (function (outline) {
                    class SceneEditorOutlineContentProvider {
                        getRoots(input) {
                            const editor = input;
                            const displayList = editor.getGameScene().sys.displayList;
                            if (displayList) {
                                return [displayList];
                            }
                            return [];
                        }
                        getChildren(parent) {
                            if (parent instanceof Phaser.GameObjects.DisplayList) {
                                return parent.getChildren();
                            }
                            else if (parent instanceof Phaser.GameObjects.Container) {
                                return parent.list;
                            }
                            return [];
                        }
                    }
                    outline.SceneEditorOutlineContentProvider = SceneEditorOutlineContentProvider;
                })(outline = editor_7.outline || (editor_7.outline = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var outline;
                (function (outline) {
                    class SceneEditorOutlineLabelProvider {
                        getLabel(obj) {
                            if (obj instanceof Phaser.GameObjects.GameObject) {
                                return obj.getEditorLabel();
                            }
                            if (obj instanceof Phaser.GameObjects.DisplayList) {
                                return "Display List";
                            }
                            return "" + obj;
                        }
                    }
                    outline.SceneEditorOutlineLabelProvider = SceneEditorOutlineLabelProvider;
                })(outline = editor.outline || (editor.outline = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_8) {
                var outline;
                (function (outline) {
                    var controls = colibri.ui.controls;
                    var ide = colibri.ui.ide;
                    class SceneEditorOutlineProvider extends ide.EditorViewerProvider {
                        constructor(editor) {
                            super();
                            this._editor = editor;
                        }
                        getUndoManager() {
                            return this._editor.getUndoManager();
                        }
                        getContentProvider() {
                            return new outline.SceneEditorOutlineContentProvider();
                        }
                        getLabelProvider() {
                            return new outline.SceneEditorOutlineLabelProvider();
                        }
                        getCellRendererProvider() {
                            return new outline.SceneEditorOutlineRendererProvider(this._editor);
                        }
                        getTreeViewerRenderer(viewer) {
                            return new controls.viewers.TreeViewerRenderer(viewer, 48);
                        }
                        getPropertySectionProvider() {
                            return this._editor.getPropertyProvider();
                        }
                        getInput() {
                            return this._editor;
                        }
                        preload() {
                            return;
                        }
                        onViewerSelectionChanged(selection) {
                            this._editor.setSelection(selection, false);
                            this._editor.repaint();
                        }
                    }
                    outline.SceneEditorOutlineProvider = SceneEditorOutlineProvider;
                })(outline = editor_8.outline || (editor_8.outline = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_9) {
                var outline;
                (function (outline) {
                    var controls = colibri.ui.controls;
                    var ide = colibri.ui.ide;
                    class SceneEditorOutlineRendererProvider {
                        constructor(editor) {
                            this._editor = editor;
                            this._assetRendererProvider = new phasereditor2d.pack.ui.viewers.AssetPackCellRendererProvider("tree");
                        }
                        getCellRenderer(element) {
                            if (element instanceof ui.gameobjects.EditorImage) {
                                return new outline.GameObjectCellRenderer();
                            }
                            else if (element instanceof ui.gameobjects.EditorContainer) {
                                return new controls.viewers.IconImageCellRenderer(scene.ScenePlugin.getInstance().getIcon(scene.ICON_GROUP));
                            }
                            else if (element instanceof Phaser.GameObjects.DisplayList) {
                                return new controls.viewers.IconImageCellRenderer(controls.Controls.getIcon(ide.ICON_FOLDER));
                            }
                            return new controls.viewers.EmptyCellRenderer(false);
                        }
                        async preload(args) {
                            return controls.Controls.resolveNothingLoaded();
                        }
                    }
                    outline.SceneEditorOutlineRendererProvider = SceneEditorOutlineRendererProvider;
                })(outline = editor_9.outline || (editor_9.outline = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var properties;
                (function (properties) {
                    class SceneSection extends colibri.ui.controls.properties.PropertySection {
                    }
                    properties.SceneSection = SceneSection;
                })(properties = editor.properties || (editor.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./SceneSection.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var properties;
                (function (properties) {
                    class OriginSection extends properties.SceneSection {
                        constructor(page) {
                            super(page, "SceneEditor.OriginSection", "Origin", false);
                        }
                        createForm(parent) {
                            const comp = this.createGridElement(parent, 5);
                            // Position
                            {
                                this.createLabel(comp, "Origin");
                                // X
                                {
                                    this.createLabel(comp, "X");
                                    const text = this.createText(comp);
                                    this.addUpdater(() => {
                                        text.value = this.flatValues_Number(this.getSelection().map(obj => obj.originX));
                                    });
                                }
                                // y
                                {
                                    this.createLabel(comp, "Y");
                                    const text = this.createText(comp);
                                    this.addUpdater(() => {
                                        text.value = this.flatValues_Number(this.getSelection().map(obj => obj.originY));
                                    });
                                }
                            }
                        }
                        canEdit(obj, n) {
                            return obj instanceof ui.gameobjects.EditorImage;
                        }
                        canEditNumber(n) {
                            return n > 0;
                        }
                    }
                    properties.OriginSection = OriginSection;
                })(properties = editor.properties || (editor.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var properties;
                (function (properties) {
                    var controls = colibri.ui.controls;
                    class SceneEditorSectionProvider extends controls.properties.PropertySectionProvider {
                        addSections(page, sections) {
                            sections.push(new properties.VariableSection(page));
                            sections.push(new properties.TransformSection(page));
                            sections.push(new properties.OriginSection(page));
                            sections.push(new properties.TextureSection(page));
                        }
                    }
                    properties.SceneEditorSectionProvider = SceneEditorSectionProvider;
                })(properties = editor.properties || (editor.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var properties;
                (function (properties) {
                    var controls = colibri.ui.controls;
                    var ide = colibri.ui.ide;
                    class TextureSection extends properties.SceneSection {
                        constructor(page) {
                            super(page, "SceneEditor.TextureSection", "Texture", true);
                        }
                        createForm(parent) {
                            parent.classList.add("ImagePreviewFormArea", "PreviewBackground");
                            const imgControl = new controls.ImageControl(ide.IMG_SECTION_PADDING);
                            this.getPage().addEventListener(controls.EVENT_CONTROL_LAYOUT, (e) => {
                                imgControl.resizeTo();
                            });
                            parent.appendChild(imgControl.getElement());
                            setTimeout(() => imgControl.resizeTo(), 1);
                            this.addUpdater(() => {
                                const obj = this.getSelection()[0];
                                const { key, frame } = obj.getEditorTexture();
                                const finder = new phasereditor2d.pack.core.PackFinder();
                                finder.preload().then(() => {
                                    const img = finder.getAssetPackItemImage(key, frame);
                                    imgControl.setImage(img);
                                    setTimeout(() => imgControl.resizeTo(), 1);
                                });
                            });
                        }
                        canEdit(obj) {
                            return obj instanceof ui.gameobjects.EditorImage;
                        }
                        canEditNumber(n) {
                            return n === 1;
                        }
                    }
                    properties.TextureSection = TextureSection;
                })(properties = editor.properties || (editor.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var properties;
                (function (properties) {
                    class TransformSection extends properties.SceneSection {
                        constructor(page) {
                            super(page, "SceneEditor.TransformSection", "Transform", false);
                        }
                        createForm(parent) {
                            const comp = this.createGridElement(parent, 5);
                            // Position
                            {
                                this.createLabel(comp, "Position");
                                // X
                                {
                                    this.createLabel(comp, "X");
                                    const text = this.createText(comp);
                                    this.addUpdater(() => {
                                        text.value = this.flatValues_Number(this.getSelection().map(obj => obj.x));
                                    });
                                }
                                // y
                                {
                                    this.createLabel(comp, "Y");
                                    const text = this.createText(comp);
                                    this.addUpdater(() => {
                                        text.value = this.flatValues_Number(this.getSelection().map(obj => obj.y));
                                    });
                                }
                            }
                            // Scale
                            {
                                this.createLabel(comp, "Scale");
                                // X
                                {
                                    this.createLabel(comp, "X");
                                    const text = this.createText(comp);
                                    this.addUpdater(() => {
                                        text.value = this.flatValues_Number(this.getSelection().map(obj => obj.scaleX));
                                    });
                                }
                                // y
                                {
                                    this.createLabel(comp, "Y");
                                    const text = this.createText(comp);
                                    this.addUpdater(() => {
                                        text.value = this.flatValues_Number(this.getSelection().map(obj => obj.scaleY));
                                    });
                                }
                            }
                            // Angle
                            {
                                this.createLabel(comp, "Angle").style.gridColumnStart = "span 2";
                                const text = this.createText(comp);
                                this.addUpdater(() => {
                                    text.value = this.flatValues_Number(this.getSelection().map(obj => obj.angle));
                                });
                                this.createLabel(comp, "").style.gridColumnStart = "span 2";
                            }
                        }
                        canEdit(obj, n) {
                            return obj instanceof ui.gameobjects.EditorImage;
                        }
                        canEditNumber(n) {
                            return n > 0;
                        }
                    }
                    properties.TransformSection = TransformSection;
                })(properties = editor.properties || (editor.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./SceneSection.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var properties;
                (function (properties) {
                    class VariableSection extends properties.SceneSection {
                        constructor(page) {
                            super(page, "SceneEditor.VariableSection", "Variable", false);
                        }
                        createForm(parent) {
                            const comp = this.createGridElement(parent, 2);
                            {
                                // Name
                                this.createLabel(comp, "Name");
                                const text = this.createText(comp);
                                this.addUpdater(() => {
                                    text.value = this.flatValues_StringJoin(this.getSelection().map(obj => obj.getEditorLabel()));
                                });
                            }
                        }
                        canEdit(obj, n) {
                            return obj instanceof Phaser.GameObjects.GameObject;
                        }
                        canEditNumber(n) {
                            return n === 1;
                        }
                    }
                    properties.VariableSection = VariableSection;
                })(properties = editor.properties || (editor.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_10) {
                var undo;
                (function (undo) {
                    var ide = colibri.ui.ide;
                    class SceneEditorOperation extends ide.undo.Operation {
                        constructor(editor) {
                            super();
                            this._editor = editor;
                        }
                    }
                    undo.SceneEditorOperation = SceneEditorOperation;
                })(undo = editor_10.undo || (editor_10.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./SceneEditorOperation.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_5) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_11) {
                var undo;
                (function (undo) {
                    class AddObjectsOperation extends undo.SceneEditorOperation {
                        constructor(editor, objects) {
                            super(editor);
                            this._dataList = objects.map(obj => {
                                const data = {};
                                obj.writeJSON(data);
                                return data;
                            });
                        }
                        undo() {
                            const scene = this._editor.getGameScene();
                            for (const data of this._dataList) {
                                const obj = scene.getByEditorId(data.id);
                                if (obj) {
                                    obj.destroy();
                                }
                            }
                            this._editor.getSelectionManager().refreshSelection();
                            this.updateEditor();
                        }
                        redo() {
                            const maker = this._editor.getSceneMaker();
                            for (const data of this._dataList) {
                                maker.createObject(data);
                            }
                            this.updateEditor();
                        }
                        updateEditor() {
                            this._editor.setDirty(true);
                            this._editor.repaint();
                            this._editor.refreshOutline();
                        }
                    }
                    undo.AddObjectsOperation = AddObjectsOperation;
                })(undo = editor_11.undo || (editor_11.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene_5.ui || (scene_5.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_6) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_12) {
                var undo;
                (function (undo) {
                    class JoinObjectsInContainerOperation extends undo.SceneEditorOperation {
                        constructor(editor, container) {
                            super(editor);
                            this._containerId = container.getEditorId();
                            this._objectsIdList = container.list.map(obj => obj.getEditorId());
                        }
                        undo() {
                            const scene = this._editor.getGameScene();
                            const displayList = this._editor.getGameScene().sys.displayList;
                            const container = scene.getByEditorId(this._containerId);
                            for (const id of this._objectsIdList) {
                                const obj = ui.GameScene.findByEditorId(container.list, id);
                                if (obj) {
                                    container.remove(obj);
                                    displayList.add(obj);
                                }
                                else {
                                    console.error(`Undo: child with id=${id} not found in container ${this._containerId}`);
                                }
                            }
                            container.destroy();
                            this.updateEditor();
                        }
                        redo() {
                            const scene = this._editor.getGameScene();
                            const objects = this._objectsIdList.map(id => scene.getByEditorId(id));
                            const container = this._editor.getSceneMaker().createContainerWithObjects(objects);
                            container.setEditorId(this._containerId);
                            this.updateEditor();
                        }
                        updateEditor() {
                            this._editor.setDirty(true);
                            this._editor.refreshOutline();
                            this._editor.repaint();
                        }
                    }
                    undo.JoinObjectsInContainerOperation = JoinObjectsInContainerOperation;
                })(undo = editor_12.undo || (editor_12.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene_6.ui || (scene_6.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_13) {
                var undo;
                (function (undo) {
                    class RemoveObjectsOperation extends undo.AddObjectsOperation {
                        constructor(editor, objects) {
                            super(editor, objects);
                        }
                        undo() {
                            super.redo();
                        }
                        redo() {
                            super.undo();
                        }
                    }
                    undo.RemoveObjectsOperation = RemoveObjectsOperation;
                })(undo = editor_13.undo || (editor_13.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_7) {
        var ui;
        (function (ui) {
            var gameobjects;
            (function (gameobjects) {
                class EditorObjectMixin extends Phaser.GameObjects.GameObject {
                    getEditorId() {
                        return this.name;
                    }
                    ;
                    setEditorId(id) {
                        this.name = id;
                    }
                    ;
                    getEditorLabel() {
                        return this._label;
                    }
                    ;
                    setEditorLabel(label) {
                        this._label = label;
                    }
                    ;
                    getEditorScene() {
                        return this._scene;
                    }
                    ;
                    setEditorScene(scene) {
                        this._scene = scene;
                    }
                    ;
                }
                gameobjects.EditorObjectMixin = EditorObjectMixin;
            })(gameobjects = ui.gameobjects || (ui.gameobjects = {}));
        })(ui = scene_7.ui || (scene_7.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./EditorObjectMixin.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_8) {
        var ui;
        (function (ui) {
            var gameobjects;
            (function (gameobjects) {
                class EditorContainer extends Phaser.GameObjects.Container {
                    static add(scene, x, y, list) {
                        const container = new EditorContainer(scene, x, y, list);
                        scene.sys.displayList.add(container);
                        return container;
                    }
                    get list() {
                        return super.list;
                    }
                    set list(list) {
                        super.list = list;
                    }
                    writeJSON(data) {
                        data.type = "Container";
                        ui.json.ObjectComponent.write(this, data);
                        ui.json.VariableComponent.write(this, data);
                        ui.json.TransformComponent.write(this, data);
                        // container
                        data.list = this.list.map(obj => {
                            const objData = {};
                            obj.writeJSON(objData);
                            return objData;
                        });
                    }
                    ;
                    readJSON(data) {
                        ui.json.ObjectComponent.read(this, data);
                        ui.json.VariableComponent.read(this, data);
                        ui.json.TransformComponent.read(this, data);
                        // container
                        const parser = new ui.json.SceneParser(this.getEditorScene());
                        for (const objData of data.list) {
                            const sprite = parser.createObject(objData);
                            this.add(sprite);
                        }
                    }
                    ;
                    getScreenBounds(camera) {
                        return gameobjects.getContainerScreenBounds(this, camera);
                    }
                }
                gameobjects.EditorContainer = EditorContainer;
                colibri.lang.applyMixins(EditorContainer, [gameobjects.EditorObjectMixin]);
            })(gameobjects = ui.gameobjects || (ui.gameobjects = {}));
        })(ui = scene_8.ui || (scene_8.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./EditorObjectMixin.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_9) {
        var ui;
        (function (ui) {
            var gameobjects;
            (function (gameobjects) {
                class EditorImage extends Phaser.GameObjects.Image {
                    static add(scene, x, y, texture, frame) {
                        const sprite = new EditorImage(scene, x, y, texture, frame);
                        scene.sys.displayList.add(sprite);
                        return sprite;
                    }
                    writeJSON(data) {
                        data.type = "Image";
                        ui.json.ObjectComponent.write(this, data);
                        ui.json.VariableComponent.write(this, data);
                        ui.json.TransformComponent.write(this, data);
                        ui.json.TextureComponent.write(this, data);
                    }
                    ;
                    readJSON(data) {
                        ui.json.ObjectComponent.read(this, data);
                        ui.json.VariableComponent.read(this, data);
                        ui.json.TransformComponent.read(this, data);
                        ui.json.TextureComponent.read(this, data);
                    }
                    ;
                    getScreenBounds(camera) {
                        return gameobjects.getScreenBounds(this, camera);
                    }
                    setEditorTexture(key, frame) {
                        this.setData("textureKey", key);
                        this.setData("textureFrameKey", frame);
                    }
                    ;
                    getEditorTexture() {
                        return {
                            key: this.getData("textureKey"),
                            frame: this.getData("textureFrameKey")
                        };
                    }
                    ;
                }
                gameobjects.EditorImage = EditorImage;
                colibri.lang.applyMixins(EditorImage, [gameobjects.EditorObjectMixin]);
            })(gameobjects = ui.gameobjects || (ui.gameobjects = {}));
        })(ui = scene_9.ui || (scene_9.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var gameobjects;
            (function (gameobjects) {
                function getContainerScreenBounds(container, camera) {
                    if (container.list.length === 0) {
                        return [];
                    }
                    const minPoint = new Phaser.Math.Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
                    const maxPoint = new Phaser.Math.Vector2(Number.MIN_VALUE, Number.MIN_VALUE);
                    for (const obj of container.list) {
                        const bounds = obj.getScreenBounds(camera);
                        for (const point of bounds) {
                            minPoint.x = Math.min(minPoint.x, point.x);
                            minPoint.y = Math.min(minPoint.y, point.y);
                            maxPoint.x = Math.max(maxPoint.x, point.x);
                            maxPoint.y = Math.max(maxPoint.y, point.y);
                        }
                    }
                    return [
                        new Phaser.Math.Vector2(minPoint.x, minPoint.y),
                        new Phaser.Math.Vector2(maxPoint.x, minPoint.y),
                        new Phaser.Math.Vector2(maxPoint.x, maxPoint.y),
                        new Phaser.Math.Vector2(minPoint.x, maxPoint.y)
                    ];
                }
                gameobjects.getContainerScreenBounds = getContainerScreenBounds;
            })(gameobjects = ui.gameobjects || (ui.gameobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var gameobjects;
            (function (gameobjects) {
                function getScreenBounds(sprite, camera) {
                    const points = [
                        new Phaser.Math.Vector2(0, 0),
                        new Phaser.Math.Vector2(0, 0),
                        new Phaser.Math.Vector2(0, 0),
                        new Phaser.Math.Vector2(0, 0)
                    ];
                    let w = sprite.width;
                    let h = sprite.height;
                    if (sprite instanceof Phaser.GameObjects.BitmapText) {
                        // the BitmapText.width is considered a displayWidth, it is already multiplied by the scale
                        w = w / sprite.scaleX;
                        h = h / sprite.scaleY;
                    }
                    let flipX = sprite.flipX ? -1 : 1;
                    let flipY = sprite.flipY ? -1 : 1;
                    if (sprite instanceof Phaser.GameObjects.TileSprite) {
                        flipX = 1;
                        flipY = 1;
                    }
                    const ox = sprite.originX;
                    const oy = sprite.originY;
                    const x = -w * ox * flipX;
                    const y = -h * oy * flipY;
                    const tx = sprite.getWorldTransformMatrix();
                    tx.transformPoint(x, y, points[0]);
                    tx.transformPoint(x + w * flipX, y, points[1]);
                    tx.transformPoint(x + w * flipX, y + h * flipY, points[2]);
                    tx.transformPoint(x, y + h * flipY, points[3]);
                    return points.map(p => camera.getScreenPoint(p.x, p.y));
                }
                gameobjects.getScreenBounds = getScreenBounds;
            })(gameobjects = ui.gameobjects || (ui.gameobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var json;
            (function (json) {
                var write = colibri.core.json.write;
                var read = colibri.core.json.read;
                class ObjectComponent {
                    static write(sprite, data) {
                        write(data, "id", sprite.getEditorId());
                        write(data, "type", sprite.type);
                    }
                    static read(sprite, data) {
                        sprite.setEditorId(read(data, "id"));
                    }
                }
                json.ObjectComponent = ObjectComponent;
            })(json = ui.json || (ui.json = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_10) {
        var ui;
        (function (ui) {
            var json;
            (function (json) {
                class SceneParser {
                    constructor(scene) {
                        this._scene = scene;
                    }
                    static isValidSceneDataFormat(data) {
                        return "displayList" in data && Array.isArray(data.displayList);
                    }
                    createScene(data) {
                        this._scene.setSceneType(data.sceneType);
                        for (const objData of data.displayList) {
                            this.createObject(objData);
                        }
                    }
                    async createSceneCache_async(data) {
                        phasereditor2d.pack.core.parsers.ImageFrameParser.initSourceImageMap(this._scene.game);
                        for (const objData of data.displayList) {
                            await this.updateSceneCacheWithObjectData_async(objData);
                        }
                    }
                    async updateSceneCacheWithObjectData_async(objData) {
                        const type = objData.type;
                        switch (type) {
                            case "Image": {
                                const key = objData[json.TextureComponent.textureKey];
                                const finder = new phasereditor2d.pack.core.PackFinder();
                                await finder.preload();
                                const item = finder.findAssetPackItem(key);
                                if (item) {
                                    await this.addToCache_async(item);
                                }
                                break;
                            }
                            case "Container":
                                for (const childData of objData.list) {
                                    await this.updateSceneCacheWithObjectData_async(childData);
                                }
                                break;
                        }
                    }
                    async addToCache_async(data) {
                        let imageFrameContainerPackItem = null;
                        if (data instanceof phasereditor2d.pack.core.AssetPackItem) {
                            if (data instanceof phasereditor2d.pack.core.ImageFrameContainerAssetPackItem) {
                                imageFrameContainerPackItem = data;
                            }
                        }
                        else if (data instanceof phasereditor2d.pack.core.AssetPackImageFrame) {
                            imageFrameContainerPackItem = data.getPackItem();
                        }
                        if (imageFrameContainerPackItem !== null) {
                            await imageFrameContainerPackItem.preload();
                            await imageFrameContainerPackItem.preloadImages();
                            imageFrameContainerPackItem.addToPhaserCache(this._scene.game);
                        }
                    }
                    createObject(data) {
                        const type = data.type;
                        let sprite = null;
                        switch (type) {
                            case "Image":
                                sprite = ui.gameobjects.EditorImage.add(this._scene, 0, 0, "");
                                break;
                            case "Container":
                                sprite = ui.gameobjects.EditorContainer.add(this._scene, 0, 0, []);
                                break;
                        }
                        if (sprite) {
                            sprite.setEditorScene(this._scene);
                            sprite.readJSON(data);
                            SceneParser.initSprite(sprite);
                        }
                        return sprite;
                    }
                    static initSprite(sprite) {
                        sprite.setDataEnabled();
                        if (sprite instanceof ui.gameobjects.EditorImage) {
                            sprite.setInteractive();
                        }
                    }
                    static setNewId(sprite) {
                        sprite.setEditorId(Phaser.Utils.String.UUID());
                    }
                }
                json.SceneParser = SceneParser;
            })(json = ui.json || (ui.json = {}));
        })(ui = scene_10.ui || (scene_10.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_11) {
        var ui;
        (function (ui) {
            var json;
            (function (json_1) {
                class SceneWriter {
                    constructor(scene) {
                        this._scene = scene;
                    }
                    toJSON() {
                        const sceneData = {
                            sceneType: this._scene.getSceneType(),
                            displayList: [],
                            meta: {
                                app: "Phaser Editor 2D - Scene Editor",
                                url: "https://phasereditor2d.com",
                                contentType: scene_11.core.CONTENT_TYPE_SCENE
                            }
                        };
                        for (const obj of this._scene.getDisplayListChildren()) {
                            const objData = {};
                            obj.writeJSON(objData);
                            sceneData.displayList.push(objData);
                        }
                        return sceneData;
                    }
                    toString() {
                        const json = this.toJSON();
                        return JSON.stringify(json);
                    }
                }
                json_1.SceneWriter = SceneWriter;
            })(json = ui.json || (ui.json = {}));
        })(ui = scene_11.ui || (scene_11.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var json;
            (function (json) {
                var write = colibri.core.json.write;
                var read = colibri.core.json.read;
                class TextureComponent {
                    static write(sprite, data) {
                        const texture = sprite.getEditorTexture();
                        write(data, this.textureKey, texture.key);
                        write(data, this.frameKey, texture.frame);
                    }
                    static read(sprite, data) {
                        const key = read(data, this.textureKey);
                        const frame = read(data, this.frameKey);
                        sprite.setEditorTexture(key, frame);
                        sprite.setTexture(key, frame);
                    }
                }
                TextureComponent.textureKey = "textureKey";
                TextureComponent.frameKey = "frameKey";
                json.TextureComponent = TextureComponent;
            })(json = ui.json || (ui.json = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var json;
            (function (json) {
                var write = colibri.core.json.write;
                var read = colibri.core.json.read;
                class TransformComponent {
                    static write(sprite, data) {
                        write(data, "x", sprite.x, 0);
                        write(data, "y", sprite.y, 0);
                        write(data, "scaleX", sprite.scaleX, 1);
                        write(data, "scaleY", sprite.scaleY, 1);
                        write(data, "angle", sprite.angle, 0);
                    }
                    static read(sprite, data) {
                        sprite.x = read(data, "x", 0);
                        sprite.y = read(data, "y", 0);
                        sprite.scaleX = read(data, "scaleX", 1);
                        sprite.scaleY = read(data, "scaleY", 1);
                        sprite.angle = read(data, "angle", 0);
                    }
                }
                json.TransformComponent = TransformComponent;
            })(json = ui.json || (ui.json = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var json;
            (function (json) {
                var write = colibri.core.json.write;
                var read = colibri.core.json.read;
                class VariableComponent {
                    static write(sprite, data) {
                        write(data, "label", sprite.getEditorLabel());
                    }
                    static read(sprite, data) {
                        sprite.setEditorLabel(read(data, "label"));
                    }
                }
                json.VariableComponent = VariableComponent;
            })(json = ui.json || (ui.json = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                class SceneFileCellRenderer {
                    renderCell(args) {
                        const file = args.obj;
                        const image = ui.SceneThumbnailCache.getInstance().getContent(file);
                        if (image) {
                            image.paint(args.canvasContext, args.x, args.y, args.w, args.h, args.center);
                        }
                    }
                    cellHeight(args) {
                        return args.viewer.getCellSize();
                    }
                    async preload(args) {
                        const file = args.obj;
                        return ui.SceneThumbnailCache.getInstance().preload(file);
                    }
                }
                viewers.SceneFileCellRenderer = SceneFileCellRenderer;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
