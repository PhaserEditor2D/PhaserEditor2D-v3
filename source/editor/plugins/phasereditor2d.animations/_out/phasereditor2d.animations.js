var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        animations.CAT_ANIMATIONS = "phasereditor2d.animations.AnimationsCategory";
        animations.CMD_ADD_ANIMATION = "phasereditor2d.animations.AddAnimations";
        animations.CMD_APPEND_FRAMES = "phasereditor2d.animations.AppendFrames";
        animations.CMD_PREPEND_FRAMES = "phasereditor2d.animations.PrependFrames";
        class AnimationsPlugin extends colibri.Plugin {
            static _instance;
            _docs;
            static getInstance() {
                return this._instance ?? (this._instance = new AnimationsPlugin());
            }
            constructor() {
                super("phasereditor2d.animations");
            }
            async openAnimationInEditor(anim) {
                const animationsItem = anim.getParent();
                const file = animationsItem.getAnimationsFile();
                if (file) {
                    const editor = colibri.Platform.getWorkbench().openEditor(file);
                    if (editor instanceof animations.ui.editors.AnimationsEditor) {
                        editor.selectAnimationByKey(anim.getKey());
                    }
                }
            }
            getPhaserDocs() {
                if (!this._docs) {
                    this._docs = new phasereditor2d.ide.core.PhaserDocs(phasereditor2d.resources.ResourcesPlugin.getInstance(), "phasereditor2d.animations/docs/phaser-docs.json");
                }
                return this._docs;
            }
            registerExtensions(reg) {
                // editors
                reg.addExtension(new colibri.ui.ide.EditorExtension([
                    animations.ui.editors.AnimationsEditor.getFactory()
                ]));
                // new file wizards
                reg.addExtension(new animations.ui.dialogs.NewAnimationsFileExtension());
                // commands
                reg.addExtension(new colibri.ui.ide.commands.CommandExtension(manager => this.registerCommands(manager)));
                // asset pack preview extension
                reg.addExtension(new phasereditor2d.pack.ui.AssetPackPreviewPropertyProviderExtension(page => new animations.ui.editors.properties.AnimationInfoSection(page)));
                phasereditor2d.scene.ScenePlugin.getInstance().openAnimationInEditor = anim => {
                    return this.openAnimationInEditor(anim);
                };
            }
            registerCommands(manager) {
                const editorContext = (args) => args.activePart instanceof animations.ui.editors.AnimationsEditor ||
                    (args.activeEditor instanceof animations.ui.editors.AnimationsEditor &&
                        args.activePart instanceof phasereditor2d.outline.ui.views.OutlineView);
                manager.addCategory({
                    id: animations.CAT_ANIMATIONS,
                    name: "Sprite Animation"
                });
                // escape
                manager.addHandlerHelper(colibri.ui.ide.actions.CMD_ESCAPE, args => args.activePart instanceof animations.ui.editors.AnimationsEditor, args => {
                    args.activeEditor.deselectAll();
                });
                // delete
                manager.addHandlerHelper(colibri.ui.ide.actions.CMD_DELETE, args => editorContext(args) && args.activeEditor.getSelection().length > 0, args => {
                    args.activeEditor.deleteSelected();
                });
                // select all
                manager.addHandlerHelper(colibri.ui.ide.actions.CMD_SELECT_ALL, editorContext, args => args.activePart.selectAll());
                // add animation
                manager.add({
                    command: {
                        id: animations.CMD_ADD_ANIMATION,
                        category: animations.CAT_ANIMATIONS,
                        name: "Add Animation",
                        tooltip: "Add a new animation",
                        icon: colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_PLUS)
                    },
                    handler: {
                        testFunc: editorContext,
                        executeFunc: args => {
                            args.activeEditor.openAddAnimationDialog();
                        }
                    },
                    keys: {
                        key: "KeyA"
                    }
                });
                // add frames
                const testAppendFrames = (args) => editorContext(args)
                    && args.activeEditor.getSelection().length === 1
                    && args.activeEditor.getSelection()[0] instanceof Phaser.Animations.Animation;
                manager.add({
                    command: {
                        id: animations.CMD_PREPEND_FRAMES,
                        name: "Prepend Frames",
                        category: animations.CAT_ANIMATIONS,
                        tooltip: "Prepend frames to the selected animation."
                    },
                    handler: {
                        testFunc: testAppendFrames,
                        executeFunc: args => args.activeEditor.openAddFramesDialog("prepend")
                    }
                });
                manager.add({
                    command: {
                        id: animations.CMD_APPEND_FRAMES,
                        name: "Append Frames",
                        category: animations.CAT_ANIMATIONS,
                        tooltip: "Append frames to the selected animation."
                    },
                    handler: {
                        testFunc: testAppendFrames,
                        executeFunc: args => args.activeEditor.openAddFramesDialog("append")
                    }
                });
            }
        }
        animations.AnimationsPlugin = AnimationsPlugin;
        colibri.Platform.addPlugin(AnimationsPlugin.getInstance());
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                class NewAnimationsFileExtension extends phasereditor2d.files.ui.dialogs.NewFileContentExtension {
                    constructor() {
                        super({
                            dialogName: "Animations File",
                            dialogIconDescriptor: phasereditor2d.resources.getIconDescriptor(phasereditor2d.resources.ICON_ANIMATIONS),
                            fileExtension: "json",
                            initialFileName: "animations"
                        });
                    }
                    getCreateFileContentFunc() {
                        const model = new ui.editors.AnimationsModel();
                        const animsData = model.toJSON(undefined);
                        return _ => JSON.stringify(animsData, null, 4);
                    }
                }
                dialogs.NewAnimationsFileExtension = NewAnimationsFileExtension;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var controls = colibri.ui.controls;
                class AnimationsBuilder {
                    _editor;
                    _assets;
                    constructor(editor, assets) {
                        this._editor = editor;
                        this._assets = assets;
                    }
                    build() {
                        const dlg = new controls.dialogs.InputDialog();
                        dlg.create();
                        dlg.setTitle("Animations prefix");
                        dlg.setMessage("Enter a prefix to be inserted in the name of the new animations");
                        dlg.setInitialValue("");
                        dlg.setInputValidator(value => true);
                        dlg.setResultCallback((prefix) => {
                            this.autoBuild(prefix);
                        });
                    }
                    autoBuild(prependToName) {
                        const editor = this._editor;
                        const nameMaker = new colibri.ui.ide.utils.NameMaker((a) => a.key);
                        nameMaker.update(editor.getAnimations());
                        const clusters = this.buildClusters();
                        const animsArray = clusters.map(c => {
                            return {
                                key: nameMaker.makeName(prependToName + c.prefix),
                                frameRate: 24,
                                repeat: -1,
                                frames: c.elements.map(e => {
                                    const packFrame = e.data;
                                    const packItem = packFrame.getPackItem();
                                    if (packItem instanceof phasereditor2d.pack.core.ImageAssetPackItem) {
                                        return {
                                            key: packItem.getKey()
                                        };
                                    }
                                    return {
                                        key: packItem.getKey(),
                                        frame: packFrame.getName()
                                    };
                                })
                            };
                        });
                        const scene = editor.getScene();
                        const data = scene.anims.toJSON();
                        data.anims.push(...animsArray);
                        editor.fullResetDataOperation(data, async () => {
                            editor.setSelection(animsArray.map(a => editor.getAnimation(a.key)));
                            editor.getElement().focus();
                            colibri.Platform.getWorkbench().setActivePart(editor);
                        });
                    }
                    buildClusters() {
                        const labelProvider = this._editor
                            .getEditorViewerProvider(phasereditor2d.blocks.ui.views.BlocksView.EDITOR_VIEWER_PROVIDER_KEY)
                            .getLabelProvider();
                        const builder = new editors.NameClustersBuilder();
                        const used = new Set();
                        for (const elem of this._assets) {
                            let frames = [];
                            if (elem instanceof phasereditor2d.pack.core.ImageFrameContainerAssetPackItem) {
                                frames = elem.getFrames();
                            }
                            else if (elem instanceof phasereditor2d.pack.core.AssetPackImageFrame) {
                                frames = [elem];
                            }
                            for (const frame of frames) {
                                {
                                    const id = frame.getPackItem().getKey() + "$" + frame.getName();
                                    if (used.has(id)) {
                                        continue;
                                    }
                                    used.add(id);
                                }
                                let name = typeof frame.getName() === "string" ?
                                    frame.getName() :
                                    frame.getPackItem().getKey() + "-" + frame.getName();
                                if (frame.getPackItem() instanceof phasereditor2d.pack.core.SpritesheetAssetPackItem) {
                                    name = frame.getPackItem().getKey() + "-" + labelProvider.getLabel(frame.getName());
                                }
                                const lowerName = name.toLowerCase();
                                for (const ext of [".png", ".jpg", ".bmp", ".gif", ".webp"]) {
                                    if (lowerName.endsWith(ext)) {
                                        name = name.substring(0, name.length - ext.length);
                                    }
                                }
                                builder.addElement({
                                    name: name,
                                    data: frame
                                });
                            }
                        }
                        return builder.build();
                    }
                }
                editors.AnimationsBuilder = AnimationsBuilder;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var BaseCodeGenerator = phasereditor2d.ide.core.code.BaseCodeGenerator;
                class AnimationsCompiler extends BaseCodeGenerator {
                    _typeName;
                    _model;
                    constructor(model) {
                        super();
                        this._model = model;
                    }
                    async compileFile(animsFile, tsFile) {
                        this._typeName = animsFile.getNameWithoutExtension();
                        this._typeName = "T" + this._typeName[0].toUpperCase() + this._typeName.substring(1);
                        const replace = await colibri.ui.ide.FileUtils.preloadAndGetFileString(tsFile);
                        const newContent = this.generate(replace);
                        await colibri.ui.ide.FileUtils.setFileString_async(tsFile, newContent);
                    }
                    internalGenerate() {
                        const anims = this._model.getModelData().anims;
                        const keys = anims.map(a => a.key);
                        this.line("// The constants with the animation keys.");
                        for (const key of keys) {
                            this.line();
                            if (this._model.esModule) {
                                this.append("export ");
                            }
                            const varname = "ANIM_" + this.formatVariableName(key).toUpperCase();
                            this.line(`const ${varname} = "${key}";`);
                        }
                    }
                }
                editors.AnimationsCompiler = AnimationsCompiler;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var controls = colibri.ui.controls;
                class AnimationsEditor extends colibri.ui.ide.FileEditor {
                    static ID = "phasereditor2d.animations.ui.editors.AnimationsEditor";
                    static _factory;
                    _gameCanvas;
                    _scene;
                    _game;
                    _sceneRead;
                    _gameBooted;
                    _overlayLayer;
                    _outlineProvider;
                    _blocksProvider;
                    _propertiesProvider;
                    _selectedAnimations;
                    _currentDependenciesHash;
                    _menuCreator;
                    _model;
                    _editorReady = false;
                    _selectAnimationKeyOnBoot;
                    static getFactory() {
                        return this._factory ?? (this._factory = new colibri.ui.ide.ContentTypeEditorFactory("Animations Editor", phasereditor2d.pack.core.contentTypes.CONTENT_TYPE_ANIMATIONS, () => new AnimationsEditor()));
                    }
                    constructor() {
                        super(AnimationsEditor.ID, AnimationsEditor.getFactory());
                        this.addClass("AnimationsEditor");
                        this._outlineProvider = new editors.AnimationsEditorOutlineProvider(this);
                        this._blocksProvider = new editors.AnimationsEditorBlocksProvider(this);
                        this._propertiesProvider = new editors.properties.AnimationsEditorPropertyProvider();
                        this._selectedAnimations = [];
                        this._model = new editors.AnimationsModel();
                    }
                    getModel() {
                        return this._model;
                    }
                    async doSave() {
                        const animsData = this._scene.anims.toJSON();
                        this._model.setJSONAnimations(animsData);
                        const animsFile = this.getInput();
                        await this._model.writeFile(animsFile, this.getScene().getMaker().getPackFinder());
                        this.setDirty(false);
                        await this.compile();
                    }
                    async compile() {
                        if (!this._model.generateCode) {
                            return;
                        }
                        const animsFile = this.getInput();
                        const fileExt = this._model.sourceLang === phasereditor2d.ide.core.code.SourceLang.JAVA_SCRIPT ? "js" : "ts";
                        const tsFileName = `${animsFile.getNameWithoutExtension()}.${fileExt}`;
                        const outputFolderName = this._model.outputFolder || animsFile.getParent().getFullName();
                        const outputFolder = colibri.ui.ide.FileUtils.getFileFromPath(outputFolderName);
                        if (outputFolder) {
                            let tsFile = outputFolder.getFile(tsFileName);
                            if (!tsFile) {
                                tsFile = await colibri.ui.ide.FileUtils.createFile_async(outputFolder, tsFileName, "");
                            }
                            const generator = new editors.AnimationsCompiler(this._model);
                            await generator.compileFile(animsFile, tsFile);
                        }
                        else {
                            alert("Animations compiler: invalid output folder.");
                        }
                    }
                    openAddFramesDialog(cmd) {
                        this.openSelectFramesDialog(async (frames) => {
                            const data = this.getScene().anims.toJSON();
                            const animData = data.anims.find(a => a.key === this.getSelection()[0].key);
                            for (const frame of frames) {
                                const frameData = {
                                    key: frame.getPackItem().getKey()
                                };
                                if (!(frame.getPackItem() instanceof phasereditor2d.pack.core.ImageAssetPackItem)) {
                                    frameData["frame"] = frame.getName();
                                }
                                if (cmd === "append") {
                                    animData.frames.push(frameData);
                                }
                                else {
                                    animData.frames.splice(0, 0, frameData);
                                }
                            }
                            this.fullResetDataOperation(data);
                        });
                    }
                    async onEditorInputContentChangedByExternalEditor() {
                        console.log("onEditorInputContentChangedByExternalEditor");
                        const str = colibri.ui.ide.FileUtils.getFileString(this.getInput());
                        const data = JSON.parse(str);
                        this.fullReset(data, false);
                    }
                    async fullReset(data, useAnimationIndexAsKey) {
                        const scene = this.getScene();
                        scene.removeAll();
                        const maker = scene.getMaker();
                        await maker.preload();
                        this._overlayLayer.setLoading(true);
                        await maker.updateSceneLoader(data, this._overlayLayer.createLoadingMonitor());
                        this._overlayLayer.setLoading(false);
                        this.reset(data, useAnimationIndexAsKey);
                        await this.updateDependenciesHash();
                    }
                    getScene() {
                        return this._scene;
                    }
                    getOverlayLayer() {
                        return this._overlayLayer;
                    }
                    selectAll() {
                        this.setSelection(this.getAnimations());
                    }
                    deselectAll() {
                        this.setSelection([this._model]);
                        this.refreshOutline();
                    }
                    deleteSelected() {
                        const selectedFrames = new Set();
                        const selectedParentAnimations = new Set();
                        const selectedAnimations = new Set(this.getSelection().filter(a => a instanceof Phaser.Animations.Animation));
                        for (const obj of this.getSelection()) {
                            if (obj instanceof Phaser.Animations.AnimationFrame) {
                                const anim = AnimationsEditor.getAnimationOfAFrame(obj);
                                if (!selectedAnimations.has(anim)) {
                                    selectedFrames.add(obj);
                                    selectedParentAnimations.add(anim);
                                }
                            }
                        }
                        let exitMethod = false;
                        for (const anim of selectedParentAnimations) {
                            const found = anim.frames.find(frame => !selectedFrames.has(frame));
                            if (!found && !selectedAnimations.has(anim)) {
                                alert(`Cannot delete all frames of the animation "${anim.key}".`);
                                exitMethod = true;
                            }
                        }
                        if (exitMethod) {
                            return;
                        }
                        this.runOperation(() => {
                            this.setDirty(true);
                            for (const obj of this.getSelection()) {
                                if (obj instanceof Phaser.Animations.Animation) {
                                    const sprite = this.getSpriteForAnimation(obj);
                                    sprite.destroy();
                                    this.getScene().anims.remove(obj.key);
                                }
                            }
                            for (const obj of this.getSelection()) {
                                if (obj instanceof Phaser.Animations.AnimationFrame) {
                                    const anim = AnimationsEditor.getAnimationOfAFrame(obj);
                                    anim.removeFrame(obj);
                                }
                            }
                        });
                    }
                    createEditorToolbar(parent) {
                        const manager = new controls.ToolbarManager(parent);
                        manager.addCommand(animations.CMD_ADD_ANIMATION);
                        return manager;
                    }
                    openSelectFramesDialog(selectFramesCallback) {
                        const viewer = new controls.viewers.TreeViewer("phasereditor2d.animations.ui.editors.AnimationsEditor.SelectFrames");
                        viewer.setLabelProvider(this._blocksProvider.getLabelProvider());
                        viewer.setContentProvider(this._blocksProvider.getContentProvider());
                        viewer.setCellRendererProvider(this._blocksProvider.getCellRendererProvider());
                        viewer.setTreeRenderer(this._blocksProvider.getTreeViewerRenderer(viewer));
                        viewer.setInput(this._blocksProvider.getInput());
                        viewer.expandRoots();
                        const dlg = new controls.dialogs.ViewerDialog(viewer, true);
                        dlg.setSize(1000, 700);
                        dlg.create();
                        dlg.setTitle("Select Frames");
                        dlg.addOpenButton("Select", sel => {
                            const frames = [];
                            const used = new Set();
                            for (const elem of sel) {
                                let elemFrames;
                                if (elem instanceof phasereditor2d.pack.core.ImageFrameContainerAssetPackItem) {
                                    elemFrames = elem.getFrames();
                                }
                                else {
                                    elemFrames = [elem];
                                }
                                for (const frame of elemFrames) {
                                    const id = frame.getPackItem().getKey() + "$" + frame.getName();
                                    if (used.has(id)) {
                                        continue;
                                    }
                                    used.add(id);
                                    frames.push(frame);
                                }
                            }
                            selectFramesCallback(frames);
                        });
                        dlg.addCancelButton();
                    }
                    openAddAnimationDialog() {
                        const dlg = new controls.dialogs.InputDialog();
                        dlg.create();
                        dlg.setTitle("New Animation");
                        dlg.setMessage("Enter the animation name");
                        dlg.setInputValidator(name => {
                            if (name.trim().length === 0) {
                                return false;
                            }
                            const found = this.getAnimation(name);
                            return found === null || found === undefined;
                        });
                        dlg.setInitialValue("animation");
                        dlg.validate();
                        dlg.setResultCallback(name => {
                            this.openSelectFramesDialog(frames => {
                                const animData = {
                                    key: name,
                                    frameRate: 24,
                                    repeat: -1,
                                    delay: 0,
                                    frames: frames.map(frame => {
                                        const packItem = frame.getPackItem();
                                        if (packItem instanceof phasereditor2d.pack.core.ImageAssetPackItem) {
                                            return {
                                                key: packItem.getKey()
                                            };
                                        }
                                        return {
                                            key: packItem.getKey(),
                                            frame: frame.getName()
                                        };
                                    })
                                };
                                const data = this.getScene().anims.toJSON();
                                data.anims.push(animData);
                                this.fullResetDataOperation(data, () => {
                                    this.setSelection([this.getAnimation(name)]);
                                    this.getElement().focus();
                                    colibri.Platform.getWorkbench().setActivePart(this);
                                });
                            });
                        });
                    }
                    createPart() {
                        this.setLayoutChildren(false);
                        const container = document.createElement("div");
                        container.classList.add("AnimationsEditorContainer");
                        this.getElement().appendChild(container);
                        this._overlayLayer = new editors.AnimationsOverlayLayer(this);
                        container.appendChild(this._overlayLayer.getCanvas());
                        this._gameCanvas = phasereditor2d.scene.ScenePlugin.getInstance().getCanvasManager().takeCanvas();
                        this._gameCanvas.style.visibility = "hidden";
                        this._gameCanvas.style.position = "absolute";
                        this._gameCanvas.tabIndex = 1;
                        container.appendChild(this._gameCanvas);
                        this.createGame();
                        this.registerMenu();
                        this.registerDropListeners();
                    }
                    registerDropListeners() {
                        // canvas can be reused, don't use it for events
                        const eventElement = this._gameCanvas.parentElement;
                        eventElement.addEventListener("dragover", e => {
                            const dataArray = controls.Controls.getApplicationDragData();
                            for (const elem of dataArray) {
                                if (elem instanceof phasereditor2d.pack.core.ImageFrameContainerAssetPackItem
                                    || elem instanceof phasereditor2d.pack.core.AssetPackImageFrame) {
                                    e.preventDefault();
                                    return;
                                }
                            }
                        });
                        eventElement.addEventListener("drop", e => {
                            e.preventDefault();
                            const data = controls.Controls.getApplicationDragData();
                            const builder = new editors.AnimationsBuilder(this, data);
                            builder.build();
                        });
                    }
                    registerMenu() {
                        this._menuCreator = new editors.AnimationsEditorMenuCreator(this);
                        // canvas can be reused, don't use it for events
                        const eventElement = this._gameCanvas.parentElement;
                        eventElement.addEventListener("contextmenu", e => this.onMenu(e));
                    }
                    onMenu(e) {
                        e.preventDefault();
                        const menu = new controls.Menu();
                        this.fillMenu(menu);
                        menu.createWithEvent(e);
                    }
                    fillMenu(menu) {
                        this._menuCreator.fillMenu(menu);
                    }
                    createGame() {
                        this._scene = new editors.AnimationsScene(this);
                        this._game = new Phaser.Game({
                            type: phasereditor2d.scene.ScenePlugin.DEFAULT_EDITOR_CANVAS_CONTEXT,
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
                            scene: this._scene,
                        });
                        this._sceneRead = false;
                        this._gameBooted = false;
                        this._game.config.postBoot = () => {
                            // the scene is created just at this moment!
                            this.onGameBoot();
                        };
                    }
                    async onGameBoot() {
                        this._gameBooted = true;
                        this._gameCanvas.style.visibility = "visible";
                        if (!this._sceneRead) {
                            await this.readScene();
                        }
                        this.layout();
                        this.refreshOutline();
                        let selection = [];
                        if (this._selectAnimationKeyOnBoot) {
                            const anims = this.getAnimations();
                            if (anims) {
                                selection = anims.filter(a => a.key === this._selectAnimationKeyOnBoot);
                            }
                        }
                        this.setSelection(selection);
                        this._editorReady = true;
                    }
                    async readScene() {
                        const maker = this._scene.getMaker();
                        this._sceneRead = true;
                        try {
                            const file = this.getInput();
                            this._model = new editors.AnimationsModel();
                            await this._model.readFile(file);
                            const data = this._model.getModelData();
                            this._overlayLayer.setLoading(true);
                            this._overlayLayer.render();
                            await maker.preload();
                            await maker.updateSceneLoader(data, this._overlayLayer.createLoadingMonitor());
                            const errors = [];
                            maker.createScene(data, errors);
                            this._overlayLayer.setLoading(false);
                            if (errors.length > 0) {
                                alert(errors.join("<br>"));
                            }
                        }
                        catch (e) {
                            alert(e.message);
                            throw e;
                        }
                        this._currentDependenciesHash = await this.getScene().getMaker().buildDependenciesHash();
                    }
                    refreshOutline() {
                        this._outlineProvider.repaint();
                    }
                    async refreshBlocks() {
                        await this._blocksProvider.preload();
                        this._blocksProvider.repaint();
                    }
                    repaint() {
                        this._overlayLayer.render();
                    }
                    layout() {
                        super.layout();
                        if (!this._game) {
                            return;
                        }
                        this._overlayLayer.resizeTo();
                        const parent = this._gameCanvas.parentElement;
                        const w = parent.clientWidth;
                        const h = parent.clientHeight;
                        this._game.scale.resize(w, h);
                        if (this._gameBooted) {
                            this._scene.getCamera().setSize(w, h);
                        }
                    }
                    onPartClosed() {
                        if (super.onPartClosed()) {
                            if (this._scene) {
                                this._scene.destroyGame();
                            }
                            return true;
                        }
                        return false;
                    }
                    onPartDeactivated() {
                        super.onPartActivated();
                        if (colibri.Platform.getWorkbench().getActiveEditor() !== this) {
                            if (this._game.loop) {
                                this._game.loop.stop();
                            }
                        }
                    }
                    async onPartActivated() {
                        super.onPartActivated();
                        if (this._gameBooted) {
                            if (!this._game.loop.running) {
                                this._game.loop.start(this._game.loop.callback);
                            }
                            this.updateIfDependenciesChanged();
                            this.refreshBlocks();
                            if (this.getSelection() && this.getSelection().length === 0) {
                                this.setSelection([this._model]);
                            }
                        }
                    }
                    async updateDependenciesHash() {
                        const hash = await this.getScene().getMaker().buildDependenciesHash();
                        this._currentDependenciesHash = hash;
                    }
                    async updateIfDependenciesChanged() {
                        const hash = await this.getScene().getMaker().buildDependenciesHash();
                        if (hash !== this._currentDependenciesHash) {
                            this._currentDependenciesHash = hash;
                            const data = this.getScene().anims.toJSON();
                            this.fullReset(data, false);
                        }
                    }
                    getPropertyProvider() {
                        return this._propertiesProvider;
                    }
                    getEditorViewerProvider(key) {
                        if (key === phasereditor2d.outline.ui.views.OutlineView.EDITOR_VIEWER_PROVIDER_KEY) {
                            return this._outlineProvider;
                        }
                        else if (key === phasereditor2d.blocks.ui.views.BlocksView.EDITOR_VIEWER_PROVIDER_KEY) {
                            return this._blocksProvider;
                        }
                        return null;
                    }
                    async fullResetDataOperation(data, op) {
                        const before = editors.AnimationsEditorSnapshotOperation.takeSnapshot(this);
                        await this.fullReset(data, false);
                        if (op) {
                            await op();
                        }
                        const after = editors.AnimationsEditorSnapshotOperation.takeSnapshot(this);
                        this.getUndoManager().add(new editors.AnimationsEditorSnapshotOperation(this, before, after, false));
                    }
                    runOperation(op, useAnimationIndexAsKey = false) {
                        const before = editors.AnimationsEditorSnapshotOperation.takeSnapshot(this);
                        op();
                        const after = editors.AnimationsEditorSnapshotOperation.takeSnapshot(this);
                        this.getUndoManager().add(new editors.AnimationsEditorSnapshotOperation(this, before, after, useAnimationIndexAsKey));
                    }
                    runSettingsOperation(op) {
                        // TODO: implements the undo operation
                        op();
                        this.setDirty(true);
                    }
                    computeSelectedAnimations() {
                        const used = new Set();
                        const list = [];
                        for (const obj of this.getSelection()) {
                            let anim;
                            if (obj instanceof Phaser.Animations.Animation) {
                                anim = obj;
                            }
                            else {
                                const frame = obj;
                                anim = AnimationsEditor.getAnimationOfAFrame(frame);
                            }
                            if (anim && !used.has(anim)) {
                                used.add(anim);
                                list.push(anim);
                            }
                        }
                        return list;
                    }
                    selectAnimationByKey(animationKey) {
                        if (this._editorReady) {
                            this.setSelection(this.getAnimations().filter(a => a.key === animationKey));
                        }
                        else {
                            this._selectAnimationKeyOnBoot = animationKey;
                        }
                    }
                    getAnimations() {
                        return this._scene.anims["anims"].getArray();
                    }
                    getSpriteForAnimation(animation) {
                        return this.getScene().getSprites().find(sprite => sprite.anims.currentAnim === animation);
                    }
                    setSelection(sel, notify = true) {
                        super.setSelection(sel, notify);
                        this._selectedAnimations = this.computeSelectedAnimations();
                    }
                    getSelectedAnimations() {
                        return this._selectedAnimations;
                    }
                    getAnimation(key) {
                        return this.getScene().anims.get(key);
                    }
                    getAnimationFrame(animKey, frameTextureKey, frameTextureFrame) {
                        const anim = this.getAnimation(animKey);
                        if (anim) {
                            return anim.frames.find(f => f.textureKey === frameTextureKey && f.textureFrame === frameTextureFrame);
                        }
                        return undefined;
                    }
                    static getAnimationOfAFrame(obj) {
                        return obj["__animation"];
                    }
                    static setAnimationToFrame(frame, anim) {
                        frame["__animation"] = anim;
                    }
                    reset(animsData, useAnimationIndexAsKey) {
                        this._model.setJSONAnimations(animsData);
                        let selectedIndexes;
                        let selectedKeys;
                        if (useAnimationIndexAsKey) {
                            const allAnimations = this.getAnimations();
                            selectedIndexes = this.getSelectedAnimations().map(anim => allAnimations.indexOf(anim));
                        }
                        else {
                            selectedKeys = this.getSelectedAnimations().map(anim => anim.key);
                        }
                        const scene = this.getScene();
                        scene.removeAll();
                        scene.getMaker().createScene(animsData);
                        this.refreshOutline();
                        this.refreshBlocks();
                        if (useAnimationIndexAsKey) {
                            const allAnimations = this.getAnimations();
                            this.setSelection(selectedIndexes.map(i => allAnimations[i]));
                        }
                        else {
                            const newAnimations = selectedKeys.map(key => {
                                return this.getAnimation(key);
                            }).filter(o => {
                                return o !== undefined && o !== null;
                            });
                            this.setSelection(newAnimations);
                        }
                        // I do this here because the Inspector view at this moment
                        // is not listening the selection changes.
                        // It is like that because the active view is the Inspector
                        // view itself but the selection changed in the editor
                        colibri.inspector.ui.views.InspectorView.updateInspectorView(this.getSelection());
                    }
                }
                editors.AnimationsEditor = AnimationsEditor;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                const grouping = phasereditor2d.pack.ui.viewers.AssetPackGrouping;
                var io = colibri.core.io;
                const PACK_ITEM_TYPES = new Set([
                    phasereditor2d.pack.core.IMAGE_TYPE,
                    phasereditor2d.pack.core.SVG_TYPE,
                    phasereditor2d.pack.core.ATLAS_TYPE,
                    phasereditor2d.pack.core.ATLAS_XML_TYPE,
                    phasereditor2d.pack.core.MULTI_ATLAS_TYPE,
                    phasereditor2d.pack.core.UNITY_ATLAS_TYPE,
                    phasereditor2d.pack.core.SPRITESHEET_TYPE,
                    phasereditor2d.pack.core.BITMAP_FONT_TYPE
                ]);
                class AnimationsEditorBlocksContentProvider extends phasereditor2d.pack.ui.viewers.AssetPackContentProvider {
                    _getPacks;
                    _editor;
                    constructor(sceneEditor, getPacks) {
                        super();
                        this._getPacks = getPacks;
                        this._editor = sceneEditor;
                    }
                    getPackItems() {
                        return this._getPacks()
                            .flatMap(pack => this.filterItems(pack));
                    }
                    filterItems(pack) {
                        return pack.getItems().filter(i => PACK_ITEM_TYPES.has(i.getType()));
                    }
                    getRoots_(input) {
                        return [
                            phasereditor2d.pack.core.ATLAS_TYPE,
                            phasereditor2d.pack.core.SPRITESHEET_TYPE,
                            phasereditor2d.pack.core.IMAGE_TYPE,
                        ];
                    }
                    getRoots(input) {
                        const type = grouping.getGroupingPreference();
                        switch (type) {
                            case grouping.GROUP_ASSETS_BY_TYPE:
                                return [
                                    phasereditor2d.pack.core.ATLAS_TYPE,
                                    phasereditor2d.pack.core.SPRITESHEET_TYPE,
                                    phasereditor2d.pack.core.IMAGE_TYPE,
                                    phasereditor2d.pack.core.SVG_TYPE
                                ];
                            case grouping.GROUP_ASSETS_BY_PACK:
                                return phasereditor2d.pack.core.AssetPackUtils.distinct(this.getPackItems().map(i => i.getPack()));
                            case grouping.GROUP_ASSETS_BY_LOCATION:
                                return colibri.ui.ide.FileUtils.distinct([
                                    ...grouping.getAssetsFolders(this.getPackItems().map(i => i.getPack()))
                                ]);
                        }
                        return [];
                    }
                    getChildren(parent) {
                        if (parent === phasereditor2d.pack.core.ATLAS_TYPE) {
                            return this.getPackItems()
                                .filter(item => phasereditor2d.pack.core.AssetPackUtils.isAtlasType(item.getType()));
                        }
                        if (PACK_ITEM_TYPES.has(parent)) {
                            return this.getPackItems()
                                .filter(item => item.getType() === parent);
                        }
                        if (parent instanceof io.FilePath) {
                            return this.getPackItems().filter(i => grouping.getItemFolder(i) === parent);
                        }
                        return super.getChildren(parent)
                            .filter(obj => !(obj instanceof phasereditor2d.pack.core.AssetPackItem) || PACK_ITEM_TYPES.has(obj.getType()));
                    }
                }
                editors.AnimationsEditorBlocksContentProvider = AnimationsEditorBlocksContentProvider;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                class AnimationsEditorBlocksProvider extends phasereditor2d.pack.ui.viewers.AbstractAssetPackClientBlocksProvider {
                    constructor(editor) {
                        super(editor);
                    }
                    fillContextMenu(menu) {
                        phasereditor2d.pack.ui.viewers.AssetPackGrouping.fillMenu(menu, () => this.repaint(true));
                    }
                    async preloadAndGetFinder(complete) {
                        const finder = new phasereditor2d.pack.core.PackFinder();
                        await finder.preload();
                        return finder;
                    }
                    getContentProvider() {
                        return new editors.AnimationsEditorBlocksContentProvider(this.getEditor(), () => this.getPacks());
                    }
                    getTreeViewerRenderer(viewer) {
                        return new phasereditor2d.pack.ui.viewers.AssetPackTreeViewerRenderer(viewer, false);
                    }
                    getPropertySectionProvider() {
                        return this.getEditor().getPropertyProvider();
                    }
                    getInput() {
                        return this.getPacks();
                    }
                }
                editors.AnimationsEditorBlocksProvider = AnimationsEditorBlocksProvider;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                class AnimationsEditorMenuCreator {
                    _editor;
                    constructor(editor) {
                        this._editor = editor;
                    }
                    fillMenu(menu) {
                        menu.addCommand(animations.CMD_ADD_ANIMATION);
                        menu.addSeparator();
                        menu.addCommand(animations.CMD_PREPEND_FRAMES);
                        menu.addCommand(animations.CMD_APPEND_FRAMES);
                        menu.addSeparator();
                        menu.addCommand(colibri.ui.ide.actions.CMD_SELECT_ALL);
                        menu.addCommand(colibri.ui.ide.actions.CMD_UNDO);
                        menu.addCommand(colibri.ui.ide.actions.CMD_REDO);
                        menu.addSeparator();
                        menu.addCommand(colibri.ui.ide.actions.CMD_DELETE);
                    }
                }
                editors.AnimationsEditorMenuCreator = AnimationsEditorMenuCreator;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var controls = colibri.ui.controls;
                class AnimationsEditorOutlineCellRendererProvider {
                    _editor;
                    constructor(editor) {
                        this._editor = editor;
                    }
                    getCellRenderer(element) {
                        if (element instanceof Phaser.Animations.Animation) {
                            return new editors.EditorAnimationCellRenderer(this._editor);
                        }
                        else if (element instanceof Phaser.Animations.AnimationFrame) {
                            const image = this._editor.getScene().getMaker().getPackFinder()
                                .getAssetPackItemImage(element.textureKey, element.textureFrame);
                            if (image) {
                                return new controls.viewers.ImageCellRenderer(image);
                            }
                            return new controls.viewers.EmptyCellRenderer(false);
                        }
                        return new controls.viewers.EmptyCellRenderer();
                    }
                    async preload(args) {
                        return controls.PreloadResult.NOTHING_LOADED;
                    }
                }
                editors.AnimationsEditorOutlineCellRendererProvider = AnimationsEditorOutlineCellRendererProvider;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                class AnimationsEditorOutlineContentProvider {
                    getRoots(input) {
                        const editor = input;
                        const scene = editor.getScene();
                        if (scene) {
                            const manager = scene.anims;
                            return manager ? manager["anims"].getArray() : [];
                        }
                        return [];
                    }
                    getChildren(parent) {
                        if (parent instanceof Phaser.Animations.Animation) {
                            return parent.frames;
                        }
                        return [];
                    }
                }
                editors.AnimationsEditorOutlineContentProvider = AnimationsEditorOutlineContentProvider;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var controls = colibri.ui.controls;
                class AnimationsEditorOutlineProvider extends colibri.ui.ide.EditorViewerProvider {
                    _editor;
                    constructor(editor) {
                        super();
                        this._editor = editor;
                        this._editor.eventSelectionChanged.addListener(sel => {
                            this.setSelection(sel, true, false);
                        });
                    }
                    prepareViewerState(state) {
                        if (state.expandedObjects) {
                            state.expandedObjects = new Set([...state.expandedObjects]
                                .map(o => this._editor.getAnimation(o.key))
                                .filter(o => o !== null && o !== undefined));
                        }
                    }
                    onViewerSelectionChanged(sel) {
                        this._editor.setSelection(sel, false);
                    }
                    getContentProvider() {
                        return new editors.AnimationsEditorOutlineContentProvider();
                    }
                    getLabelProvider() {
                        return new controls.viewers.LabelProvider(obj => {
                            if (obj instanceof Phaser.Animations.Animation) {
                                return obj.key;
                            }
                            else if (obj instanceof Phaser.Animations.AnimationFrame) {
                                try {
                                    const finder = this._editor.getScene().getMaker().getPackFinder();
                                    const image = finder.getAssetPackItemImage(obj.textureKey, obj.textureFrame);
                                    if (image.getPackItem() instanceof phasereditor2d.pack.core.ImageAssetPackItem
                                        || obj.textureFrame === undefined
                                        || obj.textureFrame === null) {
                                        return obj.textureKey;
                                    }
                                }
                                catch (e) {
                                    // nothing
                                }
                                return `${obj.textureFrame} (${obj.textureKey})`;
                            }
                            return "";
                        });
                    }
                    getCellRendererProvider() {
                        return new editors.AnimationsEditorOutlineCellRendererProvider(this._editor);
                    }
                    getTreeViewerRenderer(viewer) {
                        const renderer = new controls.viewers.TreeViewerRenderer(viewer);
                        return renderer;
                    }
                    getPropertySectionProvider() {
                        return this._editor.getPropertyProvider();
                    }
                    getInput() {
                        return this._editor;
                    }
                    async preload(complete) {
                        // nothing
                    }
                    fillContextMenu(menu) {
                        this._editor.fillMenu(menu);
                    }
                    getUndoManager() {
                        return this._editor.getUndoManager();
                    }
                }
                editors.AnimationsEditorOutlineProvider = AnimationsEditorOutlineProvider;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                class AnimationsEditorSnapshotOperation extends colibri.ui.ide.undo.Operation {
                    _before;
                    _after;
                    _editor;
                    _useAnimationIndexAsKey;
                    constructor(editor, before, after, useAnimationIndexAsKey) {
                        super();
                        this._editor = editor;
                        this._before = before;
                        this._after = after;
                        this._useAnimationIndexAsKey = useAnimationIndexAsKey;
                    }
                    async execute() {
                        await this.loadSnapshot(this._after);
                    }
                    static takeSnapshot(editor) {
                        return editor.getScene().anims.toJSON();
                    }
                    async loadSnapshot(data) {
                        this._editor.setDirty(true);
                        await this._editor.reset(data, this._useAnimationIndexAsKey);
                    }
                    undo() {
                        this.loadSnapshot(this._before);
                    }
                    redo() {
                        this.loadSnapshot(this._after);
                    }
                }
                editors.AnimationsEditorSnapshotOperation = AnimationsEditorSnapshotOperation;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var FileUtils = colibri.ui.ide.FileUtils;
                var SourceLang = phasereditor2d.ide.core.code.SourceLang;
                class AnimationsModel {
                    _animationsData;
                    sourceLang = phasereditor2d.ide.core.code.SourceLang.JAVA_SCRIPT;
                    generateCode = false;
                    esModule = false;
                    outputFolder;
                    constructor() {
                        this._animationsData = {
                            anims: [],
                            globalTimeScale: 1,
                            meta: this.createMeta()
                        };
                    }
                    async readFile(file) {
                        await FileUtils.preloadFileString(file);
                        const content = FileUtils.getFileString(file);
                        this._animationsData = JSON.parse(content);
                        const settings = this._animationsData.settings || {};
                        this.sourceLang = (settings.sourceLang || SourceLang.JAVA_SCRIPT);
                        this.esModule = settings.esModule ? true : false;
                        this.generateCode = settings.generateCode ? true : false;
                        this.outputFolder = settings.outputFolder;
                    }
                    toJSON(finder) {
                        const animsData = JSON.parse(JSON.stringify(this._animationsData));
                        animsData.settings = {
                            sourceLang: this.sourceLang,
                            esModule: this.esModule,
                            generateCode: this.generateCode,
                            outputFolder: this.outputFolder,
                        };
                        for (const a of animsData.anims) {
                            if (a.delay === 0)
                                delete a.delay;
                            if (a.repeat === 0)
                                delete a.repeat;
                            if (a.repeatDelay === 0)
                                delete a.repeatDelay;
                            if (!a.yoyo)
                                delete a.yoyo;
                            if (!a.showBeforeDelay)
                                delete a.showBeforeDelay;
                            if (!a.showOnStart)
                                delete a.showOnStart;
                            if (!a.hideOnComplete)
                                delete a.hideOnComplete;
                            if (!a.skipMissedFrames)
                                delete a.skipMissedFrames;
                            delete a.duration;
                            for (const frame of a.frames) {
                                try {
                                    const item = finder.findAssetPackItem(frame.key);
                                    if (item instanceof phasereditor2d.pack.core.ImageAssetPackItem) {
                                        delete frame.frame;
                                    }
                                }
                                catch (e) {
                                    // nothing
                                }
                            }
                        }
                        animsData.meta = this.createMeta();
                        return animsData;
                    }
                    createMeta() {
                        return {
                            "app": "Phaser Editor 2D v3",
                            "contentType": phasereditor2d.pack.core.contentTypes.CONTENT_TYPE_ANIMATIONS
                        };
                    }
                    async writeFile(file, finder) {
                        const animsData = this.toJSON(finder);
                        const content = JSON.stringify(animsData, null, 4);
                        await FileUtils.setFileString_async(file, content);
                    }
                    getModelData() {
                        return this._animationsData;
                    }
                    setJSONAnimations(animsData) {
                        this._animationsData.anims = animsData.anims;
                    }
                }
                editors.AnimationsModel = AnimationsModel;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var controls = colibri.ui.controls;
                class AnimationsOverlayLayer extends phasereditor2d.scene.ui.editor.BaseOverlayLayer {
                    _editor;
                    constructor(editor) {
                        super();
                        this._editor = editor;
                    }
                    renderLayer() {
                        const scene = this._editor.getScene();
                        const ctx = this.getContext();
                        ctx.save();
                        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
                        for (const obj of scene.sys.displayList.list) {
                            const sprite = obj;
                            const selected = sprite.getData("selected");
                            const cell = sprite.getData("cell");
                            if (selected && cell) {
                                controls.Controls.drawRoundedRect(ctx, cell.x, cell.y, cell.size, cell.size);
                            }
                        }
                        ctx.restore();
                    }
                }
                editors.AnimationsOverlayLayer = AnimationsOverlayLayer;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                const padding = 10;
                class AnimationsScene extends phasereditor2d.scene.ui.BaseScene {
                    _editor;
                    _resetCallback;
                    constructor(editor) {
                        super("AnimationsScene");
                        this._editor = editor;
                    }
                    removeAll() {
                        for (const sprite of this.getSprites()) {
                            sprite.destroy();
                        }
                        this.sys.displayList.removeAll();
                        this.sys.updateList.removeAll();
                    }
                    createSceneMaker() {
                        return new editors.AnimationsSceneMaker(this);
                    }
                    getMaker() {
                        return super.getMaker();
                    }
                    setReset(callback) {
                        this._resetCallback = callback;
                    }
                    computeLayout(selection) {
                        const list = this.sys.displayList.list;
                        const width = this.scale.width;
                        const height = this.scale.height;
                        let size = 256;
                        let maxY;
                        let maxX;
                        while (true) {
                            let x = padding;
                            let y = padding;
                            maxY = 0;
                            maxX = 0;
                            for (const obj of list) {
                                const sprite = obj;
                                const selected = selection.size === 0 || selection.has(sprite.anims.currentAnim);
                                if (selected) {
                                    // paint
                                    maxY = y;
                                    maxX = Math.max(x, maxX);
                                    x += size + 5;
                                    if (x + size > width) {
                                        x = padding;
                                        y += size + 5;
                                    }
                                }
                            }
                            if (maxY + size + 5 <= height) {
                                return {
                                    size,
                                    marginX: Math.max(padding, Math.floor((width - maxX - size - 5) / 2)),
                                    marginY: Math.max(padding, Math.floor((height - maxY - size - 5) / 2)),
                                };
                            }
                            else {
                                size = size - 4;
                            }
                        }
                    }
                    create() {
                        this.input.on(Phaser.Input.Events.POINTER_UP, e => {
                            let sel = [];
                            const pointer = e;
                            for (const obj of this.sys.displayList.list) {
                                const sprite = obj;
                                if (sprite.getData("selected")) {
                                    const cell = sprite.getData("cell");
                                    if (pointer.x >= cell.x
                                        && pointer.x <= cell.x + cell.size
                                        && pointer.y >= cell.y
                                        && pointer.y <= cell.y + cell.size) {
                                        sel = [sprite.anims.currentAnim];
                                        break;
                                    }
                                }
                            }
                            this._editor.setSelection(sel);
                            this.game.canvas.focus();
                        });
                    }
                    update() {
                        if (this._resetCallback) {
                            this._resetCallback();
                            this._resetCallback = null;
                            return;
                        }
                        const list = this.sys.displayList.list;
                        const selectionSet = new Set(this._editor.getSelectedAnimations());
                        const layout = this.computeLayout(selectionSet);
                        const size = layout.size;
                        const width = this.scale.width;
                        let x = layout.marginX;
                        let y = layout.marginY;
                        for (const obj of list) {
                            const sprite = obj;
                            const selected = selectionSet.size === 0 || selectionSet.has(sprite.anims.currentAnim);
                            sprite.setData("selected", selected);
                            if (selected) {
                                if (sprite.anims.isPlaying) {
                                    sprite.visible = true;
                                }
                                else {
                                    if (sprite.data.has("wait")) {
                                        if (sprite.data.get("wait") === 0) {
                                            sprite.data.remove("wait");
                                            sprite.visible = true;
                                            try {
                                                // TODO: Phaser 3.50
                                                sprite.play(sprite.anims.currentAnim.key);
                                            }
                                            catch (e) {
                                                // nothing
                                            }
                                        }
                                        else {
                                            sprite.data.set("wait", sprite.data.get("wait") - 1);
                                        }
                                    }
                                    else {
                                        sprite.data.set("wait", 60);
                                    }
                                }
                                sprite.setOrigin(0, 0);
                                let scale = 1;
                                if (sprite.width > sprite.height) {
                                    scale = size / sprite.width;
                                }
                                else {
                                    scale = size / sprite.height;
                                }
                                sprite.setScale(scale, scale);
                                const marginX = size / 2 - sprite.width * scale / 2;
                                const marginY = size / 2 - sprite.height * scale / 2;
                                sprite.setData("cell", { x, y, size });
                                sprite.x = x + marginX;
                                sprite.y = y + marginY;
                                x += size + 5;
                                if (x + size > width) {
                                    x = layout.marginX;
                                    y += size + 5;
                                }
                            }
                            else {
                                sprite.visible = false;
                                sprite.data.set("wait", 0);
                            }
                        }
                        this._editor.repaint();
                    }
                    getSprites() {
                        if (this.sys.displayList) {
                            return this.sys.displayList.list;
                        }
                        return [];
                    }
                }
                editors.AnimationsScene = AnimationsScene;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                class AnimationsSceneMaker extends phasereditor2d.scene.ui.BaseSceneMaker {
                    createScene(data, errors) {
                        const scene = this.getScene();
                        scene.anims.fromJSON(data, true);
                        for (const animData of data.anims) {
                            const sprite = scene.add.sprite(0, 0, null);
                            sprite.setDataEnabled();
                            try {
                                sprite.anims.play(animData.key);
                            }
                            catch (e) {
                                console.error(e);
                            }
                        }
                        for (const anim of scene.anims["anims"].getArray()) {
                            for (const frame of anim.frames) {
                                editors.AnimationsEditor.setAnimationToFrame(frame, anim);
                            }
                        }
                    }
                    async buildDependenciesHash() {
                        const builder = new phasereditor2d.ide.core.MultiHashBuilder();
                        this.getScene().getPackCache().buildAssetsDependenciesHash(builder);
                        const hash = builder.build();
                        return hash;
                    }
                    async updateSceneLoader(data, monitor) {
                        const scene = this.getScene();
                        const finder = this.getPackFinder();
                        const assets = [];
                        for (const anim of data.anims) {
                            for (const frame of anim.frames) {
                                const image = finder.getAssetPackItemImage(frame.key, frame.frame);
                                if (image) {
                                    assets.push(image);
                                }
                            }
                        }
                        monitor.addTotal(assets.length);
                        for (const asset of assets) {
                            const updater = phasereditor2d.scene.ScenePlugin.getInstance().getLoaderUpdaterForAsset(asset);
                            if (updater) {
                                await updater.updateLoader(scene, asset);
                                if (monitor) {
                                    monitor.step();
                                }
                            }
                        }
                    }
                }
                editors.AnimationsSceneMaker = AnimationsSceneMaker;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var controls = colibri.ui.controls;
                class EditorAnimationCellRenderer {
                    _editor;
                    constructor(editor) {
                        this._editor = editor;
                    }
                    get layout() {
                        return "full-width";
                    }
                    renderCell(args) {
                        const anim = args.obj;
                        const frames = anim.frames;
                        if (frames.length === 0) {
                            return;
                        }
                        const cellSize = args.viewer.getCellSize();
                        const len = frames.length;
                        const indexes = [0, Math.floor(len / 2), len - 1];
                        const ctx = args.canvasContext;
                        ctx.save();
                        if (cellSize <= controls.ROW_HEIGHT * 2) {
                            const img = this.getImage(frames[0]);
                            if (img) {
                                img.paint(ctx, args.x, args.y, args.w, args.h, true);
                            }
                        }
                        else {
                            // tslint:disable-next-line:prefer-for-of
                            for (let i = 0; i < indexes.length; i++) {
                                const frame = frames[indexes[i]];
                                const img = this.getImage(frame);
                                if (img) {
                                    const x = Math.floor(args.x + i * cellSize * 0.8);
                                    img.paint(ctx, x, args.y + 2, cellSize, args.h - 4, true);
                                }
                            }
                        }
                        ctx.restore();
                    }
                    getImage(frame) {
                        return this._editor.getScene().getMaker().getPackFinder()
                            .getAssetPackItemImage(frame.textureKey, frame.textureFrame);
                    }
                    cellHeight(args) {
                        return args.viewer.getCellSize();
                    }
                    async preload(args) {
                        return controls.PreloadResult.NOTHING_LOADED;
                    }
                }
                editors.EditorAnimationCellRenderer = EditorAnimationCellRenderer;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                const ALPHA = new Set("abcdefghijklmnñopqrstuvwxyz".split(""));
                class NameClustersBuilder {
                    _elements;
                    constructor() {
                        this._elements = [];
                    }
                    addElement(element) {
                        this._elements.push(element);
                    }
                    build() {
                        const clusters = [];
                        const map = new Map();
                        this._elements.sort((a, b) => a.name.localeCompare(b.name));
                        for (const elem of this._elements) {
                            const prefix = NameClustersBuilder.getPrefix(elem.name);
                            let cluster;
                            if (map.has(prefix)) {
                                cluster = map.get(prefix);
                            }
                            else {
                                cluster = {
                                    prefix: prefix,
                                    elements: []
                                };
                                map.set(prefix, cluster);
                                clusters.push(cluster);
                            }
                            cluster.elements.push(elem);
                        }
                        return clusters;
                    }
                    static getPrefix(name) {
                        let i = name.length - 1;
                        while (i > 0) {
                            const c = name.charAt(i);
                            if (ALPHA.has(c)) {
                                break;
                            }
                            i--;
                        }
                        return name.substring(0, i + 1);
                    }
                }
                editors.NameClustersBuilder = NameClustersBuilder;
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var properties;
                (function (properties) {
                    var controls = colibri.ui.controls;
                    var SourceLang = phasereditor2d.ide.core.code.SourceLang;
                    class AnimationCompilerSection extends controls.properties.PropertySection {
                        constructor(page) {
                            super(page, "phasereditor2d.animations.ui.editors.properties.AnimationCompilerSection", "Compiler Settings");
                        }
                        createMenu(menu) {
                            phasereditor2d.ide.IDEPlugin.getInstance().createHelpMenuItem(menu, "animations-editor");
                        }
                        hasMenu() {
                            return true;
                        }
                        createForm(parent) {
                            const comp = this.createGridElement(parent, 2);
                            this.createBooleanProperty(comp, "generateCode", "Generate Code", "Generate code?");
                            this.createMenuField(comp, () => [
                                {
                                    name: "JavaScript",
                                    value: SourceLang.JAVA_SCRIPT,
                                },
                                {
                                    name: "TypeScript",
                                    value: SourceLang.TYPE_SCRIPT
                                }
                            ], "compilerOutputLanguage", "Output Language", "The scene compiler output language.");
                            this.createBooleanProperty(comp, "esModule", "ES Module", "If generate the code with the ES module syntax.");
                            this.folderProperty(comp, "outputFolder", "Output Folder", "The folder where the compiled file is generated.");
                        }
                        folderProperty(parent, field, labelText, tooltip) {
                            this.createLabel(parent, labelText, tooltip);
                            const comp = this.createGridElement(parent, 2);
                            comp.style.gridTemplateColumns = "1fr auto";
                            comp.style.padding = "0px";
                            parent.appendChild(comp);
                            const text = this.createText(comp, true);
                            const dlg = this.createButtonDialog({
                                createDialogViewer: async (revealValue) => {
                                    const viewer = new controls.viewers.TreeViewer("AnimationsCompilerSection.outputFolder");
                                    const root = colibri.ui.ide.Workbench.getWorkbench().getProjectRoot();
                                    const viewers = phasereditor2d.files.ui.viewers;
                                    viewer.setStyledLabelProvider(new viewers.StyledFileLabelProvider());
                                    viewer.setContentProvider(new viewers.FileTreeContentProvider(true));
                                    viewer.setCellRendererProvider(new viewers.FileCellRendererProvider());
                                    viewer.setInput(root);
                                    viewer.setExpanded(root, true);
                                    const name = this.getModel().outputFolder || "";
                                    const folder = colibri.ui.ide.FileUtils.getFileFromPath(name);
                                    if (folder) {
                                        viewer.revealAndSelect(folder);
                                    }
                                    return viewer;
                                },
                                getValue: () => {
                                    return this.getModel().outputFolder;
                                },
                                dialogElementToString(viewer, value) {
                                    return value.getFullName();
                                },
                                dialogTittle: "Select Output Folder",
                                onValueSelected: (value) => {
                                    this.getEditor().runSettingsOperation(() => {
                                        this.getModel().outputFolder = value;
                                        this.updateWithSelection();
                                    });
                                },
                            });
                            comp.appendChild(dlg.buttonElement);
                            this.addUpdater(() => {
                                text.value = this.getModel().outputFolder || "";
                            });
                        }
                        createMenuField(comp, getItems, name, label, tooltip) {
                            this.createLabel(comp, label, tooltip);
                            const btn = this.createMenuButton(comp, "-", getItems, value => {
                                const editor = this.getEditor();
                                editor.runSettingsOperation(() => {
                                    editor.getModel().sourceLang = value;
                                    this.updateWithSelection();
                                });
                            });
                            this.addUpdater(() => {
                                const model = this.getModel();
                                const lang = model.sourceLang;
                                btn.textContent = lang === SourceLang.TYPE_SCRIPT ? "TypeScript" : "JavaScript";
                            });
                        }
                        createBooleanProperty(parent, field, labelText, tooltip) {
                            const checkbox = this.createCheckbox(parent, this.createLabel(parent, labelText, tooltip));
                            checkbox.addEventListener("change", e => {
                                this.getEditor().runSettingsOperation(() => {
                                    const value = checkbox.checked;
                                    this.getEditor().getModel()[field] = value;
                                });
                            });
                            this.addUpdater(() => {
                                checkbox.checked = this.flatValues_BooleanAnd(this.getSelection().map(a => a[field]));
                            });
                        }
                        getModel() {
                            return this.getSelectionFirstElement();
                        }
                        getEditor() {
                            const editor = colibri.Platform.getWorkbench().getActiveEditor();
                            return editor instanceof editors.AnimationsEditor ? editor : null;
                        }
                        canEdit(obj, n) {
                            return obj instanceof editors.AnimationsModel;
                        }
                        canEditNumber(n) {
                            return n === 1;
                        }
                    }
                    properties.AnimationCompilerSection = AnimationCompilerSection;
                })(properties = editors.properties || (editors.properties = {}));
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var properties;
                (function (properties) {
                    var controls = colibri.ui.controls;
                    class AnimationInfoSection extends controls.properties.PropertySection {
                        constructor(page) {
                            super(page, "phasereditor2d.animations.ui.editors.properties", "Animation Info", false);
                        }
                        createForm(parent) {
                            const comp = this.createGridElement(parent, 2);
                            {
                                // Animation Key
                                this.createLabel(comp, "Animation Key");
                                const btn = this.createButton(comp, "", () => {
                                    const anim = this.getSelectionFirstElement();
                                    animations.AnimationsPlugin.getInstance().openAnimationInEditor(anim);
                                });
                                this.addUpdater(() => {
                                    const anim = this.getSelectionFirstElement();
                                    btn.textContent = anim.getKey();
                                });
                            }
                            {
                                // Animations File
                                this.createLabel(comp, "Animations File");
                                const btn = this.createButton(comp, "", () => {
                                    const file = this.getSelectionFirstElement().getParent().getAnimationsFile();
                                    if (file) {
                                        colibri.Platform.getWorkbench().openEditor(file);
                                    }
                                });
                                this.addUpdater(() => {
                                    const anim = this.getSelectionFirstElement();
                                    const file = anim.getParent().getAnimationsFile();
                                    btn.textContent = file ?
                                        file.getName() + " - " + file.getParent().getProjectRelativeName()
                                        : "<not found>";
                                });
                            }
                            {
                                // preview button
                                this.createButton(comp, "Preview Animation", async () => {
                                    const elem = this.getSelectionFirstElement();
                                    const animAsset = elem.getParent();
                                    const animationKey = elem.getKey();
                                    const dlg = new phasereditor2d.scene.ui.sceneobjects.AnimationPreviewDialog(animAsset, {
                                        key: animationKey
                                    });
                                    dlg.create();
                                }).style.gridColumn = "span 2";
                            }
                        }
                        canEdit(obj, n) {
                            return obj instanceof phasereditor2d.pack.core.AnimationConfigInPackItem;
                        }
                        canEditNumber(n) {
                            return n === 1;
                        }
                    }
                    properties.AnimationInfoSection = AnimationInfoSection;
                })(properties = editors.properties || (editors.properties = {}));
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var properties;
                (function (properties) {
                    class AnimationPreviewFrameSection extends colibri.ui.ide.properties.BaseImagePreviewSection {
                        constructor(page) {
                            super(page, "phasereditor2d.animations.ui.editors.AnimationPreviewFrameSection", "Animation Frame Preview", true, false);
                        }
                        getSelectedImage() {
                            const frame = this.getSelectionFirstElement();
                            const finder = this.getEditor().getScene().getMaker().getPackFinder();
                            const image = finder.getAssetPackItemImage(frame.textureKey, frame.textureFrame);
                            return image;
                        }
                        getEditor() {
                            return colibri.Platform.getWorkbench().getActiveEditor();
                        }
                        canEdit(obj, n) {
                            return obj instanceof Phaser.Animations.AnimationFrame;
                        }
                    }
                    properties.AnimationPreviewFrameSection = AnimationPreviewFrameSection;
                })(properties = editors.properties || (editors.properties = {}));
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var properties;
                (function (properties) {
                    var controls = colibri.ui.controls;
                    class AnimationSection extends controls.properties.PropertySection {
                        constructor(page) {
                            super(page, "phasereditor2d.animations.ui.editors.properties.AnimationSection", "Animation");
                        }
                        help(key) {
                            return animations.AnimationsPlugin.getInstance().getPhaserDocs().getDoc("Phaser.Types.Animations.Animation." + key);
                        }
                        createMenu(menu) {
                            phasereditor2d.ide.IDEPlugin.getInstance().createHelpMenuItem(menu, "animations-editor");
                        }
                        hasMenu() {
                            return true;
                        }
                        createForm(parent) {
                            const comp = this.createGridElement(parent, 2);
                            {
                                this.createLabel(comp, "Key", this.help("key"));
                                const text = this.createText(comp);
                                text.addEventListener("change", e => {
                                    const key = text.value;
                                    if (key.trim().length > 0) {
                                        const anim = this.getSelectionFirstElement();
                                        this.getEditor().runOperation(() => {
                                            anim.key = key;
                                        }, true);
                                    }
                                    else {
                                        this.updateWithSelection();
                                    }
                                });
                                this.addUpdater(() => {
                                    text.value = this.flatValues_StringJoin(this.getSelection().map(a => a.key));
                                    text.readOnly = this.getSelection().length > 1;
                                });
                            }
                            this.createNumberProperty(comp, "frameRate", "Frame Rate", 24, false);
                            this.createNumberProperty(comp, "delay", "Delay", 0);
                            this.createNumberProperty(comp, "repeat", "Repeat", 0);
                            this.createNumberProperty(comp, "repeatDelay", "Repeat Delay", 0);
                            this.createBooleanProperty(comp, "yoyo", "Yoyo");
                            this.createBooleanProperty(comp, "showBeforeDelay", "Show Before Delay");
                            this.createBooleanProperty(comp, "showOnStart", "Show On Start");
                            this.createBooleanProperty(comp, "hideOnComplete", "Hide On Complete");
                            this.createBooleanProperty(comp, "skipMissedFrames", "Skip Missed Frames");
                        }
                        createBooleanProperty(parent, field, labelText) {
                            const checkbox = this.createCheckbox(parent, this.createLabel(parent, labelText, this.help(field)));
                            checkbox.addEventListener("change", e => {
                                this.getEditor().runOperation(() => {
                                    const value = checkbox.checked;
                                    this.getSelection().forEach(a => a[field] = value);
                                });
                            });
                            this.addUpdater(() => {
                                checkbox.checked = this.flatValues_BooleanAnd(this.getSelection().map(a => a[field]));
                            });
                        }
                        createNumberProperty(parent, field, labelText, defValue, integer = true) {
                            this.createLabel(parent, labelText, this.help(field));
                            const text = this.createText(parent);
                            text.addEventListener("change", e => {
                                let value = integer ? Number.parseInt(text.value, 10) : Number.parseFloat(text.value);
                                if (isNaN(value)) {
                                    value = defValue;
                                    text.value = defValue.toString();
                                }
                                this.getEditor().runOperation(() => {
                                    for (const anim of this.getSelection()) {
                                        anim[field] = value;
                                    }
                                });
                            });
                            this.addUpdater(() => {
                                text.value = this.flatValues_Number(this.getSelection().map(a => a[field]));
                            });
                        }
                        getEditor() {
                            return colibri.Platform.getWorkbench().getActiveEditor();
                        }
                        canEdit(obj, n) {
                            return obj instanceof Phaser.Animations.Animation;
                        }
                        canEditNumber(n) {
                            return n > 0;
                        }
                    }
                    properties.AnimationSection = AnimationSection;
                })(properties = editors.properties || (editors.properties = {}));
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var properties;
                (function (properties) {
                    class AnimationsEditorPropertyProvider extends phasereditor2d.pack.ui.properties.AssetPackPreviewPropertyProvider {
                        constructor() {
                            super();
                        }
                        addSections(page, sections) {
                            sections.push(new properties.BuildAnimationsSection(page));
                            super.addSections(page, sections);
                            sections.push(new properties.AnimationSection(page), new properties.AnimationCompilerSection(page), new properties.AnimationPreviewFrameSection(page), new properties.ManyAnimationFramesPreviewSection(page));
                        }
                        getEmptySelectionArray() {
                            const wb = colibri.Platform.getWorkbench();
                            const editor = wb.getActiveEditor();
                            if (editor instanceof editors.AnimationsEditor) {
                                const activePart = colibri.Platform.getWorkbench().getActivePart();
                                if (activePart instanceof editors.AnimationsEditor
                                    || activePart instanceof colibri.inspector.ui.views.InspectorView
                                    || activePart instanceof phasereditor2d.outline.ui.views.OutlineView) {
                                    return [editor.getModel()];
                                }
                            }
                            return null;
                        }
                    }
                    properties.AnimationsEditorPropertyProvider = AnimationsEditorPropertyProvider;
                })(properties = editors.properties || (editors.properties = {}));
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var properties;
                (function (properties) {
                    var controls = colibri.ui.controls;
                    class BuildAnimationsSection extends controls.properties.PropertySection {
                        constructor(page) {
                            super(page, "phasereditor2d.animations.ui.editors.properties.BuildAnimationsSection", "Auto Build Animations", false, false);
                        }
                        getEditor() {
                            return colibri.Platform.getWorkbench().getActiveEditor();
                        }
                        createForm(parent) {
                            const comp = this.createGridElement(parent, 1);
                            const clustersElement = document.createElement("div");
                            comp.appendChild(clustersElement);
                            const btn = this.createButton(comp, "Build", async () => {
                                const builder = new editors.AnimationsBuilder(this.getEditor(), this.getSelection());
                                builder.build();
                            });
                            this.addUpdater(() => {
                                const builder = new editors.AnimationsBuilder(this.getEditor(), this.getSelection());
                                const clusters = builder.buildClusters();
                                const len = clusters.length;
                                let html = "";
                                if (len > 0) {
                                    html += clusters.map(c => `<b>${c.prefix}</b> <small>(${c.elements.length} frames)</small>`).join("<br>");
                                    html += "<br><br>";
                                }
                                clustersElement.innerHTML = html;
                                btn.disabled = len === 0;
                                btn.textContent = "Build " + len + " animations";
                            });
                        }
                        canEdit(obj, n) {
                            return obj instanceof phasereditor2d.pack.core.AssetPackImageFrame
                                || obj instanceof phasereditor2d.pack.core.ImageFrameContainerAssetPackItem;
                        }
                        canEditNumber(n) {
                            return n > 0;
                        }
                    }
                    properties.BuildAnimationsSection = BuildAnimationsSection;
                })(properties = editors.properties || (editors.properties = {}));
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var animations;
    (function (animations) {
        var ui;
        (function (ui) {
            var editors;
            (function (editors) {
                var properties;
                (function (properties) {
                    class ManyAnimationFramesPreviewSection extends colibri.ui.ide.properties.BaseManyImagePreviewSection {
                        constructor(page) {
                            super(page, "phasereditor2d.animations.ui.editors.AnimationFramePreviewSection", "Frames Preview", true, false);
                        }
                        getEditor() {
                            return colibri.Platform.getWorkbench().getActiveEditor();
                        }
                        async getViewerInput() {
                            return this.getSelection().map(frame => {
                                const finder = this.getEditor().getScene().getMaker().getPackFinder();
                                const image = finder.getAssetPackItemImage(frame.textureKey, frame.textureFrame);
                                return image;
                            }).filter(img => img !== null && img !== undefined);
                        }
                        prepareViewer(viewer) {
                            viewer.setCellRendererProvider(new phasereditor2d.pack.ui.viewers.AssetPackCellRendererProvider("grid"));
                            viewer.setLabelProvider(new phasereditor2d.pack.ui.viewers.AssetPackLabelProvider());
                        }
                        canEdit(obj, n) {
                            return obj instanceof Phaser.Animations.AnimationFrame;
                        }
                    }
                    properties.ManyAnimationFramesPreviewSection = ManyAnimationFramesPreviewSection;
                })(properties = editors.properties || (editors.properties = {}));
            })(editors = ui.editors || (ui.editors = {}));
        })(ui = animations.ui || (animations.ui = {}));
    })(animations = phasereditor2d.animations || (phasereditor2d.animations = {}));
})(phasereditor2d || (phasereditor2d = {}));
