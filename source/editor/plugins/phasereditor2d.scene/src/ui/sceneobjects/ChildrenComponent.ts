/// <reference path="./Component.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    export class ChildrenComponent extends Component<Container | Layer> {

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

        constructor(obj: Container | Layer) {
            super(obj, [
                ChildrenComponent.allowPickChildren,
                ChildrenComponent.showChildrenInOutline]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
            // nothing
        }
    }
}