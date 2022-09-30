namespace phasereditor2d.scene.ui.sceneobjects {

    export class ColliderExtension extends ScenePlainObjectExtension {

        private static _instance = new ColliderExtension();

        static getInstance() {

            return this._instance;
        }

        constructor() {
            super({
                category: SCENE_OBJECT_ARCADE_CATEGORY,
                // TODO: collider icon
                icon: ScenePlugin.getInstance().getIconDescriptor(ICON_ARCADE_COLLIDER),
                phaserTypeName: "Phaser.Physics.Arcade.Collider",
                typeName: "Collider"
            })
        }

        createPlainObjectWithData(args: ICreatePlainObjectWithDataArgs): IScenePlainObject {

            const collider = new Collider(args.scene);

            collider.getEditorSupport().readJSON(args.data);

            return collider;
        }

        async getAssetsFromObjectData(args: IGetAssetsFromPlainObjectArgs): Promise<any[]> {

            return [];
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildPlainObjectFactoryCodeDOMArgs)
            : core.code.MethodCallCodeDOM[] {

            const obj = args.obj as Collider;

            const methodName = obj.onlyOverlap? "overlap" : "collider";

            const call = new core.code.MethodCallCodeDOM(methodName, `${args.gameObjectFactoryExpr}.physics.add`);

            call.arg(obj.object1 || "undefined");
            call.arg(obj.object2 || "undefined");

            return [call];
        }

        createDefaultSceneObject(args: ICreateDefaultArgs): ISceneObject[] {

            return [new Collider(args.scene)];
        }

        isAvailableAsPrefabElement(): boolean {
            
            return false;
        }
    }
}