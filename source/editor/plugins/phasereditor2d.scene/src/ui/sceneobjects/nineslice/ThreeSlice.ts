namespace phasereditor2d.scene.ui.sceneobjects {

    export class ThreeSlice extends Phaser.GameObjects.NineSlice implements ISceneGameObject {

        private _editorSupport: ThreeSliceEditorSupport;

        constructor(
            scene: Scene, x: number, y: number,
            texture: string, frame: string | number, width: number,
            leftWidth: number, rightWidth: number
        ) {
            super(scene, x, y, texture || "__MISSING", frame, width, 0,
                leftWidth, rightWidth, 0, 0);

            this._editorSupport = new ThreeSliceEditorSupport(this, scene);
        }

        getEditorSupport() {

            return this._editorSupport;
        }

        setTexture(key: string | Phaser.Textures.Texture, frame?: string | number): this {

            super.setTexture(key, frame);

            if (this.is3Slice) {

                this.setSizeToFrame();
            }

            return this;
        }

        setSize(width: number, height: number): this {

            if (this.is3Slice) {

                super.setSize(width, this.height);

            } else {

                super.setSize(width, height);
            }

            return this;
        }
    }
}
