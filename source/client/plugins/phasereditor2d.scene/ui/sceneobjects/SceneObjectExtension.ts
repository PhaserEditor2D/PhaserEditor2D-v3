namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;
    import code = core.code;

    export interface CreateWithAssetArgs {

        x: number;
        y: number;
        scene: GameScene;
        asset: any;
    }

    export interface CreateWithDataArgs {

        scene: GameScene;
        data: json.ObjectData;
    }

    export interface GetAssetsFromObjectArgs {

        serializer: json.Serializer;
        scene: GameScene;
        finder: pack.core.PackFinder;
    }

    export interface UpdateLoaderWithAsset {

        asset: any;
        scene: GameScene;
    }

    export interface BuildObjectFactoryCodeDOMArgs {

        obj: SceneObject;
        gameObjectFactoryExpr: string;
    }

    export interface BuildPrefabConstructorCodeDOMArgs {

        obj: SceneObject;
        sceneExpr: string;
        methodCallDOM: code.MethodCallCodeDOM;
        prefabSerializer: json.Serializer;
    }

    export interface BuildPrefabConstructorDeclarationCodeDOM {

        ctrDeclCodeDOM: code.MethodDeclCodeDOM;
    }

    export interface BuildPrefabConstructorDeclarationSupperCallCodeDOMArgs {

        superMethodCallCodeDOM: code.MethodCallCodeDOM;
        prefabObj: SceneObject;
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

        /**
         * Get the assets contained in a scene object data.
         * The result of this method may be used to prepare the scene loader before de-serialize an object.
         *
         * @param args This method args.
         * @returns The assets.
         */
        async abstract getAssetsFromObjectData(args: GetAssetsFromObjectArgs): Promise<any[]>;

        /**
         * Build a method call CodeDOM to create the scene object of this extension,
         * using the factories provided by Phaser.
         *
         * This method is used by the Scene compiler.
         *
         * @param args This method args.
         */
        abstract buildCreateObjectWithFactoryCodeDOM(args: BuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM;

        /**
         * Build a CodeDOM expression to create a prefab instance that
         * has as root type the same type of this scene object type.
         *
         * This method is used by the Scene compiler.
         *
         * @param args This method args.
         */
        abstract buildCreatePrefabInstanceCodeDOM(args: BuildPrefabConstructorCodeDOMArgs): void;

        /**
         * Build the CodeDOM of the prefab class constructor.
         *
         * This method is used by the Scene compiler.
         *
         * @param args This method args.
         */
        abstract buildPrefabConstructorDeclarationCodeDOM(args: BuildPrefabConstructorDeclarationCodeDOM): void;

       /**
        * Build the CodeDOM of the super-method call in a prefab constructor.
        *
        * This method is used by the Scene compiler.
        *
        * @param args This method args.
        */
        abstract buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: BuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void;
    }
}