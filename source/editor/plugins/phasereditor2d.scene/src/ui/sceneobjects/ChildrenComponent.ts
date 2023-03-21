/// <reference path="./Component.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    export class ChildrenComponent extends Component<Container | Layer | ScriptNode> {

        static allowPickChildren: IProperty<Container> = {
            name: "allowPickChildren",
            label: "Allow Picking Children In Scene",
            tooltip: "If this object's children can be pickable (mouse-selected) in the scene.",
            defValue: true,
            local: true,
            getValue: obj => obj.getEditorSupport().isAllowPickChildren(),
            setValue: (obj, value) => obj.getEditorSupport().setAllowPickChildren(value)
        };

        static showChildrenInOutline: IProperty<Container> = {
            name: "showChildrenInOutline",
            label: "Show Children In Outline",
            tooltip: "If showing the children in the Outline view.",
            defValue: true,
            local: true,
            getValue: obj => obj.getEditorSupport().isShowChildrenInOutline(),
            setValue: (obj, value) => obj.getEditorSupport().setShowChildrenInOutline(value)
        };

        static allowAppendChildren: IProperty<Container> = {
            name: "allowAppendChildren",
            label: "Allow Append Children",
            tooltip: "If allow appending children to the prefab instances of this object.",
            defValue: false,
            local: false,
            getValue: obj => obj.getEditorSupport().isAllowAppendChildren(),
            setValue: (obj, value) => obj.getEditorSupport().setAllowAppendChildren(value)
        };

        constructor(obj: Container | Layer | ScriptNode) {
            super(obj, [
                ChildrenComponent.allowPickChildren,
                ChildrenComponent.showChildrenInOutline,
                ChildrenComponent.allowAppendChildren]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
            // nothing
        }
    }
}