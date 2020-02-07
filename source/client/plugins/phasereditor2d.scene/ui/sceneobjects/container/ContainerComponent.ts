namespace phasereditor2d.scene.ui.sceneobjects {

    export class ContainerComponent extends Component<Container> {

        static childrenArePickable: IProperty<Container> = {
            name: "childrenArePickable",
            label: "Pickable Children",
            tooltip: "If the container children can be pickable in the scene.",
            defValue: false,
            local: true,
            getValue: obj => obj.getEditorSupport().isChildrenPickable(),
            setValue: (obj, value) => obj.getEditorSupport().setChildrenPickable(value)
        };

        constructor(obj: Container) {
            super(obj, [ContainerComponent.childrenArePickable]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
            // nothing
        }
    }
}