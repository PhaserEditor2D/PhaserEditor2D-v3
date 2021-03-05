/// <reference path="./BaseOverlayLayer.ts" />
namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;

    export class OverlayLayer extends BaseOverlayLayer {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {
            super();

            this._editor = editor;
        }

        protected renderLayer() {

            this.renderGrid();

            this.renderSelection();

            this.renderTools();
        }

        private renderTools() {

            const manager = this._editor.getToolsManager();

            const tool = manager.getActiveTool();

            if (!tool) {
                return;
            }

            const renderSel = this._editor.getSelection().filter(obj => tool.canRender(obj));

            if (renderSel.length === 0 && tool.isObjectTool()) {
                return;
            }

            const editSel = this._editor.getSelection().filter(obj => tool.canEdit(obj));

            const ctx = this.getContext();

            ctx.save();

            tool.render({
                editor: this._editor,
                localCoords: this._editor.isLocalCoords(),
                canvasContext: ctx,
                objects: renderSel,
                canEdit: editSel.length === renderSel.length,
                camera: this._editor.getScene().getCamera()
            });

            ctx.restore();
        }

        private renderSelection() {

            const ctx = this.getContext();

            ctx.save();

            const camera = this._editor.getScene().getCamera();

            for (const obj of this._editor.getSelection()) {

                if (sceneobjects.isGameObject(obj)) {

                    const sprite = obj as sceneobjects.ISceneGameObject;

                    const points = sprite.getEditorSupport().getScreenBounds(camera);

                    if (points.length === 4) {

                        ctx.strokeStyle = "black";
                        ctx.lineWidth = 4;

                        ctx.beginPath();
                        ctx.moveTo(points[0].x, points[0].y);
                        ctx.lineTo(points[1].x, points[1].y);
                        ctx.lineTo(points[2].x, points[2].y);
                        ctx.lineTo(points[3].x, points[3].y);
                        ctx.closePath();
                        ctx.stroke();

                        ctx.strokeStyle = "#00ff00";
                        // ctx.strokeStyle = controls.Controls.getTheme().viewerSelectionBackground;

                        ctx.lineWidth = 2;

                        ctx.beginPath();
                        ctx.moveTo(points[0].x, points[0].y);
                        ctx.lineTo(points[1].x, points[1].y);
                        ctx.lineTo(points[2].x, points[2].y);
                        ctx.lineTo(points[3].x, points[3].y);
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
            }

            ctx.restore();
        }

        private renderGrid() {

            const settings = this._editor.getScene().getSettings();

            const camera = this._editor.getScene().getCamera();

            // parameters from settings

            const snapEnabled = settings.snapEnabled;
            const snapX = settings.snapWidth;
            const snapY = settings.snapHeight;

            const borderX = settings.borderX;
            const borderY = settings.borderY;
            const borderWidth = settings.borderWidth;
            const borderHeight = settings.borderHeight;

            const canvasWidth = this.getCanvas().width;
            const canvasHeight = this.getCanvas().height;

            const ctx = this.getContext();

            // render grid

            const theme = controls.Controls.getTheme();

            ctx.strokeStyle = theme.dark ? "#6e6e6eaa" : "#bebebecc";
            ctx.lineWidth = 1;

            let gapX = 4;
            let gapY = 4;

            if (snapEnabled) {
                gapX = snapX;
                gapY = snapY;
            }

            {
                for (let i = 1; true; i++) {
                    const delta = camera.getScreenPoint(gapX * i, gapY * i).subtract(camera.getScreenPoint(0, 0));
                    if (delta.x > 64 && delta.y > 64) {
                        gapX = gapX * i;
                        gapY = gapY * i;
                        break;
                    }
                }
            }

            const worldStartPoint = camera.getWorldPoint(0, 0);

            worldStartPoint.x = Phaser.Math.Snap.Floor(worldStartPoint.x, gapX);
            worldStartPoint.y = Phaser.Math.Snap.Floor(worldStartPoint.y, gapY);

            const worldEndPoint = camera.getWorldPoint(canvasWidth, canvasHeight);

            const grid = (
                render: {
                    horizontal: (worldX: number, screenX: number) => void,
                    vertical: (worldY: number, screenY: number) => void
                }
            ) => {

                let worldY = worldStartPoint.y;

                while (worldY < worldEndPoint.y) {

                    const point = camera.getScreenPoint(0, worldY);
                    render.horizontal(worldY, Math.floor(point.y));
                    worldY += gapY;
                }

                let worldX = worldStartPoint.x;
                while (worldX < worldEndPoint.x) {
                    const point = camera.getScreenPoint(worldX, 0);
                    render.vertical(worldX, Math.floor(point.x));
                    worldX += gapX;
                }
            };

            let labelWidth = 0;

            ctx.save();
            ctx.fillStyle = ctx.strokeStyle;

            // labels

            grid({
                horizontal: (worldY, screenY) => {
                    const w = ctx.measureText(worldY.toString()).width;
                    labelWidth = Math.max(labelWidth, w + 2);
                    ctx.save();
                    ctx.fillStyle = "#000000";
                    ctx.fillText(worldY.toString(), 0 + 1, screenY + 4 + 1);
                    ctx.restore();
                    ctx.fillText(worldY.toString(), 0, screenY + 4);
                },
                vertical: (worldX, screenX) => {
                    if (screenX < labelWidth) {
                        return;
                    }
                    const w = ctx.measureText(worldX.toString()).width;
                    ctx.save();
                    ctx.fillStyle = "#000000";
                    ctx.fillText(worldX.toString(), screenX - w / 2 + 1, 15 + 1);
                    ctx.restore();
                    ctx.fillText(worldX.toString(), screenX - w / 2, 15);
                }
            });

            // lines

            grid({
                horizontal: (worldY, screenY) => {
                    if (screenY < 20) {
                        return;
                    }
                    ctx.beginPath();
                    ctx.moveTo(labelWidth, screenY);
                    ctx.lineTo(canvasWidth, screenY);
                    ctx.stroke();
                },
                vertical: (worldX, screenX) => {
                    if (screenX < labelWidth) {
                        return;
                    }
                    ctx.beginPath();
                    ctx.moveTo(screenX, 20);
                    ctx.lineTo(screenX, canvasHeight);
                    ctx.stroke();
                }
            });

            ctx.restore();

            {
                ctx.save();
                ctx.lineWidth = 2;
                const a = camera.getScreenPoint(borderX, borderY);
                const b = camera.getScreenPoint(borderX + borderWidth, borderY + borderHeight);
                ctx.save();
                ctx.strokeStyle = theme.dark ? "#0a0a0a" : "#404040";
                ctx.strokeRect(a.x + 2, a.y + 2, b.x - a.x, b.y - a.y);
                ctx.restore();

                ctx.lineWidth = 1;
                ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
                ctx.restore();
            }
        }
    }

}