namespace phasereditor2d.scene.ui.sceneobjects {

    import read = colibri.core.json.read;
    import write = colibri.core.json.write;

    export class VariableComponent extends Component<ISceneObjectLike> {

        static label: IProperty<ISceneObjectLike> = {
            name: "label",
            tooltip: "The variable name of the object.",
            defValue: undefined,
            getValue: obj => obj.getEditorSupport().getLabel(),
            setValue: (obj, value) => obj.getEditorSupport().setLabel(value)
        };

        static scope: IProperty<ISceneObjectLike> = {
            name: "scope",
            tooltip: "The variable lexical scope.",
            defValue: ObjectScope.METHOD,
            getValue: obj => obj.getEditorSupport().getScope(),
            setValue: (obj, value) => obj.getEditorSupport().setScope(value)
        };

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
            // nothing
        }

        writeJSON(ser: core.json.Serializer): void {

            this.writeLocal(ser, VariableComponent.label);

            this.writeLocal(ser, VariableComponent.scope);
        }

        readJSON(ser: core.json.Serializer): void {

            this.readLocal(ser, VariableComponent.label);

            this.readLocal(ser, VariableComponent.scope);
        }
    }
}