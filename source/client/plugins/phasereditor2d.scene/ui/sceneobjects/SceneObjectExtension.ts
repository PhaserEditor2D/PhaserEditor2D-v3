namespace phasereditor2d.scene.ui.sceneobjects {

    export interface CreateWithAssetArgs {
        x: number;
        y: number;
        nameMaker: colibri.ui.ide.utils.NameMaker;
        scene: GameScene;
        asset: any;
    }

    export interface CreateWithDataArgs {
        scene: GameScene;
        data: any;
    }

    export abstract class SceneObjectExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.scene.ui.SceneObjectExtension";

        private _typeName: string;
        private _phaserTypeName: string;

        constructor(config: {
            typeName: string,
            phaserTypeName: string
        }) {
            super(SceneObjectExtension.POINT_ID);

            this._typeName = config.typeName;
            this._phaserTypeName = config.phaserTypeName;
        }

        getTypeName() {
            return this._typeName;
        }

        getPhaserTypeName() {
            return this._phaserTypeName;
        }

        /**
         * Check if an object dropped into the scene can be used to create the scene object of this extension.
         *
         * @param data Data dropped from outside the scene editor. For example, items from the Blocks view.
         */
        abstract acceptsDropData(data: any): boolean;

        /**
         * Create the scene object of this extension with the data involved in a drop action.
         * The data was tested before with the `acceptsDropData()` method.
         *
         * @param args The data involved in a drop action.
         */
        abstract createSceneObjectWithAsset(args: CreateWithAssetArgs): sceneobjects.SceneObject;

        /**
         * Create the scene object of this extension with the data involved in a deserialization.
         *
         * @param args The data involved in the creation of the object.
         */
        abstract createSceneObjectWithData(args: CreateWithDataArgs): sceneobjects.SceneObject;
    }
}