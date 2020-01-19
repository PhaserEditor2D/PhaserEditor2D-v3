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

        static scope: IEnumProperty<ISceneObjectLike, ObjectScope> = {
            name: "scope",
            tooltip: "The variable lexical scope.",
            defValue: ObjectScope.METHOD,
            getValue: obj => obj.getEditorSupport().getScope(),
            setValue: (obj, value) => obj.getEditorSupport().setScope(value),
            values: [ObjectScope.METHOD, ObjectScope.CLASS, ObjectScope.PUBLIC],
            getValueLabel: value => value[0] + value.toLowerCase().substring(1)
        };

        constructor(obj: ISceneObjectLike) {
            super(obj, [
                VariableComponent.label,
                VariableComponent.scope
            ]);
        }

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