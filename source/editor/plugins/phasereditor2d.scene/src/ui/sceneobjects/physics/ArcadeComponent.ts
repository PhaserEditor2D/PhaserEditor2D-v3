namespace phasereditor2d.scene.ui.sceneobjects {

    const BODY_TYPE_NAME = {
        [Phaser.Physics.Arcade.DYNAMIC_BODY]: "DYNAMIC_BODY",
        [Phaser.Physics.Arcade.STATIC_BODY]: "STATIC_BODY"
    }

    export class ArcadeComponent extends Component<ArcadeObject> {

        static bodyType: IEnumProperty<ArcadeObject, number> = {
            name: "physicsType",
            label: "Type",
            tooltip: "The type of the body",
            values: [
                Phaser.Physics.Arcade.DYNAMIC_BODY,
                Phaser.Physics.Arcade.STATIC_BODY
            ],
            getValueLabel: function (value: number): string {
                
                return BODY_TYPE_NAME[value];
            },
            getValue: function (obj: ArcadeImage) {
                
                return obj["__arcadeBodyPhysicsType"] || Phaser.Physics.Arcade.DYNAMIC_BODY;
            },
            setValue: function (obj: ArcadeImage, value: any): void {
                
                obj["__arcadeBodyPhysicsType"] = value;
            },
            defValue: Phaser.Physics.Arcade.DYNAMIC_BODY
        };

        constructor(obj: ArcadeObject) {
            super(obj, [
                ArcadeComponent.bodyType
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            // throw new Error("Method not implemented.");
        }
    }
}