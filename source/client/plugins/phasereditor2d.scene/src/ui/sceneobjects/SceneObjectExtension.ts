namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;
    import code = core.code;

    export interface ICreateExtraDataResult {

        dataNotFoundMessage?: string;
        abort?: boolean;
        data?: any;
    }

    export interface ICreateWithAssetArgs {

        x: number;
        y: number;
        scene: Scene;
        asset: any;
    }

    export interface ICreateEmptyArgs {

        x: number;
        y: number;
        scene: Scene;
        extraData?: any;
    }

    export interface ICreateWithDataArgs {

        scene: Scene;
        data: json.IObjectData;
    }

    export interface IGetAssetsFromObjectArgs {

        serializer: json.Serializer;
        scene: Scene;
        finder: pack.core.PackFinder;
    }

    export interface IUpdateLoaderWithAsset {

        asset: any;
        scene: Scene;
    }

    export interface IBuildObjectFactoryCodeDOMArgs {

        obj: ISceneObject;
        gameObjectFactoryExpr: string;
    }

    export interface IBuildPrefabConstructorCodeDOMArgs {

        obj: ISceneObject;
        sceneExpr: string;
        methodCallDOM: code.MethodCallCodeDOM;
        prefabSerializer: json.Serializer;
    }

    export interface IBuildPrefabConstructorDeclarationCodeDOM {

        ctrDeclCodeDOM: code.MethodDeclCodeDOM;
    }

    export interface IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs {

        superMethodCallCodeDOM: code.MethodCallCodeDOM;
        prefabObj: ISceneObject;
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
         * Adapt the data taken from a type conversion.
         *
         * @param serializer Serializer of the data resulted by the type-conversion.
         * @param originalObject The original object that was converted.
         */
        adaptDataAfterTypeConversion(serializer: json.Serializer, originalObject: ISceneObject) {
            // nothing by default
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
        abstract createSceneObjectWithAsset(args: ICreateWithAssetArgs): sceneobjects.ISceneObject;

        /**
         * Collect the data used to create a new, empty object. For example, a BitmapText requires
         * a BitmapFont key to be created, so this method opens a dialog to select the font.
         */
        async collectExtraDataForCreateEmptyObject(): Promise<ICreateExtraDataResult> {

            return {};
        }

        /**
         * Create an empty object of this extension.
         *
         * @param args The data needed to create the object.
         */
        abstract createEmptySceneObject(args: ICreateEmptyArgs): sceneobjects.ISceneObject;

        /**
         * Create the scene object of this extension with the data involved in a deserialization.
         *
         * @param args The data involved in the creation of the object.
         */
        abstract createSceneObjectWithData(args: ICreateWithDataArgs): sceneobjects.ISceneObject;

        /**
         * Get the assets contained in a scene object data.
         * The result of this method may be used to prepare the scene loader before de-serialize an object.
         *
         * @param args This method args.
         * @returns The assets.
         */
        async abstract getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]>;

        /**
         * Gets a CodeDOM provider used by the Scene compiler to generate the object creation and prefab class codes.
         */
        abstract getCodeDOMBuilder(): ObjectCodeDOMBuilder;
    }
}