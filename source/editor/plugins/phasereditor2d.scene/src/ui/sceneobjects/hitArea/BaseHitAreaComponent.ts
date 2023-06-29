namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class BaseHitAreaComponent extends Component<ISceneGameObject> {

        private _shape: HitAreaShape;

        constructor(obj: ISceneGameObject, shape: HitAreaShape, properties: IProperty<ISceneGameObject>[]) {
            super(obj, properties);

            this._shape = shape;
        }

        private initUnlockListener() {

            const objES = this.getEditorSupport();

            const unlockEvent = objES.unlockEvent;

            unlockEvent.addListener(args => {

                if (args.property.name === HitAreaComponent.hitAreaShape.name) {

                    for (const prop of this.getProperties()) {

                        objES.setUnlockedProperty(prop, args.unlock);
                    }
                }
            });
        }

        readJSON(ser: core.json.Serializer): void {

            this.initUnlockListener();

            super.readJSON(ser);
        }

        writeJSON(ser: core.json.Serializer): void {

            // only writes this component data if its shape is selected
            const shape = HitAreaComponent.hitAreaShape.getValue(this.getObject());

            if (shape === this._shape) {

                super.writeJSON(ser);
            }            
        }

        protected abstract _setDefaultValues(x: number, y: number, width: number, height: number): void;

        setDefaultValues() {

            const obj = this.getObject() as Image;
            const objES = this.getEditorSupport();

            let width = 0, height = 0;
            let x = 0, y = 0;

            let [widthProp, heightProp] = objES.getSizeProperties();

            if (widthProp && heightProp) {

                width = widthProp.getValue(obj);
                height = heightProp.getValue(obj);

            } else if (obj instanceof Container) {

                const c = obj as Container;

                const b = c.getBounds();

                width = b.width;
                height = b.height;

                const origin = c.getEditorSupport().computeDisplayOrigin();

                x = -origin.displayOriginX;
                y = -origin.displayOriginY;

            } else if (obj.width && obj.height) {

                width = obj.width;
                height = obj.height;
            }

            this._setDefaultValues(x, y, width, height);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            const obj = this.getObject();
            const objES = obj.getEditorSupport();

            if (objES.getComponent(HitAreaComponent)) {

                if (objES.isUnlockedProperty(HitAreaComponent.hitAreaShape)) {

                    if (HitAreaComponent.hitAreaShape.getValue(obj) === this._shape) {

                        const code = new core.code.MethodCallCodeDOM("setInteractive", args.objectVarName);

                        this.buildSetInteractiveCodeCOM(args, obj, code);

                        args.statements.push(code);
                    }
                }
            }
        }

        protected abstract buildSetInteractiveCodeCOM(args: ISetObjectPropertiesCodeDOMArgs, obj: ISceneGameObject, code: core.code.MethodCallCodeDOM): void;
    }
}