namespace phasereditor2d.scene.ui.viewers {

    export class PhaserTypeSymbol {

        private static _symbols: PhaserTypeSymbol[];

        static getSymbols() {

            if (!this._symbols) {

                this._symbols = ScenePlugin.getInstance().getGameObjectExtensions()
                    .map(e => new PhaserTypeSymbol(e.getPhaserTypeName()))

                this._symbols = [new PhaserTypeSymbol("Phaser.Scene"), ...this._symbols];
            }

            return this._symbols;
        }

        private _displayName: string;

        constructor(private typeName: string) {

            this._displayName = typeName.split(".").pop();
        }

        getPhaserType() {

            return this.typeName;
        }

        getDisplayName() {

            return this._displayName;
        }
    }
}