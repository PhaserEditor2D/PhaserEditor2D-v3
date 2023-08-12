namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class SpineComponent extends Component<SpineObject> {

        static skin: IEnumProperty<SpineObject, string> = {
            name: "skinName",
            defValue: null,
            label: "Skin",
            tooltip: "Skeleton's current skin.",
            getEnumValues: obj => [null, ...obj.skeleton.data.skins.map(s => s.name)],
            getValueLabel: val => val ?? "<null>",
            getValue: (obj: SpineObject) => {

                return obj.skeleton.skin?.name || null;
            },
            setValue: function (obj: SpineObject, value: string): void {

                try {

                    console.log("set skin", value);
                    if (value) {

                        obj.skeleton.setSkinByName(value);

                    } else {

                        obj.skeleton.setSkin(null);
                    }

                    obj.skeleton.setToSetupPose();

                } catch (e) {

                    obj.skeleton.setSkin(null);
                }
            },
        };


        constructor(obj: SpineObject) {
            super(obj, [
                SpineComponent.skin
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM([SpineComponent.skin], args2 => {

                const dom = new code.MethodCallCodeDOM("skeleton.setSkinByName", args.objectVarName);

                dom.argLiteral(args2.value);

                args.statements.push(dom);
            });
        }
    }
}