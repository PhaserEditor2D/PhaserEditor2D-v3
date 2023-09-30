namespace phasereditor2d.scene.ui.sceneobjects {

    export class ScriptNodeExtension extends SceneGameObjectExtension {

        private static _instance: ScriptNodeExtension;

        static getInstance() {

            return this._instance || (this._instance = new ScriptNodeExtension());
        }

        constructor() {
            super({
                typeName: "ScriptNode",
                phaserTypeName: "ScriptNode",
                category: SCENE_OBJECT_SCRIPT_CATEGORY,
                icon: resources.getIconDescriptor(resources.ICON_BUILD)
            });
        }

        getHelp(): string {
            
            return "A custom Phaser Editor 2D object for implementing game logic and object behaviors.";
        }

        acceptsDropData(data: any): boolean {
            
            return false;
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): ISceneGameObject {

            // not supported

            return null;
        }

        createGameObjectWithData(args: ICreateWithDataArgs): ISceneGameObject {
            
            const script = new ScriptNode(args.scene);

            script.getEditorSupport().readJSON(args.data);

            return script;
        }

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {
            
            return [];
        }

        getCodeDOMBuilder(): GameObjectCodeDOMBuilder {

            return new ScriptNodeCodeDOMBuilder();
        }

        createDefaultSceneObject(args: ICreateDefaultArgs): ISceneObject[] {
            
            const script = new ScriptNode(args.scene);

            return [script];
        }
    }
}