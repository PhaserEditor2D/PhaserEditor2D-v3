namespace phasereditor2d.scene.ui.editor.tools {

    import ISceneObject = ui.sceneobjects.ISceneGameObject;
    import controls = colibri.ui.controls;

    export interface ISceneToolContextArgs {

        editor: SceneEditor;
        localCoords: boolean;
        camera: Phaser.Cameras.Scene2D.Camera;
        objects: ISceneObject[];
    }

    export interface ISceneToolRenderArgs extends ISceneToolContextArgs {

        canvasContext: CanvasRenderingContext2D;
        canEdit: boolean;
    }

    export interface ISceneToolDragEventArgs extends ISceneToolContextArgs {

        x: number;
        y: number;
        event: MouseEvent;
    }

    export interface ISceneToolConfig {

        id: string;
        command: string;
    }

    export abstract class SceneTool {

        static COLOR_CANNOT_EDIT = "#808080";

        private _config: ISceneToolConfig;
        private _items: SceneToolItem[];

        constructor(config: ISceneToolConfig) {

            this._config = config;
            this._items = [];
        }

        getId() {
            return this._config.id;
        }

        getCommandId() {
            return this._config.command;
        }

        getItems() {
            return this._items;
        }

        addItems(...items: SceneToolItem[]) {

            this._items.push(...items);
        }

        abstract canEdit(obj: unknown): boolean;

        abstract canRender(obj: unknown): boolean;

        isObjectTool() {

            return true;
        }

        render(args: ISceneToolRenderArgs): void {

            for (const item of this._items) {

                if (item.isValidFor(args.objects)) {

                    item.render(args);
                }
            }
        }

        containsPoint(args: ISceneToolDragEventArgs) {

            for (const item of this._items) {

                if (item.isValidFor(args.objects)) {

                    if (item.containsPoint(args)) {

                        return true;
                    }
                }
            }

            return false;
        }

        onStartDrag(args: ISceneToolDragEventArgs) {

            for (const item of this._items) {

                if (item.isValidFor(args.objects)) {

                    item.onStartDrag(args);
                }
            }
        }

        onDrag(args: ISceneToolDragEventArgs) {

            for (const item of this._items) {

                if (item.isValidFor(args.objects)) {

                    item.onDrag(args);
                }
            }
        }

        onStopDrag(args: ISceneToolDragEventArgs) {

            for (const item of this._items) {

                if (item.isValidFor(args.objects)) {

                    item.onStopDrag(args);
                }
            }
        }

        onActivated(args: ISceneToolContextArgs) {
            // nothing
        }

        onDeactivated(args: ISceneToolContextArgs) {
            // nothing
        }
    }
}