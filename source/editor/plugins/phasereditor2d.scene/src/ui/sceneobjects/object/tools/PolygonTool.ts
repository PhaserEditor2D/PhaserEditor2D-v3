/// <reference path="./BaseObjectTool.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class PolygonTool extends BaseObjectTool {

        static ID = "phasereditor2d.scene.ui.sceneobjects.PolygonTool";

        constructor() {
            super({
                id: PolygonTool.ID,
                command: editor.commands.CMD_EDIT_POLYGON_OBJECT,
            }, PolygonComponent.points);

            this.addItems(new PolygonToolItem());
        }

        onActivated(args: editor.tools.ISceneToolContextArgs) {

            this.confirmUnlockProperty(args, [PolygonComponent.points],
                "points", PolygonSection.SECTION_ID);
        }

        canRender(obj: unknown): boolean {

            return obj instanceof Polygon;
        }
    }
}



// /// <reference path="./BaseObjectTool.ts" />

// namespace phasereditor2d.scene.ui.sceneobjects {

//     export class PolygonTool extends BaseObjectTool {

//         static ID = "phasereditor2d.scene.ui.sceneobjects.PolygonTool";

//         constructor() {
//             super({
//                 id: PolygonTool.ID,
//                 command: editor.commands.CMD_EDIT_POLYGON_OBJECT,
//             }, PolygonComponent.points);
//         }

//         onActivated(args: editor.tools.ISceneToolContextArgs) {

//             if (args.objects.length === 1
//                 && args.objects[0].getEditorSupport().hasComponent(PolygonComponent)) {

//                 this.clearItems();

//                 const polygon = args.objects[0] as Polygon;

//                 for (let i = 0; i < polygon.getPolygonGeom().points.length; i++) {

//                     this.addItems(new PolygonToolItem(i));
//                 }

//                 super.onActivated(args);

//                 this.confirmUnlockProperty(args, [PolygonComponent.points],
//                     "points", PolygonSection.SECTION_ID);
//             }
//         }
//     }
// }