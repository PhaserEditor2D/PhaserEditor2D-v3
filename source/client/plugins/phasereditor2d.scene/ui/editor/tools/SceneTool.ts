namespace phasereditor2d.scene.ui.editor.tools {

    import ISceneObject = ui.sceneobjects.ISceneObject;

    export interface ISceneToolRenderArgs {

        camera: Phaser.Cameras.Scene2D.Camera;
        context: CanvasRenderingContext2D;
        objects: ISceneObject[];
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
    }
}