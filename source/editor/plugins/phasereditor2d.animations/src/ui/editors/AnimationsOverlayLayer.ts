namespace phasereditor2d.animations.ui.editors {

    import controls = colibri.ui.controls;

    export class AnimationsOverlayLayer extends scene.ui.editor.BaseOverlayLayer {

        private _editor: AnimationsEditor;

        constructor(editor: AnimationsEditor) {
            super();

            this._editor = editor;
        }

        protected renderLayer() {

            const scene = this._editor.getScene();

            const ctx = this.getContext();

            ctx.save();

            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";

            for (const obj of scene.sys.displayList.list) {

                const sprite = obj as Phaser.GameObjects.Sprite;

                const selected = sprite.getData("selected");

                const cell = sprite.getData("cell");

                if (selected && cell) {

                    controls.Controls.drawRoundedRect(ctx, cell.x, cell.y, cell.size, cell.size);
                }
            }

            ctx.restore();
        }
    }
}