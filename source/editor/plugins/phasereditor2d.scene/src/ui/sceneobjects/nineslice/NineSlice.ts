namespace phasereditor2d.scene.ui.sceneobjects {

    export class NineSlice extends Phaser.GameObjects.NineSlice implements ISceneGameObject {

        private _editorSupport: NineSliceEditorSupport;

        constructor(
            scene: Scene, x: number, y: number,
            texture: string, frame: string | number, width: number, height: number,
            leftWidth: number, rightWidth: number, topHeight: number, bottomHeight: number
        ) {
            super(scene, x, y, texture || "__MISSING", frame, width, height,
                leftWidth, rightWidth, topHeight, bottomHeight);

            this._editorSupport = new NineSliceEditorSupport(this, scene);
        }

        getEditorSupport(): NineSliceEditorSupport {

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
