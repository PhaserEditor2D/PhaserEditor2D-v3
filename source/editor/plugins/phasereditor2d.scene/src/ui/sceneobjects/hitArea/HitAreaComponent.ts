namespace phasereditor2d.scene.ui.sceneobjects {

    export enum HitAreaShape {
        CIRCLE = "CIRCLE",
        RECTANGLE = "RECTANGLE"
    }

    function getComp(obj: ISceneGameObject) {

        return obj.getEditorSupport().getComponent(HitAreaComponent) as HitAreaComponent;
    }

    export class HitAreaComponent extends Component<ISceneGameObject> {

        static hitAreaShape: IEnumProperty<ISceneGameObject, HitAreaShape> = {
            name: "hitArea.shape",
            label: "Shape",
            defValue: HitAreaShape.RECTANGLE,
            getValue: obj => getComp(obj).getHitAreaShape(),
            setValue: (obj, value) => getComp(obj).setHitAreaShape(value),
            getValueLabel: value => value.toString(),
            values: [
                HitAreaShape.RECTANGLE,
                HitAreaShape.CIRCLE
            ]
        };

        private _hitAreaShape: HitAreaShape;

        constructor(obj: ISceneGameObject) {
            super(obj, [
                HitAreaComponent.hitAreaShape
            ], false);

            this._hitAreaShape = HitAreaShape.RECTANGLE;
        }

        static enableHitArea(obj: ISceneGameObject, enable: boolean) {

            const objES = obj.getEditorSupport();
            
            objES.setComponentActive(HitAreaComponent, enable);

            if (enable) {

                const comp = objES.getComponent(HitAreaComponent) as HitAreaComponent;
                comp.setHitAreaShape(HitAreaShape.RECTANGLE);
                const rectComp = objES.getComponent(RectangleHitAreaComponent) as RectangleHitAreaComponent;
                rectComp.setDefaultValues();
            }
        }

        getHitAreaShape() {
            
            return this._hitAreaShape;
        }

        setHitAreaShape(hitAreaShape: HitAreaShape) {

            this._hitAreaShape = hitAreaShape;
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
        }
    }
}