namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class EffectsComponent extends Component<ISceneGameObject> {

        static padding: IProperty<ISceneGameObject> = {
            name: "padding",
            label: "Padding",
            tooltip: PhaserHelp("Phaser.GameObjects.Components.FX.padding"),
            defValue: 0,
            increment: 1,
            incrementMin: 0,
            getValue: (obj: Image) => {

                if (obj.preFX) {

                    return obj.preFX.padding;
                }

                return 0;
            },
            setValue: (obj: Image, value: number) => {

                if (obj.preFX) {

                    obj.preFX.padding = value;
                }
            }
        };

        constructor(obj: ISceneGameObject) {
            super(obj, [
                EffectsComponent.padding
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM([EffectsComponent.padding], args2 => {

                const dom = new code.AssignPropertyCodeDOM(args2.fieldCodeName, args.objectVarName + ".preFX");

                dom.setOptionalContext(true);
                
                dom.valueFloat(args2.value);

                args.statements.push(dom);
            });
        }
    }
}