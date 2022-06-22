namespace phasereditor2d.scene.ui.sceneobjects {

    export class PolygonOperation extends editor.tools.SceneToolOperation<string> {

        getInitialValue(obj: any) {

            return PolygonToolItem.getInitialPoints(obj);
        }

        getFinalValue(obj: any) {

            return (obj as Polygon).points;
        }

        setValue(obj: any, value: string) {

            const polygon = obj as Polygon;

            polygon.points = value;
        }
    }
}