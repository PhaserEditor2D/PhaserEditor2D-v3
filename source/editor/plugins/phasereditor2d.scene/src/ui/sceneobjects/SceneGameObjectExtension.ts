/// <reference path="./SceneObjectExtension.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;
    import code = core.code;

    export interface ICreateWithAssetArgs {

        x: number;
        y: number;
        scene: Scene;
        asset: any;
    }

    export interface ICreateWithDataArgs {

        scene: Scene;
        parent: ISceneGameObject;
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

        obj: ISceneGameObject;
        gameObjectFactoryExpr: string;
        sceneExpr: string;
        parentVarName: string;
        unit: code.UnitCodeDOM;
    }

    export interface IBuildPrefabConstructorCodeDOMArgs {

        obj: ISceneGameObject;
        sceneExpr: string;
        parentVarName?: string;
        methodCallDOM: code.MethodCallCodeDOM;
        unit: code.UnitCodeDOM;
        prefabSerializer: json.Serializer;
    }

    export interface IBuildPrefabConstructorDeclarationCodeDOM {

        ctrDeclCodeDOM: code.MethodDeclCodeDOM;
        prefabObj: ISceneGameObject;
        importTypes: string[];
        unit: code.UnitCodeDOM;
        isESModule: boolean;
    }

    export interface IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs {

        superMethodCallCodeDOM: code.MethodCallCodeDOM;
        prefabObj: ISceneGameObject;
        unit: code.UnitCodeDOM;
    }

    export abstract class SceneGameObjectExtension extends SceneObjectExtension {

        static POINT_ID = "phasereditor2d.scene.ui.SceneGameObjectExtension";

        constructor(config: {
            typeName: string,
            typeNameES?: string;
            typeNameAlias?: string[],
            phaserTypeName: string,
            phaserTypeThirdPartyLib?: string,
            phaserTypeThirdPartyLibModule?: string,
            category: string,
            icon: colibri.ui.controls.IconDescriptor,
        }) {
            super({
                extensionPoint: SceneGameObjectExtension.POINT_ID,
                ...config
            });
        }

        /**
         * Adapt the data taken from a type conversion.
         *
         * @param serializer Serializer of the data resulted by the type-conversion.
         * @param originalObject The original object that was converted.
         * @param extraData Sometimes, to create the object, some extra data is needed.
         * For example, the bitmap font of a bitmap text.
         */
        adaptDataAfterTypeConversion(serializer: json.Serializer, originalObject: ISceneGameObject, extraData: any) {
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
        abstract createSceneObjectWithAsset(args: ICreateWithAssetArgs): sceneobjects.ISceneGameObject | Promise<sceneobjects.ISceneGameObject>;

        /**
         * Create the scene object of this extension with the data involved in a deserialization.
         *
         * @param args The data involved in the creation of the object.
         */
        abstract createGameObjectWithData(args: ICreateWithDataArgs): sceneobjects.ISceneGameObject;

        /**
         * Get the assets contained in a scene object data.
         * The result of this method may be used to prepare the scene loader before de-serialize an object.
         *
         * @param args This method args.
         * @returns The assets.
         */
        abstract getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]>;

        /**
         * Gets a CodeDOM provider used by the Scene compiler to generate the object creation and prefab class codes.
         */
        abstract getCodeDOMBuilder(): GameObjectCodeDOMBuilder;

        createInitObjectDataFromChild(childData: json.IObjectData): json.IObjectData {

            return {
                id: childData.id,
                prefabId: childData.prefabId,
                type: childData.type,
                label: childData.label,
            }
        }
    }
}