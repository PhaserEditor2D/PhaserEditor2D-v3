namespace phasereditor2d.scene.ui.sceneobjects {

    export class VariableComponent extends Component<ISceneGameObjectLike> {

        static label: IProperty<ISceneGameObjectLike> = {
            name: "label",
            tooltip: "The variable name of the object.",
            defValue: undefined,
            local: true,
            getValue: obj => obj.getEditorSupport().getLabel(),
            setValue: (obj, value) => obj.getEditorSupport().setLabel(value)
        };

        static scope: IEnumProperty<ISceneGameObjectLike, ObjectScope> = {
            name: "scope",
            tooltip: "The variable lexical scope.",
            defValue: ObjectScope.METHOD,
            local: true,
            getValue: obj => obj.getEditorSupport().getScope(),
            setValue: (obj, value) => obj.getEditorSupport().setScope(value),
            values: [ObjectScope.METHOD, ObjectScope.CLASS, ObjectScope.PUBLIC, ObjectScope.PREFAB_PUBLIC],
            getValueLabel: value => value.split("_").map(v => v[0] + v.substring(1).toLowerCase()).join(" ")
        };

        constructor(obj: ISceneGameObjectLike) {
            super(obj, [
                VariableComponent.label,
                VariableComponent.scope
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
            // nothing
        }
    }
}