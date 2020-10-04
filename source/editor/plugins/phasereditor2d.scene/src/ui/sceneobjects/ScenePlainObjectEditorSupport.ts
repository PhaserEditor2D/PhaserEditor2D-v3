namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export abstract class ScenePlainObjectEditorSupport<T extends IScenePlainObject> extends EditorSupport<T> {

        private _id: string;
        private _extension: ScenePlainObjectExtension;

        constructor(extension: ScenePlainObjectExtension, obj: T, scene: Scene) {
            super(obj, extension.getTypeName().toLowerCase(), scene)
            this._extension = extension;

            this.setScope(ObjectScope.CLASS);
        }

        writeJSON(objData: core.json.IScenePlainObjectData) {

            objData.id = this._id;
            objData.type = this._extension.getTypeName();
            objData.label = this.getLabel();
            colibri.core.json.write(objData, "scope", this.getScope(), ObjectScope.CLASS);
        }

        readJSON(objData: core.json.IScenePlainObjectData) {

            this._id = objData.id;
            this.setScope(colibri.core.json.read(objData, "scope", ObjectScope.CLASS));
            this.setLabel(objData.label);
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