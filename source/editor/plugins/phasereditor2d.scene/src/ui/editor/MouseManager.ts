namespace phasereditor2d.scene.ui.editor {

    export class MouseManager {

        private _editor: SceneEditor;
        private _toolInAction: boolean;
        private _mousePosition: { x: number, y: number };

        constructor(editor: SceneEditor) {

            this._editor = editor;

            this._toolInAction = false;

            const canvas = editor.getOverlayLayer().getCanvas();

            this._mousePosition = { x: 0, y: 0 };

            canvas.addEventListener("dblclick", e => this.onDoubleClick(e))
            canvas.addEventListener("click", e => this.onClick(e));
            canvas.addEventListener("mousedown", e => this.onMouseDown(e));
            canvas.addEventListener("mouseup", e => this.onMouseUp(e));
            canvas.addEventListener("mousemove", e => this.onMouseMove(e));
        }

        private createArgs(e: MouseEvent): tools.ISceneToolDragEventArgs {
            return {
                camera: this._editor.getScene().getCamera(),
                editor: this._editor,
                localCoords: this._editor.isLocalCoords(),
                objects: this._editor.getSelection(),
                x: e.offsetX,
                y: e.offsetY,
                event: e
            };
        }

        private onDoubleClick(e: MouseEvent) {

            if (this._editor.getToolsManager().handleDoubleClick()) {

                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }

        private onMouseDown(e: MouseEvent) {

            if (e.button !== 0 || e.altKey) {

                return;
            }

            const toolsManager = this._editor.getToolsManager();

            const tool = toolsManager.getActiveTool();

            if (tool) {

                const args = this.createArgs(e);

                if (tool.isObjectTool()) {

                    if (!tool.isValidForAll(args.objects)) {

                        return;
                    }

                    for (const obj of args.objects) {

                        if (!tool.canEdit(obj)) {

                            return;
                        }
                    }

                    if (tool.containsPoint(args)) {

                        this._toolInAction = true;

                        tool.onStartDrag(args);
                    }
                } else {

                    this._toolInAction = true;

                    tool.onStartDrag(args);
                }
            }
        }

        getMousePosition() {

            return this._mousePosition;
        }

        getDropPosition() {

            const p = this._editor.getScene().getCamera()
                .getWorldPoint(this._mousePosition.x, this._mousePosition.y);

            return this._editor.getScene().snapPoint(p.x, p.y);
        }

        private onMouseMove(e: MouseEvent) {

            if (e.button !== 0 || e.altKey) {

                return;
            }

            this._mousePosition.x = e.offsetX;
            this._mousePosition.y = e.offsetY;

            const toolsManager = this._editor.getToolsManager();

            const tool = toolsManager.getActiveTool();

            if (tool && tool.requiresRepaintOnMouseMove()) {

                if (this._editor.getScene().cameras) {

                    this._editor.getOverlayLayer().render();
                }
            }

            if (tool && this._toolInAction) {

                const args = this.createArgs(e);

                tool.onDrag(args);
            }
        }

        private onMouseUp(e: MouseEvent) {

            if (e.button !== 0 || e.altKey) {

                return;
            }

            const toolsManager = this._editor.getToolsManager();

            const tool = toolsManager.getActiveTool();

            if (tool) {

                const args = this.createArgs(e);

                if (tool.isObjectTool()) {

                    for (const obj of args.objects) {

                        if (!tool.canEdit(obj)) {
                            return;
                        }
                    }
                }

                tool.onStopDrag(args);
            }
        }

        private onClick(e: MouseEvent) {

            if (e.button !== 0 || e.altKey) {

                return;
            }

            if (this._toolInAction) {

                this._toolInAction = false;

                return;
            }

            const selManager = this._editor.getSelectionManager();
            const toolsManager = this._editor.getToolsManager();

            const tool = toolsManager.getActiveTool();

            if (tool) {

                const args = this.createArgs(e);

                let canEdit = true;

                for (const obj of args.objects) {

                    if (!tool.canEdit(obj)) {

                        canEdit = false;
                        break;
                    }
                }

                if (canEdit && tool.containsPoint(args)) {
                    return;
                }
            }

            selManager.onMouseClick(e);
        }
    }
}