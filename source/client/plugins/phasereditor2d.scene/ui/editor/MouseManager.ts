namespace phasereditor2d.scene.ui.editor {

    export class MouseManager {

        private _editor: SceneEditor;
        private _toolInAction: boolean;

        constructor(editor: SceneEditor) {

            this._editor = editor;

            this._toolInAction = false;

            const canvas = editor.getOverlayLayer().getCanvas();

            canvas.addEventListener("click", e => this.onClick(e));
            canvas.addEventListener("mousedown", e => this.onMouseDown(e));
            canvas.addEventListener("mouseup", e => this.onMouseUp(e));
            canvas.addEventListener("mousemove", e => this.onMouseMove(e));
        }

        private createArgs(e: MouseEvent) {
            return {
                camera: this._editor.getScene().getCamera(),
                editor: this._editor,
                objects: this._editor.getSelection(),
                x: e.offsetX,
                y: e.offsetY
            };
        }

        private onMouseDown(e: MouseEvent) {

            const toolsManager = this._editor.getToolsManager();

            const tool = toolsManager.getActiveTool();

            if (tool) {

                const args = this.createArgs(e);

                if (tool.containsPoint(args)) {

                    this._toolInAction = true;

                    tool.onStartDrag(args);
                }
            }
        }

        private onMouseMove(e: MouseEvent) {

            const toolsManager = this._editor.getToolsManager();

            const tool = toolsManager.getActiveTool();

            if (tool) {

                const args = this.createArgs(e);

                tool.onDrag(args);
            }
        }

        private onMouseUp(e: MouseEvent) {

            const toolsManager = this._editor.getToolsManager();

            const tool = toolsManager.getActiveTool();

            if (tool) {

                const args = this.createArgs(e);

                tool.onStopDrag(args);
            }
        }

        private onClick(e: MouseEvent) {

            if (this._toolInAction) {

                this._toolInAction = false;

                return;
            }

            const selManager = this._editor.getSelectionManager();
            const toolsManager = this._editor.getToolsManager();

            const tool = toolsManager.getActiveTool();

            if (tool) {

                const args = this.createArgs(e);

                if (tool.containsPoint(args)) {
                    return;
                }
            }

            selManager.onMouseClick(e);
        }
    }
}