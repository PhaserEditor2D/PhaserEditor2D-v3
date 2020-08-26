namespace phasereditor2d.scene.ui {

    export abstract class BaseScene extends Phaser.Scene {

        private _packCache: pack.core.parsers.AssetPackCache;
        private _maker: BaseSceneMaker;

        constructor(key: string) {

            super(key);

            this._packCache = new pack.core.parsers.AssetPackCache();

            this._maker = this.createSceneMaker();
        }

        abstract createSceneMaker(): BaseSceneMaker;

        getPackCache() {

            return this._packCache;
        }

        getMaker(): BaseSceneMaker {

            return this._maker;
        }

        getCamera() {

            return this.cameras.main;
        }

        destroyGame() {

            if (this.game) {

                this.game.destroy(true);
                this.game.loop.tick();
            }
        }
    }
}