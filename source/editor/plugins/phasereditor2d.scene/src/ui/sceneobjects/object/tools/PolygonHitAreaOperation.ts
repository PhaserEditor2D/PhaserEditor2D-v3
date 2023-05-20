namespace phasereditor2d.scene.ui.sceneobjects {

    export class PolygonHitAreaOperation extends editor.tools.SceneToolOperation<string> {

        getInitialValue(obj: any) {

            return PolygonHitAreaToolItem.getInitialPoints(obj);
        }

        getFinalValue(obj: any) {

            const comp = PolygonHitAreaComponent.getPolygonComponent(obj);

            return comp.points;
        }

        setValue(obj: any, value: string) {

            const comp = PolygonHitAreaComponent.getPolygonComponent(obj);

            comp.points = value;
        }
    }
}