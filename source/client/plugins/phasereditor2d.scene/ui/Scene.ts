
namespace phasereditor2d.scene.ui {

    export class Scene extends Phaser.Scene {

        private _id: string;
        private _inEditor: boolean;
        private _maker: SceneMaker;
        private _settings: core.json.SceneSettings;
        private _objectLists: sceneobjects.ObjectLists;
        private _packCache: pack.core.parsers.AssetPackCache;

        constructor(inEditor = true) {
            super("ObjectScene");

            this._id = Phaser.Utils.String.UUID();

            this._inEditor = inEditor;

            this._maker = new SceneMaker(this);

            this._settings = new core.json.SceneSettings();

            this._packCache = new pack.core.parsers.AssetPackCache();

            this._objectLists = new sceneobjects.ObjectLists();
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

        getObjectLists() {
            return this._objectLists;
        }

        getSettings() {
            return this._settings;
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

            const list = [];

            for (const child of this.children.list) {

                if (child instanceof sceneobjects.Container) {

                    for (const child2 of child.list) {

                        list.push(child2);
                    }

                } else {

                    list.push(child);
                }
            }

            return list;
        }

        visit(visitor: (obj: sceneobjects.ISceneObject) => void) {

            for (const obj of this.getDisplayListChildren()) {

                visitor(obj);

                if (obj instanceof sceneobjects.Container) {

                    for (const child of obj.list) {
                        visitor(child);
                    }
                }
            }
        }

        visitAskChildren(visitor: (obj: sceneobjects.ISceneObject) => boolean) {

            for (const obj of this.getDisplayListChildren()) {

                const visitChildren = visitor(obj);

                if (visitChildren) {

                    if (obj instanceof sceneobjects.Container) {

                        for (const child of obj.list) {
                            visitor(child);
                        }
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

            if (this._inEditor) {

                const camera = this.getCamera();
                camera.setOrigin(0, 0);
            }
        }
    }
}