
namespace phasereditor2d.scene.ui {

    export class Scene extends Phaser.Scene {

        private _id: string;
        private _editor: editor.SceneEditor;
        private _maker: SceneMaker;
        private _settings: core.json.SceneSettings;
        private _prefabProperties: sceneobjects.UserProperties;
        private _objectLists: sceneobjects.ObjectLists;
        private _packCache: pack.core.parsers.AssetPackCache;

        constructor(editor?: editor.SceneEditor) {
            super("ObjectScene");

            this._id = Phaser.Utils.String.UUID();

            this._editor = editor;

            this._maker = new SceneMaker(this);

            this._settings = new core.json.SceneSettings();

            this._packCache = new pack.core.parsers.AssetPackCache();

            this._objectLists = new sceneobjects.ObjectLists();

            this._prefabProperties = new sceneobjects.UserProperties();
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

        getPackCache() {
            return this._packCache;
        }

        destroyGame() {

            if (this.game) {

                this.game.destroy(true);
                this.game.loop.tick();
            }
        }

        removeAll() {

            this.sys.updateList.removeAll();
            this.sys.displayList.removeAll();

            // a hack to clean the whole scene
            this.input["_list"].length = 0;
            this.input["_pendingInsertion"].length = 0;
            this.input["_pendingRemoval"].length = 0;

            for (const obj of this.getDisplayListChildren()) {

                obj.getEditorSupport().destroy();
            }
        }

        getPrefabObject(): sceneobjects.ISceneObject {

            const list = this.getDisplayListChildren();

            return list[list.length - 1];
        }

        isNonTopPrefabObject(obj: any) {

            const support = sceneobjects.EditorSupport.getEditorSupport(obj);

            if (support) {

                const scene = support.getScene();

                if (scene.isPrefabSceneType()) {

                    if (scene.getPrefabObject() !== obj) {

                        const container = (obj as Phaser.GameObjects.GameObject).parentContainer;


                        if (container) {

                            return this.isNonTopPrefabObject(container);
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

        getSceneType() {
            return this._settings.sceneType;
        }

        isPrefabSceneType() {
            return this.getSceneType() === core.json.SceneType.PREFAB;
        }

        setSceneType(sceneType: core.json.SceneType) {
            this._settings.sceneType = sceneType;
        }

        getMaker() {
            return this._maker;
        }

        getDisplayListChildren(): sceneobjects.ISceneObject[] {
            return this.sys.displayList.getChildren() as any;
        }

        getInputSortedObjects(): Phaser.GameObjects.GameObject[] {

            return this.getInputSortedObjects2([], this.getDisplayListChildren());
        }

        private getInputSortedObjects2(
            result: sceneobjects.ISceneObject[], list: sceneobjects.ISceneObject[]): sceneobjects.ISceneObject[] {

            for (const obj of list) {

                if (obj instanceof sceneobjects.Container) {

                    this.getInputSortedObjects2(result, obj.list);

                } else {

                    result.push(obj);
                }
            }

            return result;
        }

        visit(visitor: (obj: sceneobjects.ISceneObject) => void) {

            this.visit2(visitor, this.getDisplayListChildren());
        }

        private visit2(visitor: (obj: sceneobjects.ISceneObject) => void, children: sceneobjects.ISceneObject[]) {

            for (const obj of children) {

                visitor(obj);

                if (obj instanceof sceneobjects.Container) {

                    this.visit2(visitor, obj.list);
                }
            }
        }

        visitAskChildren(visitor: (obj: sceneobjects.ISceneObject) => boolean) {

            this.visitAskChildren2(visitor, this.getDisplayListChildren());
        }

        private visitAskChildren2(
            visitor: (obj: sceneobjects.ISceneObject) => boolean, children: sceneobjects.ISceneObject[]) {

            for (const obj of children) {

                const visitChildren = visitor(obj);

                if (visitChildren) {

                    if (obj instanceof sceneobjects.Container) {

                        this.visitAskChildren2(visitor, obj.list);
                    }
                }
            }
        }

        makeNewName(baseName: string) {

            const nameMaker = new colibri.ui.ide.utils.NameMaker((obj: any) => {

                if (obj instanceof Phaser.GameObjects.GameObject) {

                    return (obj as sceneobjects.ISceneObject).getEditorSupport().getLabel();
                }

                return (obj as sceneobjects.ObjectList).getLabel();
            });

            this.visitAskChildren(obj => {

                nameMaker.update([obj]);

                return !obj.getEditorSupport().isPrefabInstance();
            });

            for (const list of this._objectLists.getLists()) {

                nameMaker.update([list]);
            }

            return nameMaker.makeName(baseName);
        }

        /**
         * Map an object with its pre-order index. This can be used to sort objects.
         */
        buildObjectSortingMap() {

            const map = new Map<sceneobjects.ISceneObject, number>();

            this.buildObjectSortingMap2(map, this.getDisplayListChildren());

            return map;
        }

        sortObjectsByRenderingOrder(list: sceneobjects.ISceneObject[]) {

            const map = this.buildObjectSortingMap();

            list.sort((a, b) => {

                const aa = map.get(a);
                const bb = map.get(b);

                return aa - bb;
            });
        }

        private buildObjectSortingMap2(map: Map<sceneobjects.ISceneObject, number>, list: sceneobjects.ISceneObject[]) {

            let i = 0;

            for (const obj of list) {

                map.set(obj, i);

                if (obj instanceof sceneobjects.Container) {

                    i += this.buildObjectSortingMap2(map, obj.list);
                }

                i++;
            }

            return i;
        }

        buildObjectIdMap() {

            const map = new Map<string, sceneobjects.ISceneObject>();

            this.visit(obj => {

                map.set(obj.getEditorSupport().getId(), obj);
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

            const obj = Scene.findByEditorId(this.getDisplayListChildren(), id);

            if (!obj) {
                console.error(`Object with id=${id} not found.`);
            }

            return obj;
        }

        static findByEditorId(list: sceneobjects.ISceneObject[], id: string) {

            for (const obj of list) {

                if (obj.getEditorSupport().getId() === id) {
                    return obj;
                }

                if (obj instanceof sceneobjects.Container) {

                    const result = this.findByEditorId(obj.list, id);

                    if (result) {
                        return result;
                    }
                }
            }

            return null;
        }

        getCamera() {
            return this.cameras.main;
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