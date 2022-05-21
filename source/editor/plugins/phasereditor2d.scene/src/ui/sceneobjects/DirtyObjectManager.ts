namespace phasereditor2d.scene.ui.sceneobjects {

    export class DirtyObjectManager {

        private _object: ISceneGameObject;
        private _properties: IProperty<ISceneGameObject>[];
        private _values: any[];

        constructor(obj: ISceneGameObject,) {

            this._object = obj;
            this._properties = [];
        }

        start(redrawCallback: () => void) {

            this._values = this._properties.map(p => p.getValue(this._object));

            redrawCallback();

            const listener = () => {

                if (this.isDirty()) {

                    redrawCallback();
                }
            };

            this._object.scene.events.on("update", listener);

            this._object.once("destroy", () => {

                this._object.scene.events.off("update", listener);
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

            return `${name}[${this._values.map(v => "" + v).join(",")}]`;
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