namespace phasereditor2d.scene.ui.sceneobjects {

    export class SpriteComponent extends Component<Sprite> {

        static animationPlayMethod: IEnumProperty<Sprite, AnimationPlayMethod> = {
            name: "animationPlayMethod",
            label: "Action",
            defValue: AnimationPlayMethod.NONE,
            getValue: obj => obj.animationPlayMethod,
            setValue: (obj: Sprite, val: AnimationPlayMethod) => { obj.animationPlayMethod = val; },
            getValueLabel: val => {
                switch (val) {

                    case AnimationPlayMethod.NONE:
                        return "NONE";

                    case AnimationPlayMethod.PLAY:
                        return "PLAY";

                    case AnimationPlayMethod.PLAY_REVERSE:
                        return "PLAY_REVERSE";
                }
            },
            values: [AnimationPlayMethod.NONE, AnimationPlayMethod.PLAY, AnimationPlayMethod.PLAY_REVERSE],
        };

        static animationKey = SimpleProperty({ name: "animationKey", codeName: "key" }, "", "Animation Key", "The animation key to auto-play.");
        static animationCustomConfig = SimpleProperty("animationCustomConfig", false, "Custom Config", "Set a new configuration?");
        static animationFrameRate = SimpleProperty({ name: "animationFrameRate", codeName: "frameRate" }, 24, "Frame Rate", "phaser:Phaser.Types.Animations.PlayAnimationConfig.frameRate");
        static animationDelay = SimpleProperty({ name: "animationDelay", codeName: "delay" }, 0, "Delay", "phaser:Phaser.Types.Animations.PlayAnimationConfig.delay");
        static animationRepeat = SimpleProperty({ name: "animationRepeat", codeName: "repeat" }, 0, "Repeat", "phaser:Phaser.Types.Animations.PlayAnimationConfig.repeat");
        static animationRepeatDelay = SimpleProperty({ name: "animationRepeatDelay", codeName: "repeatDelay" }, 0, "Repeat Delay", "phaser:Phaser.Types.Animations.PlayAnimationConfig.repeatDelay");
        static animationYoyo = SimpleProperty({ name: "animationYoyo", codeName: "yoyo" }, false, "Yoyo", "phaser:Phaser.Types.Animations.PlayAnimationConfig.yoyo");
        static animationShowBeforeDelay = SimpleProperty({ name: "animationShowBeforeDelay", codeName: "showBeforeDelay" }, false, "Show Before Delay", "phaser:Phaser.Types.Animations.PlayAnimationConfig.showBeforeDelay");
        static animationShowOnStart = SimpleProperty({ name: "animationShowOnStart", codeName: "showOnStart" }, false, "Show Before Start", "phaser:Phaser.Types.Animations.PlayAnimationConfig.showBeforeStart");
        static animationHideOnComplete = SimpleProperty({ name: "animationHideOnComplete", codeName: "hideOnComplete" }, false, "Hide On Complete", "phaser:Phaser.Types.Animations.PlayAnimationConfig.hideOnComplete");
        static animationStartFrame = SimpleProperty({ name: "animationStartFrame", codeName: "startFrame" }, 0, "Start Frame", "phaser:Phaser.Types.Animations.PlayAnimationConfig.startFrame");
        static animationTimeScale = SimpleProperty({ name: "animationTimeScale", codeName: "timeScale" }, 1, "Time Scale", "phaser:Phaser.Types.Animations.PlayAnimationConfig.timeScale");

        constructor(obj: Sprite) {
            super(obj, [
                SpriteComponent.animationPlayMethod,
                SpriteComponent.animationKey,
                SpriteComponent.animationCustomConfig,
                SpriteComponent.animationFrameRate,
                SpriteComponent.animationDelay,
                SpriteComponent.animationRepeat,
                SpriteComponent.animationRepeatDelay,
                SpriteComponent.animationYoyo,
                SpriteComponent.animationShowBeforeDelay,
                SpriteComponent.animationShowOnStart,
                SpriteComponent.animationHideOnComplete,
                SpriteComponent.animationStartFrame,
                SpriteComponent.animationTimeScale,
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM([SpriteComponent.animationPlayMethod], args2 => {

                const sprite = args.obj as Sprite;

                const method = sprite.animationPlayMethod;

                if (method === AnimationPlayMethod.PLAY || method === AnimationPlayMethod.PLAY_REVERSE) {

                    const name = method === AnimationPlayMethod.PLAY ? "play" : "playReverse";

                    const call = new core.code.MethodCallCodeDOM(name, args.objectVarName);

                    if (sprite.animationCustomConfig) {

                        const config: Phaser.Types.Animations.PlayAnimationConfig = {} as any;

                        SpriteComponent.buildPlayConfig(sprite, config);

                        call.arg(JSON.stringify(config));

                    } else {

                        call.argLiteral(sprite.animationKey);
                    }

                    args.statements.push(call);
                }
            });
        }

        public static buildPlayConfig(sprite: Sprite, config: Phaser.Types.Animations.PlayAnimationConfig) {

            for (const prop of [
                SpriteComponent.animationKey,
                SpriteComponent.animationFrameRate,
                SpriteComponent.animationDelay,
                SpriteComponent.animationRepeat,
                SpriteComponent.animationRepeatDelay,
                SpriteComponent.animationYoyo,
                SpriteComponent.animationShowBeforeDelay,
                SpriteComponent.animationShowOnStart,
                SpriteComponent.animationHideOnComplete,
                SpriteComponent.animationStartFrame,
                SpriteComponent.animationTimeScale
            ]) {

                colibri.core.json.write(config, prop.codeName, prop.getValue(sprite), prop.defValue);
            }
        }
    }
}