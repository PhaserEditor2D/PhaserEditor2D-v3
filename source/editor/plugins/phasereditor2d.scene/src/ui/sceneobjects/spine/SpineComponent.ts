/// <reference path="./SpineObject.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    const BoundsProviderTypeLabels = {
        [BoundsProviderType.SETUP_TYPE]: "SETUP_POSE",
        [BoundsProviderType.SKINS_AND_ANIMATION_TYPE]: "SKINS_AND_ANIMATION"
    }

    const BoundsProviderSkinLabels = {
        [BoundsProviderSkin.ALL_SKINS]: "ALL",
        [BoundsProviderSkin.CURRENT_SKIN]: "CURRENT"
    }

    export class SpineComponent extends Component<SpineObject> {

        static dataKey = SimpleProperty("dataKey", undefined, "Data Key", "The skeleton data key");
        static atlasKey = SimpleProperty("atlasKey", undefined, "Atlas Key", "The skeleton data key");

        static skin: IEnumProperty<SpineObject, string> = {
            name: "skinName",
            defValue: null,
            label: "Skin",
            tooltip: "Skeleton's current skin.",
            getEnumValues: obj => [...obj.skeleton.data.skins.map(s => s.name), null],
            getValueLabel: val => val ?? "NULL",
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

        // animations

        static animationMixes = SimpleProperty("animationMixes", undefined, "Animation Mixes", "The animation mixes");

        static defaultMix = SimpleProperty("defaultMix", 0, "Default Mix", "The default animation mix duration.");

        // bounds provider

        static bpType: IEnumProperty<SpineObject, BoundsProviderType> = {
            name: "bpType",
            label: "BP",
            tooltip: "The type of the bounds provider.",
            defValue: BoundsProviderType.SETUP_TYPE,
            values: [BoundsProviderType.SETUP_TYPE, BoundsProviderType.SKINS_AND_ANIMATION_TYPE],
            getValue: obj => obj.bpType,
            setValue: (obj, val) => {

                obj.bpType = val;
                obj.updateBoundsProvider();
            },
            getValueLabel: val => BoundsProviderTypeLabels[val]
        };

        static bpSkin: IEnumProperty<SpineObject, BoundsProviderSkin> = {
            name: "bpSkin",
            label: "BP Skin",
            tooltip: "The skins to use in the SkinsAndAnimationBoundsProvider.",
            defValue: BoundsProviderSkin.CURRENT_SKIN,
            values: [BoundsProviderSkin.CURRENT_SKIN, BoundsProviderSkin.ALL_SKINS],
            getValue: obj => obj.bpSkin,
            setValue: (obj, val) => {

                obj.bpSkin = val;
                obj.updateBoundsProvider();
            },
            getValueLabel: val => BoundsProviderSkinLabels[val]
        };

        static bpAnimation: IEnumProperty<SpineObject, string> = {
            name: "bpAnimation",
            label: "BP Animation",
            tooltip: "The animation to use in the SkinsAndAnimationBoundsProvider.",
            defValue: null,
            getEnumValues: obj => [...obj.skeleton.data.animations.map(a => a.name), null],
            getValue: obj => obj.bpAnimation,
            setValue: (obj, val) => {

                obj.bpAnimation = val;
                obj.updateBoundsProvider();
            },
            getValueLabel: val => val ? val.toString() : "NULL"
        };

        static bpTimeStep = SimpleProperty(
            "bpTimeStep", SpineObject.DEFAULT_BP_TIME_STEP, "BP Time Step",
            "The timeStep of the SkinAndAnimationBoundsProvider.",
            false, (obj: SpineObject) => {

                obj.updateBoundsProvider();
            })

        constructor(obj: SpineObject) {
            super(obj, [
                SpineComponent.dataKey,
                SpineComponent.atlasKey,
                SpineComponent.skin,
                SpineComponent.bpType,
                SpineComponent.bpSkin,
                SpineComponent.bpAnimation,
                SpineComponent.bpTimeStep,
                SpineComponent.animationMixes,
                SpineComponent.defaultMix
            ]);
        }

        readJSON(ser: core.json.Serializer): void {

            super.readJSON(ser);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            // skin

            this.buildSetObjectPropertyCodeDOM([SpineComponent.skin], args2 => {

                const dom = new code.MethodCallCodeDOM("skeleton.setSkinByName", args.objectVarName);

                dom.argLiteral(args2.value);

                args.statements.push(dom);
            });

            // bounds provider
            
            const objES = this.getEditorSupport();

            if (objES.isNestedPrefabInstance()) {

                if (objES.isUnlockedProperty(SpineComponent.bpType)) {

                    const newBoundsProviderExpr = SpineCodeDOMBuilder.generateNewBoundsProviderExpression(this.getObject(), args.unit);
                    
                    const propDom = new code.AssignPropertyCodeDOM("boundsProvider", args.objectVarName);

                    propDom.value(newBoundsProviderExpr);

                    const updateSizeDom = new code.MethodCallCodeDOM("updateSize", args.objectVarName);

                    args.statements.push(propDom, updateSizeDom);
                }
            }
        }
    }
}