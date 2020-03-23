namespace phasereditor2d.phaser {

    export class PhaserPlugin extends colibri.Plugin {

        private static _instance = new PhaserPlugin();

        static getInstance() {
            return this._instance;
        }

        constructor() {
            super("phasereditor2d.phaser");
        }
    }
}