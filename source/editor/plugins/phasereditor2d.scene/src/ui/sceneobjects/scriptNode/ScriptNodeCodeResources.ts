namespace phasereditor2d.scene.ui.sceneobjects {

    export class ScriptNodeCodeResources extends core.code.CodeResources {

        private static _instance = new ScriptNodeCodeResources();

        static getInstance() {

            return this._instance;
        }

        private constructor() {
            super(ScenePlugin.getInstance());

            this.addCodeResource("ScriptNode");
        }
    }
}