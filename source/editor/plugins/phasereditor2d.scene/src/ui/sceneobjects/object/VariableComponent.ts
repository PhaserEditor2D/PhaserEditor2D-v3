/// <reference path="../../sceneobjects/ObjectScope.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    import code = scene.core.code;

    export class VariableComponent extends Component<ISceneGameObject> {

        static label: IProperty<ISceneGameObject> = {
            name: "label",
            tooltip: "The variable name of the object.",
            defValue: undefined,
            local: true,
            getValue: obj => obj.getEditorSupport().getLabel(),
            setValue: (obj, value) => obj.getEditorSupport().setLabel(value)
        };

        static displayName: IProperty<ISceneGameObject> = {
            name: "displayName",
            tooltip: "The name to show in the UI.",
            defValue: "",
            local: true,
            getValue: obj => obj.getEditorSupport().getDisplayName(),
            setValue: (obj, value) => obj.getEditorSupport().setDisplayName(value)
        };

        static useGameObjectName: IProperty<ISceneGameObject> = {
            name: "useGameObjectName",
            label: "GO Name",
            tooltip: "Also set the Game Object's name",
            defValue: false,
            local: true,
            getValue: obj => obj.getEditorSupport().isUseGameObjectName(),
            setValue: (obj, value) => obj.getEditorSupport().setUseGameObjectName(value)
        };

        static scope: IEnumProperty<ISceneGameObject, ObjectScope> = {
            name: "scope",
            tooltip: "The variable lexical scope.",
            defValue: ObjectScope.LOCAL,
            local: true,
            getValue: obj => obj.getEditorSupport().getScope(),
            setValue: (obj, value) => obj.getEditorSupport().setScope(value),
            values: OBJECT_SCOPES,
            getValueLabel: value => value.replaceAll("_", " ") // value.split("_").map(v => v[0] + v.substring(1).toLowerCase()).join(" ")
        };

        constructor(obj: ISceneGameObject) {
            super(obj, [
                VariableComponent.label,
                VariableComponent.displayName,
                VariableComponent.useGameObjectName,
                VariableComponent.scope
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            if (this.getEditorSupport().isUseGameObjectName()) {

                const dom = new code.AssignPropertyCodeDOM("name", args.objectVarName);

                dom.valueLiteral(this.getEditorSupport().getLabel());

                args.statements.push(dom);
            }
        }
    }
}