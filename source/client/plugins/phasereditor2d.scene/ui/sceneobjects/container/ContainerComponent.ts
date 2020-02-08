namespace phasereditor2d.scene.ui.sceneobjects {

    export class ContainerComponent extends Component<Container> {

        static allowPickChildren: IProperty<Container> = {
            name: "allowPickChildren",
            label: "Allow Pick Children",
            tooltip: "If the container children can be pickable in the scene.",
            defValue: true,
            local: true,
            getValue: obj => obj.getEditorSupport().isAllowPickChildren(),
            setValue: (obj, value) => obj.getEditorSupport().setAllowPickChildren(value)
        };

        constructor(obj: Container) {
            super(obj, [ContainerComponent.allowPickChildren]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
            // nothing
        }
    }
}