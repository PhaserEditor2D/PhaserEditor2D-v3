namespace colibri.inspector {

    export class InspectorPlugin extends colibri.Plugin {

        private static _instance = new InspectorPlugin();

        static getInstance() {
            return this._instance;
        }

        private constructor() {
            super("colibri.inspector");
        }
    }

    colibri.Platform.addPlugin(InspectorPlugin.getInstance());
}