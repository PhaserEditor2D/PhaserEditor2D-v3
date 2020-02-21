namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IAlphaLikeObject extends ISceneObject {

        alpha: number;
    }

    export class AlphaComponent extends Component<IAlphaLikeObject> {

        static alpha: IProperty<IAlphaLikeObject> = {
            name: "alpha",
            label: "alpha",
            defValue: 1,
            getValue: obj => obj.alpha,
            setValue: (obj, value) => obj.alpha = value
        };

        constructor(obj: IAlphaLikeObject) {
            super(obj, [AlphaComponent.alpha]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, AlphaComponent.alpha);
        }
    }
}