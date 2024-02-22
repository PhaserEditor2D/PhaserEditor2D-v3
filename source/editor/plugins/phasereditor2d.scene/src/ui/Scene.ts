/// <reference path="./BaseScene.ts" />
namespace phasereditor2d.scene.ui {

    export class Scene extends BaseScene {

        static CURRENT_VERSION = 5;

        private _id: string;
        private _sceneType: core.json.SceneType;
        private _editor: editor.SceneEditor;
        private _settings: core.json.SceneSettings;
        private _prefabProperties: sceneobjects.PrefabUserProperties;
        private _objectLists: sceneobjects.ObjectLists;
        private _plainObjects: sceneobjects.IScenePlainObject[];
        private _codeSnippets: codesnippets.CodeSnippets;
        private _version: number;

        constructor(editor?: editor.SceneEditor) {
            super("ObjectScene");

            this._id = Phaser.Utils.String.UUID();

            this._editor = editor;

            this._settings = new core.json.SceneSettings();

            this._objectLists = new sceneobjects.ObjectLists();

            this._plainObjects = [];

            this._codeSnippets = new codesnippets.CodeSnippets();

            this._prefabProperties = new sceneobjects.PrefabUserProperties();

            this._version = Scene.CURRENT_VERSION;
        }

        getVersion() {

            return this._version;
        }

        setVersion(version: number) {

            this._version = version;
        }

        sortObjectsByIndex(objects: Phaser.GameObjects.GameObject[]) {

            const map: Map<any, number> = new Map();

            this.buildSortingMap(map, this.getGameObjects(), 0);

            objects.sort((a, b) => {

                const aa = map.get(a);
                const bb = map.get(b);

                return aa - bb;
            });
        }

        private buildSortingMap(map: Map<any, number>, list: Phaser.GameObjects.GameObject[], index: number) {

            for (const obj of list) {

                index++;

                map.set(obj, index);

                const objES = (obj as sceneobjects.ISceneGameObject).getEditorSupport();

                if (!objES.isPrefabInstance()) {

                    const children = objES.getObjectChildren();

                    index = this.buildSortingMap(map, children, index);
                }
            }

            return index;
        }

        readPlainObjects(list: core.json.IScenePlainObjectData[]) {

            this._plainObjects = [];

            for (const objData of list) {

                this.readPlainObject(objData);
            }
        }

        readPlainObject(objData: core.json.IScenePlainObjectData) {

            const ext = ScenePlugin.getInstance().getPlainObjectExtensionByObjectType(objData.type);

            if (ext) {

                const plainObject = ext.createPlainObjectWithData({
                    scene: this,
                    data: objData
                });

                plainObject.getEditorSupport().readJSON(objData);

                this.addPlainObject(plainObject);

                return plainObject;
            }

            return undefined;
        }

        removePlainObjects(objects: sceneobjects.IScenePlainObject[]) {

            const set = new Set(objects);

            this._plainObjects = this._plainObjects.filter(obj => !set.has(obj));

            for (const obj of set) {

                obj.getEditorSupport().destroy();
            }
        }

        getGameObjectIndex(obj: sceneobjects.ISceneGameObject) {

            return this.children.getIndex(obj);
        }

        removeGameObject(obj: sceneobjects.ISceneGameObject) {

            this.children.remove(obj);

            if (obj instanceof sceneobjects.ScriptNode) {

                obj.setParent(undefined);
            }
        }

        addGameObject(obj: sceneobjects.ISceneGameObject, skipCallback = false) {

            this.children.add(obj, skipCallback);
        }

        addGameObjectAt(obj: sceneobjects.ISceneGameObject, index: number, skipCallback = false) {

            this.children.addAt(obj, index, skipCallback);
        }

        getCodeSnippets() {

            return this._codeSnippets;
        }

        addCodeSnippet(codeSnippet: codesnippets.CodeSnippet) {

            this._codeSnippets.add(codeSnippet);
        }

        addPlainObject(obj: sceneobjects.IScenePlainObject) {

            this._plainObjects.push(obj);
        }

        getPlainObjectById(id: string) {

            return this.getPlainObjects().find(o => o.getEditorSupport().getId() === id);
        }

        getPlainObjects() {

            return this._plainObjects;
        }

        getPlainObjectsByCategory(category: string) {

            return this._plainObjects.filter(obj => obj.getEditorSupport()
                .getExtension().getCategory() === category);
        }

        createSceneMaker() {

            return new SceneMaker(this);
        }

        getEditor() {

            return this._editor;
        }

        protected registerDestroyListener(name: string) {
            // console.log(name + ": register destroy listener.");
            // this.game.events.on(Phaser.Core.Events.DESTROY, e => {
            //     console.log(name + ": destroyed.");
            // });
        }

        removeAll() {

            this.sys.updateList.removeAll();
            this.sys.displayList.removeAll();

            // a hack to clean the whole scene
            this.input["_list"].length = 0;
            this.input["_pendingInsertion"].length = 0;
            this.input["_pendingRemoval"].length = 0;

            for (const obj of this.getGameObjects()) {

                obj.getEditorSupport().destroy();
            }
        }

        isScriptNodePrefabScene() {

            if (this.isPrefabSceneType()) {

                const obj = this.getPrefabObject();

                if (obj) {

                    return obj instanceof sceneobjects.ScriptNode;
                }
            }

            return false;
        }

        getPrefabObject(): sceneobjects.ISceneGameObject {

            if (this.sys.displayList) {

                const list = this.getGameObjects();

                return list[list.length - 1];
            }

            return undefined;
        }

        isNonTopPrefabObject(obj: any) {

            const objES = sceneobjects.GameObjectEditorSupport.getEditorSupport(obj);

            if (objES) {

                const scene = objES.getScene();

                if (scene.isPrefabSceneType()) {

                    if (scene.getPrefabObject() !== obj) {

                        const parent = objES.getObjectParent();

                        if (parent) {

                            return this.isNonTopPrefabObject(parent);
                        }

                        return true;
                    }
                }
            }

            return false;
        }

        getObjectLists() {

            return this._objectLists;
        }

        getSettings() {

            return this._settings;
        }

        getPrefabUserProperties() {

            return this._prefabProperties;
        }

        getId() {

            return this._id;
        }

        setId(id: string) {

            this._id = id;
        }

        getSceneType(): core.json.SceneType {

            return this._sceneType;
        }

        isPrefabSceneType() {

            return this.getSceneType() === core.json.SceneType.PREFAB;
        }

        setSceneType(sceneType: core.json.SceneType) {

            this._sceneType = sceneType;
        }

        isESModule() {

            return this._settings.autoImport || this._settings.exportClass;
        }

        isTypeScriptOutput() {

            return this._settings.compilerOutputLanguage === ide.core.code.SourceLang.TYPE_SCRIPT;
        }

        getMaker() {

            return super.getMaker() as SceneMaker;
        }

        sortGameObjects() {

            sceneobjects.sortObjectsAlgorithm(this.getGameObjects(), 0);
        }

        getGameObjects(): sceneobjects.ISceneGameObject[] {

            return this.sys.displayList.getChildren() as any;
        }

        getInputSortedObjects(): Phaser.GameObjects.GameObject[] {

            return this.getInputSortedObjects2([], this.getGameObjects());
        }

        private getInputSortedObjects2(
            result: sceneobjects.ISceneGameObject[], list: sceneobjects.ISceneGameObject[]): sceneobjects.ISceneGameObject[] {

            for (const obj of list) {

                if (obj instanceof sceneobjects.Container || obj instanceof sceneobjects.Layer) {

                    if (obj.visible && obj.alpha > 0) {

                        this.getInputSortedObjects2(result, obj.getEditorSupport().getObjectChildren());
                    }

                } else {

                    result.push(obj);
                }
            }

            return result;
        }

        visitAll(visitor: (obj: sceneobjects.ISceneGameObject) => void) {

            this.visit(visitor, this.getGameObjects());
        }

        visit(visitor: (obj: sceneobjects.ISceneGameObject) => void, children: sceneobjects.ISceneGameObject[]) {

            for (const obj of children) {

                visitor(obj);

                this.visit(visitor, obj.getEditorSupport().getObjectChildren());
            }
        }

        visitAllAskChildren(visitor: (obj: sceneobjects.ISceneGameObject) => boolean) {

            this.visitAskChildren(visitor, this.getGameObjects());
        }

        visitAskChildren(
            visitor: (obj: sceneobjects.ISceneGameObject) => boolean, children: sceneobjects.ISceneGameObject[]) {

            for (const obj of children) {

                const visitChildren = visitor(obj);

                if (visitChildren) {

                    this.visitAskChildren(visitor, obj.getEditorSupport().getObjectChildren());
                }
            }
        }

        makeNewName(baseName: string) {

            const nameMaker = this.createNameMaker();

            return nameMaker.makeName(baseName);
        }

        createNameMaker() {

            const nameMaker = new colibri.ui.ide.utils.NameMaker((obj: any) => {

                const objES = sceneobjects.EditorSupport.getEditorSupport(obj);

                if (objES) {

                    return objES.getLabel();
                }

                return (obj as sceneobjects.ObjectList).getLabel();
            });

            this.visitAllAskChildren(obj => {

                nameMaker.update([obj]);

                const objES = obj.getEditorSupport();

                return !objES.isPrefabInstance() || objES.isMutableNestedPrefabInstance()
                    || objES.isPrefeabInstanceAppendedChild;;
            });

            nameMaker.update(this._plainObjects);

            for (const list of this._objectLists.getLists()) {

                nameMaker.update([list]);
            }

            return nameMaker;
        }

        /**
         * Map an object with its pre-order index. This can be used to sort objects.
         */
        buildObjectSortingMap() {

            const map = new Map<sceneobjects.ISceneGameObject, number>();

            this.buildObjectSortingMap2(map, this.getGameObjects());

            return map;
        }

        sortObjectsByRenderingOrder(list: sceneobjects.ISceneGameObject[]) {

            const map = this.buildObjectSortingMap();

            list.sort((a, b) => {

                const aa = map.get(a);
                const bb = map.get(b);

                return aa - bb;
            });
        }

        private buildObjectSortingMap2(map: Map<sceneobjects.ISceneGameObject, number>, list: sceneobjects.ISceneGameObject[]) {

            let i = 0;

            for (const obj of list) {

                map.set(obj, i);

                if (obj instanceof sceneobjects.Container || obj instanceof sceneobjects.Layer) {

                    i += this.buildObjectSortingMap2(map, obj.getEditorSupport().getObjectChildren());
                }

                i++;
            }

            return i;
        }

        buildObjectIdMap() {

            const map = new Map<string, sceneobjects.ISceneGameObject>();

            this.visitAll(obj => {

                map.set(obj.getEditorSupport().getId(), obj);
            });

            return map;
        }

        buildUserComponentIdMap() {

            const map = new Map<string, sceneobjects.UserComponentNode>();

            this.visitAll(obj => {

                for (const node of obj.getEditorSupport().getUserComponentsComponent().getUserComponentNodes()) {

                    map.set(node.getId(), node);
                }
            });

            return map;
        }

        snapPoint(x: number, y: number): { x: number, y: number } {

            if (this._settings.snapEnabled) {

                return {
                    x: Math.round(x / this._settings.snapWidth) * this._settings.snapWidth,
                    y: Math.round(y / this._settings.snapHeight) * this._settings.snapHeight
                };
            }

            return { x, y };
        }

        snapVector(vector: Phaser.Math.Vector2) {

            const result = this.snapPoint(vector.x, vector.y);

            vector.set(result.x, result.y);
        }

        getByEditorId(id: string) {

            const obj = Scene.findByEditorId(this.getGameObjects(), id);

            return obj;
        }

        findByEditorLabel(label: string) {

            const found = { obj: undefined };

            this.visitAll(obj => {

                const support = sceneobjects.EditorSupport.getEditorSupport(obj);

                if (support) {

                    if (support.getLabel() === label) {

                        found.obj = obj;
                    }
                }
            });

            if (found.obj) {

                return found.obj;
            }

            for (const objList of this.getObjectLists().getLists()) {

                if (objList.getLabel() === label) {

                    return objList;
                }
            }

            return undefined;
        }

        debugFindDuplicatedEditorId(list?: sceneobjects.ISceneGameObject[], set?: Set<any>) {

            set = set ?? new Set();

            for (const obj of (list ?? this.getGameObjects())) {

                const id = obj.getEditorSupport().getId();

                if (set.has(id)) {

                    console.error("Duplicated " + obj.getEditorSupport().getLabel() + " id " + id);

                } else {

                    console.log("New " + obj.getEditorSupport().getLabel() + " id " + id);

                    set.add(id);
                }

                if (obj instanceof sceneobjects.Container || obj instanceof sceneobjects.Layer) {

                    this.debugFindDuplicatedEditorId(obj.list as any, set);
                }
            }
        }

        static findByEditorId(list: sceneobjects.ISceneGameObject[], id: string) {

            for (const obj of list) {

                if (obj.getEditorSupport().getId() === id) {

                    return obj;
                }

                const result = this.findByEditorId(obj.getEditorSupport().getObjectChildren(), id);

                if (result) {
                    return result;
                }
            }

            return null;
        }

        create() {

            this.registerDestroyListener("Scene");

            if (this._editor) {

                const camera = this.getCamera();
                camera.setOrigin(0, 0);
            }
        }
    }
}