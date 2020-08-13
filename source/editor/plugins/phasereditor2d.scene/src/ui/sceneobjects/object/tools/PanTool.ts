namespace phasereditor2d.scene.ui.sceneobjects {

    export class PanTool extends editor.tools.SceneTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.PanTool";
        private _dragStartPoint: Phaser.Math.Vector2;
        _dragStartCameraScroll: Phaser.Math.Vector2;

        constructor() {
            super({
                command: editor.commands.CMD_PAN_SCENE,
                id: PanTool.ID
            });
        }

        onActivated(args: editor.tools.ISceneToolContextArgs) {

            this.setCursor(args.editor, "grab");
        }

        onDeactivated(args: editor.tools.ISceneToolContextArgs) {

           this.setCursor(args.editor, "auto");
        }

        private setCursor(editor: editor.SceneEditor, style: string) {

            editor.getOverlayLayer().getCanvas().style.cursor = style;
        }

        onStartDrag(args: editor.tools.ISceneToolDragEventArgs) {

            const camera = args.camera;
            const e = args.event;

            this._dragStartPoint = new Phaser.Math.Vector2(e.offsetX, e.offsetY);
            this._dragStartCameraScroll = new Phaser.Math.Vector2(camera.scrollX, camera.scrollY);

            args.event.preventDefault();
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs) {

            this.setCursor(args.editor, "grabbing");

            const e = args.event;

            const dx = this._dragStartPoint.x - e.offsetX;
            const dy = this._dragStartPoint.y - e.offsetY;

            const camera = args.camera;

            camera.scrollX = this._dragStartCameraScroll.x + dx / camera.zoom;
            camera.scrollY = this._dragStartCameraScroll.y + dy / camera.zoom;

            e.preventDefault();

            args.editor.repaint();
        }

        onStopDrag(args: editor.tools.ISceneToolDragEventArgs) {

            this.setCursor(args.editor, "grab");
        }

        render(args: editor.tools.ISceneToolRenderArgs) {
            // nothing
        }

        canEdit(obj: unknown): boolean {

            return false;
        }

        canRender(obj: unknown): boolean {

            return false;
        }

        isObjectTool() {

            return false;
        }
    }
}