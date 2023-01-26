/// <reference path="./BaseObjectTool.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class PolygonTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.PolygonTool";

        private _toolItem: PolygonToolItem;

        constructor() {
            super({
                id: PolygonTool.ID,
                command: editor.commands.CMD_EDIT_POLYGON_OBJECT,
            }, PolygonComponent.points);

            this._toolItem = new PolygonToolItem();
            this.addItems(this._toolItem);
        }

        handleDoubleClick(args: editor.tools.ISceneToolContextArgs): boolean {
    
            return this._toolItem.handleDoubleClick(args);
        }

        handleDeleteCommand(args: editor.tools.ISceneToolContextArgs): boolean {
    
            return this._toolItem.handleDeleteCommand(args);
        }

        requiresRepaintOnMouseMove() {

            return true;
        }

        onActivated(args: editor.tools.ISceneToolContextArgs) {

            this.confirmUnlockProperty(args, [PolygonComponent.points],
                "points", PolygonSection.SECTION_ID);
        }

        isValidForAll(objects: ISceneGameObject[]): boolean {
            
            return objects.length === 1;
        }

        canRender(obj: unknown): boolean {

            return obj instanceof Polygon;
        }
    }
}