namespace phasereditor2d.scene.ui.sceneobjects {

    function GetColor(value) {
        // tslint:disable-next-line:no-bitwise
        return (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
    };

    export interface ITintLikeObject extends ISceneObject {

        tintFill: boolean;
        tintTopLeft: number;
        tintTopRight: number;
        tintBottomLeft: number;
        tintBottomRight: number;
    }

    function TintProperty(
        name: string, label?: string): IProperty<any> {

        return {
            name,
            defValue: 0xffffff,
            label,
            tooltip: "phaser:Phaser.GameObjects.Components.Tint." + name,
            local: false,
            getValue: obj => {

                const val = obj["tint_" + name];

                return val === undefined ? 0xffffff : val;
            },
            setValue: (obj, value) => {

                obj[name] = value;
                obj["tint_" + name] = value;
            }
        };
    }


    export class TintComponent extends Component<ITintLikeObject> {

        static tintFill = SimpleProperty("tintFill", false, "Tint Fill", "phaser:Phaser.GameObjects.Components.Tint.tintFill");
        static tintTopLeft = TintProperty("tintTopLeft", "Tint Top Left");
        static tintTopRight = TintProperty("tintTopRight", "Tint Top Right");
        static tintBottomLeft = TintProperty("tintBottomLeft", "Tint Bottom Left");
        static tintBottomRight = TintProperty("tintBottomRight", "Tint Bottom Right");

        constructor(obj: ITintLikeObject) {
            super(obj, [
                TintComponent.tintFill,
                TintComponent.tintTopLeft,
                TintComponent.tintTopRight,
                TintComponent.tintBottomLeft,
                TintComponent.tintBottomRight
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_BooleanProperty(args, ...this.getProperties());
        }
    }
}