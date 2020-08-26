namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;

    export abstract class BaseSceneMaker {

        private _packFinder: pack.core.PackFinder;
        private _scene: BaseScene;

        constructor(scene: BaseScene) {

            this._packFinder = new pack.core.PackFinder();
            this._scene = scene;
        }

        abstract async updateSceneLoader(data: any, monitor?: controls.IProgressMonitor);

        abstract async buildDependenciesHash(): Promise<string>;

        abstract createScene(data: any, errors?: string[]);

        getPackFinder() {

            return this._packFinder;
        }

        getScene() {

            return this._scene;
        }

        async preload() {

            await this.getPackFinder().preload();

            const updaters = ScenePlugin.getInstance().getLoaderUpdaters();

            for (const updater of updaters) {

                updater.clearCache(this._scene.game);
            }
        }        
    }
}