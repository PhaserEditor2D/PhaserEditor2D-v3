namespace phasereditor2d.scene.ui.sceneobjects {

    export class KeyboardKeyExtension extends ScenePlainObjectExtension {

        private static _instance = new KeyboardKeyExtension();

        static getInstance() {

            return this._instance;
        }

        constructor() {
            super({
                category: SCENE_OBJECT_INPUT_CATEGORY,
                phaserTypeName: "Phaser.Input.Keyboard.Key",
                icon: resources.getIconDescriptor(resources.ICON_KEYBOARD_KEY),
                typeName: "Keyboard.Key",
            });
        }

        createPlainObjectWithData(args: ICreatePlainObjectWithDataArgs) {

            const key = new KeyboardKey(args.scene);

            key.getEditorSupport().readJSON(args.data);

            return key;
        }

        async getAssetsFromObjectData(args: IGetAssetsFromPlainObjectArgs) {

            return [];
        }

        buildCreateObjectWithFactoryCodeDOM(args: IBuildPlainObjectFactoryCodeDOMArgs): IBuildPlainObjectFactoryCodeDOMResult {

            const obj = args.obj as KeyboardKey;

            const sceneCtx = obj.getEditorSupport().getScene().isPrefabSceneType() ? "this.scene" : "this";

            const call = new core.code.MethodCallCodeDOM("addKey", `${sceneCtx}.input.keyboard`);
            call.setOptionalContext(true);
            call.arg(`Phaser.Input.Keyboard.KeyCodes.${obj.keyCode}`);

            return {
                firstStatements: [call],
                objectFactoryMethodCall: call,
            };
        }

        createDefaultSceneObject(args: ICreateDefaultArgs): ISceneObject[] {

            return [new KeyboardKey(args.scene)];
        }

        private _keyCodes: string[];

        getKeyCodes() {

            if (!this._keyCodes) {

                this._keyCodes = [];

                for(const k in Phaser.Input.Keyboard.KeyCodes) {

                    this._keyCodes.push(k);
                }
            }

            return this._keyCodes;

        }
    }
}