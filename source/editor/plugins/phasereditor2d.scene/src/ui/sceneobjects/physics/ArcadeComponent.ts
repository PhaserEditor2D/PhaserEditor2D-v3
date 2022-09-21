namespace phasereditor2d.scene.ui.sceneobjects {

    import code = scene.core.code;

    const BODY_TYPE_NAME = {
        [Phaser.Physics.Arcade.DYNAMIC_BODY]: "DYNAMIC_BODY",
        [Phaser.Physics.Arcade.STATIC_BODY]: "STATIC_BODY"
    }

    function SimpleBodyProperty(
        name: string, defValue: any, label?: string): IProperty<any> {

        return {
            name,
            codeName: `body.${name}`,
            defValue,
            label,
            tooltip: PhaserHelp(`Phaser.Physics.Arcade.Body.${name}`),
            getValue: obj => obj.body[name],
            setValue: (obj, value) => {

                obj.body[name] = value;
            }
        };
    }

    function simpleBodyVectorProperty(vectorName: string, axis: "x" | "y", defValue: number): IProperty<ArcadeImage> {

        return {
            name: `body.${vectorName}.${axis}`,
            codeName: `body.${vectorName}.${axis}`,
            label: axis.toUpperCase(),
            defValue: defValue,
            getValue: obj => obj.body[vectorName][axis],
            setValue: (obj, value) => obj.body[vectorName][axis] = value,
            tooltip: PhaserHelp(`Phaser.Physics.Arcade.Body.${vectorName}.${axis}`)
        }
    }

    function SimpleBodyVectorProperty(vectorName: string, label: string, defValue: number): IPropertyXY {

        return {
            label,
            x: simpleBodyVectorProperty(vectorName, "x", defValue),
            y: simpleBodyVectorProperty(vectorName, "y", defValue)
        };
    }

    export class ArcadeComponent extends Component<ArcadeObject> {

        // properties

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
            defValue: Phaser.Physics.Arcade.DYNAMIC_BODY,
        };

        static offset = SimpleBodyVectorProperty("offset", "Offset", 0);
        static velocity = SimpleBodyVectorProperty("velocity", "Velocity", 0);
        static gravity = SimpleBodyVectorProperty("gravity", "Gravity", 0);
        static allowGravity = SimpleBodyProperty("allowGravity", true, "Allow Gravity");
        static pushable = SimpleBodyProperty("pushable", true, "Pushable");
        static immovable = SimpleBodyProperty("immovable", false, "Immovable");
        static mass = SimpleBodyProperty("mass", 1, "Mass");

        static isStaticBody(obj: ArcadeImage) {

            return ArcadeComponent.bodyType.getValue(obj) === Phaser.Physics.Arcade.STATIC_BODY;
        }

        constructor(obj: ArcadeObject) {
            super(obj, [
                ArcadeComponent.bodyType,
                ArcadeComponent.offset.x,
                ArcadeComponent.offset.y,
                ArcadeComponent.velocity.x,
                ArcadeComponent.velocity.y,
                ArcadeComponent.gravity.x,
                ArcadeComponent.gravity.y,
                ArcadeComponent.allowGravity,
                ArcadeComponent.pushable,
                ArcadeComponent.immovable,
                ArcadeComponent.mass
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildPrefabEnableBodyCodeDOM(args);

            // float properties

            this.buildSetObjectPropertyCodeDOM_FloatProperty(args,

                ArcadeComponent.offset.x,
                ArcadeComponent.offset.y,

                ArcadeComponent.velocity.x,
                ArcadeComponent.velocity.y,

                ArcadeComponent.gravity.x,
                ArcadeComponent.gravity.y,

                ArcadeComponent.mass
            );

            // boolean properties

            this.buildSetObjectPropertyCodeDOM_BooleanProperty(args,
                ArcadeComponent.allowGravity,
                ArcadeComponent.pushable,
                ArcadeComponent.immovable);
        }

        private buildPrefabEnableBodyCodeDOM(args: ISetObjectPropertiesCodeDOMArgs) {

            const objES = this.getEditorSupport();

            if (!objES.isScenePrefabObject()) {

                return;
            }

            if (objES.isUnlockedProperty(ArcadeComponent.bodyType)) {

                const body = args.statements;

                const stmt = new code.MethodCallCodeDOM("existing", "scene.physics.add");

                stmt.arg("this");

                stmt.argBool(ArcadeComponent.isStaticBody(this.getObject()));

                body.push(stmt);
            }
        }
    }
}