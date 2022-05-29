namespace phasereditor2d.scene.ui.sceneobjects {

    export class DirtyObjectManager {

        private _object: ISceneGameObject;
        private _properties: IProperty<ISceneGameObject>[];
        private _values: any[];

        constructor(obj: ISceneGameObject) {

            this._object = obj;
            this._properties = [];
            this._values = [];
        }

        start(redrawCallback: () => void) {

            const updateListener = () => {

                if (this.isDirty()) {

                    redrawCallback();
                }
            };

            const awakeListener = () => {

                this._values = this._properties.map(p => p.getValue(this._object));

                redrawCallback();

                this._object.scene.events.on("update", updateListener);
            };

            this._object.scene.events.once("update", awakeListener);

            this._object.once("destroy", () => {

                this._object.scene.events.off("update", awakeListener);
                this._object.scene.events.off("update", updateListener);
            });
        }

        addProperties(...properties: IProperty<ISceneGameObject>[]) {

            this._properties.push(...properties);
        }

        addComponents(...compCtrs: Function[]) {

            for (const ctr of compCtrs) {

                const comp = this._object.getEditorSupport().getComponent(ctr);

                this.addProperties(...comp.getProperties());
            }
        }

        getKey() {

            const name = this._object.getEditorSupport().getExtension().getTypeName();

            return `${name}[${this._values.map(v => JSON.stringify(v)).join(",")}]`;
        }

        isDirty() {

            let dirty = false;

            for (let i = 0; i < this._properties.length; i++) {

                const v = this._properties[i].getValue(this._object);

                if (v !== this._values[i]) {

                    this._values[i] = v;

                    dirty = true;
                }
            }

            return dirty;
        }
    }
}