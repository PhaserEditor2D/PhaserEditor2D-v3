/// <reference path="./Component.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    export class ChildrenComponent extends Component<Container | Layer> {

        static allowPickChildren: IProperty<Container> = {
            name: "allowPickChildren",
            label: "Allow Pick Children",
            tooltip: "If this object's children can be pickable in the scene.",
            defValue: true,
            local: true,
            getValue: obj => obj.getEditorSupport().isAllowPickChildren(),
            setValue: (obj, value) => obj.getEditorSupport().setAllowPickChildren(value)
        };

        constructor(obj: Container | Layer) {
            super(obj, [ChildrenComponent.allowPickChildren]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
            // nothing
        }
    }
}