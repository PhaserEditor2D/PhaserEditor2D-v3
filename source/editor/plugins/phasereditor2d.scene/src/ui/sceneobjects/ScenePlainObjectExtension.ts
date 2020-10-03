namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ICreatePlainObjectWithDataArgs {
        scene: Scene;
        data: core.json.IScenePlainObjectData;
    }

    export interface IGetAssetsFromPlainObjectArgs {
        scene: Scene;
        finder: pack.core.PackFinder;
        data: core.json.IScenePlainObjectData;
    }

    export abstract class ScenePlainObjectExtension extends SceneObjectExtension {

        static POINT_ID = "phasereditor2d.scene.ui.sceneobjects.ScenePlainObjectExtension";

        private _category: string;

        constructor(config: {
            category: string,
            typeName: string,
            phaserTypeName: string,
            iconName: string,
        }) {
            super({
                extensionPoint: ScenePlainObjectExtension.POINT_ID,
                ...config
            });

            this._category = config.category;
        }

        /**
         * Create the plain object of this extension with the data involved in a deserialization.
         *
         * @param args The data involved in the creation of the object.
         */
        abstract createPlainObjectWithData(args: ICreatePlainObjectWithDataArgs): sceneobjects.IScenePlainObject;

        /**
         * Get the assets contained in a plain object data.
         * The result of this method may be used to prepare the scene loader before de-serialize an object.
         *
         * @param args This method args.
         * @returns The assets.
         */
        async abstract getAssetsFromObjectData(args: IGetAssetsFromPlainObjectArgs): Promise<any[]>;

        getCategory() {

            return this._category;
        }
    }
}