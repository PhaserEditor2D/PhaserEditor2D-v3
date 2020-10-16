namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IVisibleLikeObject extends ISceneGameObject {

        visible: boolean;
    }

    export class VisibleComponent extends Component<IVisibleLikeObject> {

        static visible: IProperty<IVisibleLikeObject> = {
            name: "visible",
            label: "Visible",
            tooltip: "phaser:Phaser.GameObjects.Components.Visible.visible",
            defValue: true,
            getValue: obj => obj.visible,
            setValue: (obj, value) => obj.visible = value
        };

        constructor(obj: IVisibleLikeObject) {
            super(obj, [VisibleComponent.visible]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_BooleanProperty(args, VisibleComponent.visible);
        }
    }
}