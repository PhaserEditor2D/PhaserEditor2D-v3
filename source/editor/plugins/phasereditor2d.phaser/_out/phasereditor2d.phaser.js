var phasereditor2d;
(function (phasereditor2d) {
    var phaser;
    (function (phaser) {
        class PhaserPlugin extends colibri.Plugin {
            constructor() {
                super("phasereditor2d.phaser");
            }
            static getInstance() {
                return this._instance;
            }
        }
        PhaserPlugin._instance = new PhaserPlugin();
        phaser.PhaserPlugin = PhaserPlugin;
    })(phaser = phasereditor2d.phaser || (phasereditor2d.phaser = {}));
})(phasereditor2d || (phasereditor2d = {}));
// Type definitions specifically for Matter.js as used by Phaser 3
//
// Definitions by: Ivane Gegia <https://twitter.com/ivanegegia>,
//                 David Asmuth <https://github.com/piranha771>,
//                 Piotr Pietrzak <https://github.com/hasparus>,
//                 Richard Davey <rich@photonstorm.com>
