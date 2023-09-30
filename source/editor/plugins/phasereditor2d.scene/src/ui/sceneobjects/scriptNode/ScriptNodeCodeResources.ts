namespace phasereditor2d.scene.ui.sceneobjects {

    export class ScriptNodeCodeResources extends core.code.CodeResources2 {

        private static _instance = new ScriptNodeCodeResources();

        static getInstance() {

            return this._instance;
        }

        private constructor() {
            super("phasereditor2d.scene/code/scriptnode");

            this.addCodeResource("ScriptNode");
        }
    }
}