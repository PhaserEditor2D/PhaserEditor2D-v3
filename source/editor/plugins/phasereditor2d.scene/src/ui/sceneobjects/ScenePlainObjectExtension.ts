namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export interface ICreatePlainObjectWithDataArgs {
        scene: Scene;
        data: core.json.IScenePlainObjectData;
    }

    export interface IGetAssetsFromPlainObjectArgs {
        scene: Scene;
        finder: pack.core.PackFinder;
        data: core.json.IScenePlainObjectData;
    }

    export interface IBuildPlainObjectFactoryCodeDOMArgs {

        obj: IScenePlainObject;
        varname: string;
        gameObjectFactoryExpr: string;
    }

    export interface IBuildPlainObjectFactoryCodeDOMResult {
        firstStatements?: code.CodeDOM[];
        lazyStatements?: code.CodeDOM[];
        objectFactoryMethodCall: code.MethodCallCodeDOM;
    }

    export abstract class ScenePlainObjectExtension extends SceneObjectExtension {

        static POINT_ID = "phasereditor2d.scene.ui.sceneobjects.ScenePlainObjectExtension";

        constructor(config: {
            category: string,
            typeName: string,
            typeNameAlias?: string[],
            phaserTypeName: string,
            icon: colibri.ui.controls.IconDescriptor,
        }) {
            super({
                extensionPoint: ScenePlainObjectExtension.POINT_ID,
                ...config
            });
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
        abstract getAssetsFromObjectData(args: IGetAssetsFromPlainObjectArgs): Promise<any[]>;

        /**
         * Build a method call CodeDOM to create the scene plain object of this extension,
         * using the factories provided by Phaser.
         *
         * This method is used by the Scene compiler.
         *
         * @param args This method args.
         */
        abstract buildCreateObjectWithFactoryCodeDOM(args: IBuildPlainObjectFactoryCodeDOMArgs): IBuildPlainObjectFactoryCodeDOMResult;
    }
}