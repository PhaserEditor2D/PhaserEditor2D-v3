namespace phasereditor2d.scene.ui.sceneobjects {

    export class RectangleHitAreaComponent extends Component<ISceneGameObject> {

        static x = HitAreaProperty(RectangleHitAreaComponent, "x", "X", "phaser:Phaser.Geom.Rectangle.x", 0);
        static y = HitAreaProperty(RectangleHitAreaComponent, "y", "Y", "phaser:Phaser.Geom.Rectangle.y", 0);
        static width = HitAreaProperty(RectangleHitAreaComponent, "width", "W", "phaser:Phaser.Geom.Rectangle.width", 0);
        static height = HitAreaProperty(RectangleHitAreaComponent, "height", "H", "phaser:Phaser.Geom.Rectangle.height", 0);
        static position: IPropertyXY = {
            label: "Offset",
            x: this.x,
            y: this.y
        };
        static size: IPropertyXY = {
            label: "Size",
            x: this.width,
            y: this.height
        };

        public x = 0;
        public y = 0;
        public width = 0;
        public height = 0;

        constructor(obj: ISceneGameObject) {
            super(obj, [
                RectangleHitAreaComponent.x,
                RectangleHitAreaComponent.y,
                RectangleHitAreaComponent.width,
                RectangleHitAreaComponent.height,
            ]);
        }

        private initUnlockListener() {

            const objES = this.getEditorSupport();

            const unlockEvent = objES.unlockEvent;

            unlockEvent.addListener(args => {

                if (args.property === HitAreaComponent.hitAreaShape) {
                    
                    objES.setUnlockedProperty(RectangleHitAreaComponent.x, args.unlock);
                    objES.setUnlockedProperty(RectangleHitAreaComponent.y, args.unlock);
                    objES.setUnlockedProperty(RectangleHitAreaComponent.width, args.unlock);
                    objES.setUnlockedProperty(RectangleHitAreaComponent.height, args.unlock);
                }
            });
        }

        readJSON(ser: core.json.Serializer): void {

            this.initUnlockListener();

            super.readJSON(ser);
        }

        setDefaultValues() {

            console.log("here");

            const obj = this.getObject() as Image;
            const objES = this.getEditorSupport();

            this.x = 0;
            this.y = 0;

            let width = 0, height = 0;

            let [widthProp, heightProp] = objES.getSizeProperties();

            if (widthProp && heightProp) {

                width = widthProp.getValue(obj);
                height = heightProp.getValue(obj);

            } else if (obj.width && obj.height) {

                width = obj.width;
                height = obj.height;
            }

            this.width = width;
            this.height = height;
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const obj = this.getObject();
            const objES = obj.getEditorSupport();
            const hitAreaComp = objES.getComponent(HitAreaComponent);

            if (hitAreaComp) {

                if (objES.isUnlockedProperty(HitAreaComponent.hitAreaShape)) {

                    if (HitAreaComponent.hitAreaShape.getValue(obj) === HitAreaShape.RECTANGLE) {

                        if (objES.isPrefabInstance()) {

                            // we should disable the input, then enable it again with a new shape
                            const code = new core.code.MethodCallCodeDOM("removeInteractive", args.objectVarName);
                            args.statements.push(code);
                        }

                        const code = new core.code.MethodCallCodeDOM("setInteractive", args.objectVarName);

                        const { x, y, width, height } = RectangleHitAreaComponent;

                        const geomArgs = [
                            x.getValue(obj) ?? x.defValue,
                            y.getValue(obj) ?? y.defValue,
                            width.getValue(obj) ?? width.defValue,
                            height.getValue(obj) ?? height.defValue
                        ];

                        code.arg(`new Phaser.Geom.Rectangle(${geomArgs.join(", ")})`);

                        code.arg("Phaser.Geom.Rectangle.Contains");

                        args.statements.push(code);
                    }
                }
            }
        }
    }
}