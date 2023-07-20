namespace phasereditor2d.outline {

    export class OutlinePlugin extends colibri.Plugin {

        private static _instance = new OutlinePlugin();

        static getInstance() {
            return this._instance;
        }

        constructor() {
            super("phasereditor2d.outline");
        }
    }

    colibri.Platform.addPlugin(OutlinePlugin.getInstance());
}