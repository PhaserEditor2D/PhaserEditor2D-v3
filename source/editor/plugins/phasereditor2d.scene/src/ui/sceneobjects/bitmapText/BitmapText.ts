namespace phasereditor2d.scene.ui.sceneobjects {

    export class BitmapText extends Phaser.GameObjects.BitmapText implements ISceneGameObject {

        private _editorSupport: BitmapTextEditorSupport;

        private static getFont(scene: Scene, font: string) {

            let entry = scene.sys.cache.bitmapFont.get(font);

            if (!entry) {

                font = "__missing__";

                entry = scene.sys.cache.bitmapFont.get(font);

                if (!entry) {

                    const data: Phaser.Types.GameObjects.BitmapText.BitmapFontData = {
                        chars: {},
                        font,
                        lineHeight: 10,
                        retroFont: false,
                        size: 10
                    };

                    entry = { data };

                    scene.sys.cache.bitmapFont.add(font, entry);
                }
            }

            return font;
        }

        constructor(scene: Scene, x: number, y: number, font: string, text: string | string[]) {
            super(scene, x, y, BitmapText.getFont(scene, font), "New BitmapText");

            this._editorSupport = new BitmapTextEditorSupport(this, scene);
        }

        getEditorSupport(): BitmapTextEditorSupport {

            return this._editorSupport;
        }
    }
}