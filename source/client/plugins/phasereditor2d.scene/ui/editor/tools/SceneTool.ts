namespace phasereditor2d.scene.ui.editor.tools {

    import ISceneObject = ui.sceneobjects.ISceneObject;

    export interface ISceneToolContextArgs {

        editor: SceneEditor;
        camera: Phaser.Cameras.Scene2D.Camera;
        objects: ISceneObject[];
    }

    export interface ISceneToolRenderArgs extends ISceneToolContextArgs {

        context: CanvasRenderingContext2D;
    }

    export interface ISceneToolDragEventArgs extends ISceneToolContextArgs {

        x: number;
        y: number;
    }

    export abstract class SceneTool {

        private _id: string;
        private _items: SceneToolItem[];

        constructor(id: string) {

            this._id = id;
            this._items = [];
        }

        getId() {
            return this._id;
        }

        getItems() {
            return this._items;
        }

        addItems(...items: SceneToolItem[]) {

            this._items.push(...items);
        }

        abstract canEdit(obj: unknown): boolean;

        render(args: ISceneToolRenderArgs): void {

            for (const item of this._items) {

                item.render(args);
            }
        }

        containsPoint(args: ISceneToolDragEventArgs) {

            for (const item of this._items) {

                if (item.containsPoint(args)) {
                    return true;
                }
            }

            return false;
        }

        onStartDrag(args: ISceneToolDragEventArgs) {

            for (const item of this._items) {

                item.onStartDrag(args);
            }
        }

        onDrag(args: ISceneToolDragEventArgs) {

            for (const item of this._items) {

                item.onDrag(args);
            }
        }

        onStopDrag(args: ISceneToolDragEventArgs) {

            for (const item of this._items) {

                item.onStopDrag(args);
            }
        }
    }
}