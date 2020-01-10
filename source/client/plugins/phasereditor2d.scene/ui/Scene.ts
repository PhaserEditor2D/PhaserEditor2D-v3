
namespace phasereditor2d.scene.ui {

    export class Scene extends Phaser.Scene {

        private _id: string;
        private _inEditor: boolean;
        private _maker: SceneMaker;
        private _settings: core.json.SceneSettings;
        private _sceneType: core.json.SceneType;
        private _packCache: pack.core.parsers.AssetPackCache;

        constructor(inEditor = true) {
            super("ObjectScene");

            this._id = Phaser.Utils.String.UUID();

            this._inEditor = inEditor;

            this._maker = new SceneMaker(this);

            this._settings = new core.json.SceneSettings();

            this._packCache = new pack.core.parsers.AssetPackCache();
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

        getPrefabObject(): sceneobjects.SceneObject {
            return this.getDisplayListChildren()[0];
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
            return this._sceneType;
        }

        isPrefabSceneType() {
            return this._sceneType === core.json.SceneType.PREFAB;
        }

        setSceneType(sceneType: core.json.SceneType) {
            this._sceneType = sceneType;
        }

        getMaker() {
            return this._maker;
        }

        getDisplayListChildren(): sceneobjects.SceneObject[] {
            return this.sys.displayList.getChildren() as any;
        }

        visit(visitor: (obj: sceneobjects.SceneObject) => void) {

            for (const obj of this.getDisplayListChildren()) {

                visitor(obj);

                if (obj instanceof sceneobjects.Container) {

                    for (const child of obj.list) {
                        visitor(child);
                    }
                }
            }
        }

        makeNewName(baseName: string) {

            const nameMaker = new colibri.ui.ide.utils.NameMaker((obj: sceneobjects.SceneObject) => {
                return obj.getEditorSupport().getLabel();
            });

            this.visit(obj => nameMaker.update([obj]));

            return nameMaker.makeName(baseName);
        }

        getByEditorId(id: string) {

            const obj = Scene.findByEditorId(this.getDisplayListChildren(), id);

            if (!obj) {
                console.error(`Object with id=${id} not found.`);
            }

            return obj;
        }

        static findByEditorId(list: sceneobjects.SceneObject[], id: string) {

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