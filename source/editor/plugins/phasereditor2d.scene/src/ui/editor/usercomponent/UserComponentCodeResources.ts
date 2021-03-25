namespace phasereditor2d.scene.ui.editor.usercomponent {

    export class UserComponentCodeResources extends core.code.CodeResources {

        private static _instance = new UserComponentCodeResources();

        static getInstance() {

            return this._instance;
        }

        private constructor() {
            super();

            this.addResource("usercomponent.js", "data/UserComponent.js.txt");
            this.addResource("usercomponent.module.js", "data/UserComponent.module.js.txt");
            this.addResource("usercomponent.ts", "data/UserComponent.ts.txt");
            this.addResource("usercomponent.module.ts", "data/UserComponent.module.ts.txt");
        }
    }
}