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

            this.buildSetObjectPropertyCodeDOM([SpriteComponent.playMethod], args2 => {
                
                const sprite = args.obj as Sprite;

                const method = sprite.playMethod;

                if (method === PlayMethod.PLAY || method === PlayMethod.PLAY_REVERSE) {

                    const name = method === PlayMethod.PLAY? "play" : "playReverse";

                    const call = new core.code.MethodCallCodeDOM(name, args.objectVarName);
                    call.argLiteral(sprite.playAnimation);

                    args.statements.push(call);
                }
            });
        }
    }
}