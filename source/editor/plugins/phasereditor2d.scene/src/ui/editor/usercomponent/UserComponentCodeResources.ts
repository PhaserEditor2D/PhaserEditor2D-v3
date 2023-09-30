///<reference path="../../../core/code/CodeResources2.ts">

namespace phasereditor2d.scene.ui.editor.usercomponent {

    export class UserComponentCodeResources extends core.code.CodeResources2 {

        private static _instance = new UserComponentCodeResources();

        static getInstance() {

            return this._instance;
        }

        private constructor() {
            super("phasereditor2d.scene/code/usercomponent");

            this.addCodeResource("UserComponent");
        }
    }
}