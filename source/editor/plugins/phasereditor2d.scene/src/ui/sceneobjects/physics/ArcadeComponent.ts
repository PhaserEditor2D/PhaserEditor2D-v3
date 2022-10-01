namespace phasereditor2d.scene.ui.sceneobjects {

    import code = scene.core.code;

    const BODY_TYPE_NAME = {
        [Phaser.Physics.Arcade.DYNAMIC_BODY]: "DYNAMIC_BODY",
        [Phaser.Physics.Arcade.STATIC_BODY]: "STATIC_BODY"
    }

    function SimpleBodyProperty(
        name: string, defValue: any, label: string, editorField?: string, tooptip?: string): IProperty<any> {

        editorField = editorField ?? name;

        return {
            name,
            codeName: `body.${name}`,
            defValue,
            label,
            tooltip: tooptip ?? `phaser:Phaser.Physics.Arcade.Body.${name}`,
            getValue: obj => obj.body[editorField] ?? defValue,
            setValue: (obj, value) => {

                obj.body[editorField] = value;
            }
        };
    }

    function simpleBodyVectorProperty(vectorName: string, axis: "x" | "y", defValue: number): IProperty<ArcadeObject> {

        return {
            name: `body.${vectorName}.${axis}`,
            codeName: `body.${vectorName}.${axis}`,
            label: axis.toUpperCase(),
            defValue: defValue,
            getValue: obj => obj.body[vectorName][axis],
            setValue: (obj, value) => obj.body[vectorName][axis] = value,
            tooltip: `phaser:Phaser.Physics.Arcade.Body.${vectorName}`
        }
    }

    function SimpleBodyVectorProperty(vectorName: string, label: string, defValueX: number, defValueY?: number): IPropertyXY {

        return {
            label,
            tooltip: "phaser:Phaser.Physics.Arcade.Body." + vectorName,
            x: simpleBodyVectorProperty(vectorName, "x", defValueX),
            y: simpleBodyVectorProperty(vectorName, "y", defValueY ?? defValueX)
        };
    }

    const GEOM_CIRCLE = 0;
    const GEOM_RECT = 1;

    function updateBodyGeom(obj: ArcadeObject) {

        const isCircle = ArcadeComponent.isCircleBody(obj);

        if (isCircle) {

            const radius = ArcadeComponent.radius.getValue(obj);

            obj.setCircle(radius);

        } else {

            const width = obj.frame ? obj.frame.realWidth : obj.width;
            const height = obj.frame ? obj.frame.realHeight : obj.height;

            obj.setBodySize(width, height, false);
        }
    }

    function bodyTypeProperty(): IEnumProperty<ArcadeObject, number> {

        return {
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
            getValue: function (obj: ArcadeObject) {

                return obj["__arcadeBodyPhysicsType"] || Phaser.Physics.Arcade.DYNAMIC_BODY;
            },
            setValue: function (obj: ArcadeObject, value: any): void {

                obj["__arcadeBodyPhysicsType"] = value;
            },
            defValue: Phaser.Physics.Arcade.DYNAMIC_BODY,
        }
    }

    function geometryProperty(): IEnumProperty<ArcadeObject, number> {

        return {
            name: "bodyGeometry",
            label: "Geometry",
            tooltip: "Select the body's shape.",
            values: [GEOM_CIRCLE, GEOM_RECT],
            getValue: obj => (obj.body["__isCircle"] ? GEOM_CIRCLE : GEOM_RECT),
            setValue: (obj, value) => {

                obj.body["__isCircle"] = value === GEOM_CIRCLE;
                updateBodyGeom(obj);
            },
            getValueLabel: value => (value === GEOM_CIRCLE ? "CIRCULAR" : "RECTANGULAR"),
            defValue: GEOM_RECT
        };
    }

    function sizeProperty(axis: "width" | "height"): IProperty<ArcadeObject> {

        return {
            name: `body.${axis}`,
            label: axis === "width" ? "W" : "H",
            tooltip: "The size of the body, if it is rectangular.",
            getValue: obj => obj.body[axis],
            setValue: (obj, value) => {

                const body = obj.body;

                if (axis === "width") {

                    obj.body.setSize(value, body.height, false);

                } else {

                    obj.body.setSize(body.width, value, false);
                }
            },
            defValue: 0
        };
    }

    export class ArcadeComponent extends Component<ArcadeObject> {

        // properties

        static enable = SimpleBodyProperty("enable", true, "Enable", "__enable");
        static bodyType = bodyTypeProperty();
        static moves = SimpleBodyProperty("moves", true, "Moves");
        static velocity = SimpleBodyVectorProperty("velocity", "Velocity", 0);
        static maxVelocity = SimpleBodyVectorProperty("maxVelocity", "Max Velocity", 10000);
        static maxSpeed = SimpleBodyProperty("maxSpeed", -1, "Max Speed");
        static friction = SimpleBodyVectorProperty("friction", "Friction", 1, 0);
        static allowGravity = SimpleBodyProperty("allowGravity", true, "Allow Gravity");
        static gravity = SimpleBodyVectorProperty("gravity", "Gravity", 0);
        static acceleration = SimpleBodyVectorProperty("acceleration", "Acceleration", 0);
        static useDamping = SimpleBodyProperty("useDamping", false, "Use Damping");
        static allowDrag = SimpleBodyProperty("allowDrag", true, "Allow Drag");
        static drag = SimpleBodyVectorProperty("drag", "Drag", 0);
        static bounce = SimpleBodyVectorProperty("bounce", "Bounce", 0);
        static collideWorldBounds = SimpleBodyProperty("collideWorldBounds", false, "Collide World Bounds");
        static allowRotation = SimpleBodyProperty("allowRotation", true, "Allow Rotation");
        static angularVelocity = SimpleBodyProperty("angularVelocity", 0, "Angular Velocity");
        static angularAcceleration = SimpleBodyProperty("angularAcceleration", 0, "Angular Acceleration");
        static angularDrag = SimpleBodyProperty("angularDrag", 0, "Angular Drag");
        static maxAngular = SimpleBodyProperty("maxAngular", 1000, "Max Angular");
        static pushable = SimpleBodyProperty("pushable", true, "Pushable");
        static immovable = SimpleBodyProperty("immovable", false, "Immovable");
        static overlap: IPropertyXY = {
            label: "Overlap",
            tooltip: "The amount of horizontal/vertical overlap (before separation), if this Body is colliding with another.",
            x: SimpleBodyProperty("overlapX", 0, "X"),
            y: SimpleBodyProperty("overlapY", 0, "Y"),
        };
        static overlapR = SimpleBodyProperty("overlapR", 0, "Overlap R");
        static mass = SimpleBodyProperty("mass", 1, "Mass");
        static geometry = geometryProperty();
        static radius = SimpleBodyProperty("radius", 64, "Radius", "__radius");
        static offset = SimpleBodyVectorProperty("offset", "Offset", 0);
        static size: IPropertyXY = {
            label: "Size",
            tooltip: "Size",
            x: sizeProperty("width"),
            y: sizeProperty("height")
        }

        static isCircleBody(obj: ArcadeObject) {

            return ArcadeComponent.geometry.getValue(obj) === GEOM_CIRCLE;
        }

        static isStaticBody(obj: ArcadeObject) {

            return ArcadeComponent.bodyType.getValue(obj) === Phaser.Physics.Arcade.STATIC_BODY;
        }

        constructor(obj: ArcadeObject) {
            super(obj, [
                ArcadeComponent.bodyType,
                ArcadeComponent.enable,
                ArcadeComponent.moves,
                ArcadeComponent.velocity.x,
                ArcadeComponent.velocity.y,
                ArcadeComponent.maxSpeed,
                ArcadeComponent.maxVelocity.x,
                ArcadeComponent.maxVelocity.y,
                ArcadeComponent.friction.x,
                ArcadeComponent.friction.y,
                ArcadeComponent.gravity.x,
                ArcadeComponent.gravity.y,
                ArcadeComponent.allowGravity,
                ArcadeComponent.acceleration.x,
                ArcadeComponent.acceleration.y,
                ArcadeComponent.drag.x,
                ArcadeComponent.drag.y,
                ArcadeComponent.bounce.x,
                ArcadeComponent.bounce.y,
                ArcadeComponent.collideWorldBounds,
                ArcadeComponent.overlap.x,
                ArcadeComponent.overlap.y,
                ArcadeComponent.overlapR,
                ArcadeComponent.useDamping,
                ArcadeComponent.allowDrag,
                ArcadeComponent.allowRotation,
                ArcadeComponent.angularAcceleration,
                ArcadeComponent.angularDrag,
                ArcadeComponent.angularVelocity,
                ArcadeComponent.maxAngular,
                ArcadeComponent.pushable,
                ArcadeComponent.immovable,
                ArcadeComponent.mass,
                ArcadeComponent.geometry,
                ArcadeComponent.radius,
                ArcadeComponent.size.x,
                ArcadeComponent.size.y,
                ArcadeComponent.offset.x,
                ArcadeComponent.offset.y
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

                ArcadeComponent.maxVelocity.x,
                ArcadeComponent.maxVelocity.y,

                ArcadeComponent.maxSpeed,

                ArcadeComponent.gravity.x,
                ArcadeComponent.gravity.y,

                ArcadeComponent.acceleration.x,
                ArcadeComponent.acceleration.y,

                ArcadeComponent.drag.x,
                ArcadeComponent.drag.y,

                ArcadeComponent.friction.x,
                ArcadeComponent.friction.y,

                ArcadeComponent.bounce.x,
                ArcadeComponent.bounce.y,

                ArcadeComponent.overlap.x,
                ArcadeComponent.overlap.y,
                ArcadeComponent.overlapR,

                ArcadeComponent.mass,

                ArcadeComponent.angularAcceleration,
                ArcadeComponent.angularDrag,
                ArcadeComponent.angularVelocity,
                ArcadeComponent.maxAngular
            );

            // boolean properties

            this.buildSetObjectPropertyCodeDOM_BooleanProperty(args,
                ArcadeComponent.enable,
                ArcadeComponent.moves,
                ArcadeComponent.allowGravity,
                ArcadeComponent.useDamping,
                ArcadeComponent.allowDrag,
                ArcadeComponent.allowRotation,
                ArcadeComponent.collideWorldBounds,
                ArcadeComponent.pushable,
                ArcadeComponent.immovable);

            // geometry

            const obj = this.getObject();

            if (ArcadeComponent.isCircleBody(obj)) {

                this.buildSetObjectPropertyCodeDOM([ArcadeComponent.radius], (args2) => {

                    const dom = new code.MethodCallCodeDOM("body.setCircle", args.objectVarName);
    
                    const r = ArcadeComponent.radius.getValue(obj);
    
                    dom.arg(r);
    
                    args.statements.push(dom);
                });

            } else {

                this.buildSetObjectPropertyCodeDOM([ArcadeComponent.size.x], (args2) => {

                    const dom = new code.MethodCallCodeDOM("body.setSize", args.objectVarName);
    
                    const x = ArcadeComponent.size.x.getValue(obj)
                    const y = ArcadeComponent.size.y.getValue(obj);
    
                    dom.arg(x);
                    dom.arg(y);
                    dom.argBool(false);
    
                    args.statements.push(dom);
                });
            }
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