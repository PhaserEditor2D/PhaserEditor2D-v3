/// <reference path="./SpineObject.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export class SpineComponent extends Component<SpineObject> {

        static dataKey = SimpleProperty("dataKey", undefined, "Data Key", "The skeleton data key");
        static atlasKey = SimpleProperty("atlasKey", undefined, "Atlas Key", "The skeleton data key");

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

                    if (value) {

                        obj.skeleton.setSkinByName(value);

                    } else {

                        obj.skeleton.setSkin(null);
                    }

                    obj.skeleton.setToSetupPose();
                    obj.updateBoundsProvider();

                } catch (e) {

                    obj.skeleton.setSkin(null);
                }
            },
        };

        static boundsProviderType: IEnumProperty<SpineObject, BoundsProviderType> = {
            name: "bpType",
            label: "BP",
            tooltip: "The type of the bounds provider.",
            defValue: BoundsProviderType.SETUP_TYPE,
            values: [BoundsProviderType.SETUP_TYPE, BoundsProviderType.SKINS_AND_ANIMATION_TYPE],
            getValue: obj => obj.boundsProviderType,
            setValue: (obj, val) => {

                obj.boundsProviderType = val;
                obj.updateBoundsProvider();
            },
            getValueLabel: val => val.toString()
        };

        static boundsProviderSkin: IEnumProperty<SpineObject, BoundsProviderSkin> = {
            name: "bpSkin",
            label: "BP Skin",
            tooltip: "The skins to use in the SkinsAndAnimationBoundsProvider.",
            defValue: BoundsProviderSkin.CURRENT_SKIN,
            values: [BoundsProviderSkin.CURRENT_SKIN, BoundsProviderSkin.ALL_SKINS],
            getValue: obj => obj.boundsProviderSkin,
            setValue: (obj, val) => {

                obj.boundsProviderSkin = val;
                obj.updateBoundsProvider();
            },
            getValueLabel: val => val.toString()
        };

        static boundsProviderAnimation: IEnumProperty<SpineObject, string> = {
            name: "bpAnimation",
            label: "BP Animation",
            tooltip: "The animation to use in the SkinsAndAnimationBoundsProvider.",
            defValue: null,
            getEnumValues: obj => [null, ...obj.skeleton.data.animations.map(a => a.name)],
            getValue: obj => obj.boundsProviderAnimation,
            setValue: (obj, val) => {

                obj.boundsProviderAnimation = val;
                obj.updateBoundsProvider();
            },
            getValueLabel: val => val ? val.toString() : "<null>"
        };

        static boundsProviderTimeStep = SimpleProperty(
            "bpTimeStep", 0.05, "BP Time Step",
            "The timeStep of the SkinAndAnimationBoundsProvider.",
            false, (obj: SpineObject) => {

                obj.updateBoundsProvider();
            })


        constructor(obj: SpineObject) {
            super(obj, [
                SpineComponent.dataKey,
                SpineComponent.atlasKey,
                SpineComponent.skin,
                SpineComponent.boundsProviderType,
                SpineComponent.boundsProviderSkin,
                SpineComponent.boundsProviderAnimation,
                SpineComponent.boundsProviderTimeStep
            ]);
        }

        readJSON(ser: core.json.Serializer): void {

            super.readJSON(ser);
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