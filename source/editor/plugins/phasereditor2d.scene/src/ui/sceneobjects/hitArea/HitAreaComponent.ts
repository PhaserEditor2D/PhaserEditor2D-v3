namespace phasereditor2d.scene.ui.sceneobjects {

    export enum HitAreaShape {
        NONE = "NONE",
        ELLIPSE = "ELLIPSE",
        RECTANGLE = "RECTANGLE"
    }

    function getComp(obj: ISceneGameObject) {

        return obj.getEditorSupport().getComponent(HitAreaComponent) as HitAreaComponent;
    }

    export class HitAreaComponent extends Component<ISceneGameObject> {

        static hitAreaShape: IEnumProperty<ISceneGameObject, HitAreaShape> = {
            name: "hitArea.shape",
            label: "Shape",
            defValue: HitAreaShape.NONE,
            getValue: obj => getComp(obj).getHitAreaShape(),
            setValue: (obj, value) => getComp(obj).setHitAreaShape(value),
            getValueLabel: value => value.toString(),
            values: [
                HitAreaShape.NONE,
                HitAreaShape.RECTANGLE,
                HitAreaShape.ELLIPSE
            ]
        };

        private _hitAreaShape: HitAreaShape;

        constructor(obj: ISceneGameObject) {
            super(obj, [
                HitAreaComponent.hitAreaShape
            ]);

            this._hitAreaShape = HitAreaShape.NONE;
        }

        static hasHitAreaShape(obj: ISceneGameObject, shape: HitAreaShape) {

            if (this.hasHitArea(obj)) {

                return this.getShape(obj) === shape;
            }

            return false;
        }

        static hasHitArea(obj: ISceneGameObject) {

            return GameObjectEditorSupport.hasObjectComponent(obj, HitAreaComponent);
        }

        static getShape(obj: ISceneGameObject): HitAreaShape {

            return this.hitAreaShape.getValue(obj)
        }

        getHitAreaShape() {

            return this._hitAreaShape;
        }

        setHitAreaShape(hitAreaShape: HitAreaShape) {

            this._hitAreaShape = hitAreaShape;
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const objES = this.getEditorSupport();

            if (objES.isPrefabInstance()) {

                if (objES.isUnlockedProperty(HitAreaComponent.hitAreaShape)) {

                    const code = new core.code.MethodCallCodeDOM("removeInteractive", args.objectVarName);
                    args.statements.push(code);
                }
            }
        }
    }
}