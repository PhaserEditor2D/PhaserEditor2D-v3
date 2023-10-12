namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpriteComponent extends Component<Sprite> {

        static playMethod: IEnumProperty<Sprite, PlayMethod> = {
            name: "playMethod",
            label: "Action",
            defValue: PlayMethod.NONE,
            getValue: obj => obj.playMethod,
            setValue: (obj: Sprite, val: PlayMethod) => { obj.playMethod = val; },
            getValueLabel: val => {
                switch (val) {

                    case PlayMethod.NONE:
                        return "NONE";

                    case PlayMethod.PLAY:
                        return "PLAY";

                    case PlayMethod.PLAY_REVERSE:
                        return "PLAY_REVERSE";
                }
            },
            values: [PlayMethod.NONE, PlayMethod.PLAY, PlayMethod.PLAY_REVERSE],
        };

        static playAnimation = SimpleProperty("playAnimation", "", "Play Animation", "The animation to play.");

        constructor(obj: Sprite) {
            super(obj, [
                SpriteComponent.playMethod,
                SpriteComponent.playAnimation
            ])
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
            // TODO
        }
    }
}