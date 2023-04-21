namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import json = colibri.core.json;

    export abstract class ScenePlainObjectEditorSupport<T extends IScenePlainObject> extends EditorSupport<T> {

        private _id: string;
        private _extension: ScenePlainObjectExtension;
        private _components: PlainObjectComponent<T>[];

        constructor(extension: ScenePlainObjectExtension,
            obj: T, scene: Scene, ...components: PlainObjectComponent<T>[]) {

            super(obj, extension.getTypeName().toLowerCase(), scene);

            this._extension = extension;
            this._components = components;

            this.setScope(ObjectScope.CLASS);

            this._id = Phaser.Utils.String.UUID();
        }

        writeJSON(objData: core.json.IScenePlainObjectData) {

            objData.id = this._id;
            objData.type = this._extension.getTypeName();
            objData.label = this.getLabel();
            colibri.core.json.write(objData, "scope", this.getScope(), ObjectScope.CLASS);

            for (const comp of this._components) {

                for (const prop of comp.getProperties()) {

                    const value = prop.getValue(this.getObject());
                    
                    json.write(objData, prop.name, value, prop.defValue);
                }
            }
        }

        readJSON(objData: core.json.IScenePlainObjectData) {

            this._id = objData.id || Phaser.Utils.String.UUID();
            this.setScope(colibri.core.json.read(objData, "scope", ObjectScope.CLASS));
            this.setLabel(objData.label);

            for (const comp of this._components) {

                for (const prop of comp.getProperties()) {

                    const value = json.read(objData, prop.name, prop.defValue);

                    prop.setValue(this.getObject(), value);
                }
            }
        }

        getExtension() {

            return this._extension;
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new controls.viewers.IconImageCellRenderer(this._extension.getIcon());
        }

        getId(): string {

            return this._id;
        }

        setId(id: string): void {

            this._id = id;
        }

        getPhaserType(): string {

            return this._extension.getPhaserTypeName();
        }

        static hasEditorSupport(obj: IScenePlainObject) {

            if (typeof obj.getEditorSupport === "function") {

                return obj.getEditorSupport() instanceof ScenePlainObjectEditorSupport;
            }

            return false;
        }
    }
}