namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ShadersSection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ShadersSection", "FX Shaders", false, true);
        }

        createForm(parent: HTMLDivElement): void {

            const comp = this.createGridElement(parent, 3);

            this.createNumberProperty(comp, EffectsComponent.padding);

            const items = () => {

                return ScenePlugin.getInstance().getFXExtensions().map(e => ({
                    name: e.getTypeName(),
                    value: e,
                    icon: e.getIcon()
                }));
            }

            {
                const btn = this.createButton(comp, "Add", () => {

                    const viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.ui.sceneobjects.EffectsSection");

                    viewer.setLabelProvider(new controls.viewers.LabelProvider((obj: IFXObjectFactory | FXObjectExtension) => {

                        return obj instanceof FXObjectExtension ? obj.getTypeName() : obj.extension.getTypeName() + " - " + obj.factoryName;
                    }));

                    viewer.setCellRendererProvider(
                        new controls.viewers.EmptyCellRendererProvider(
                            e => new controls.viewers.IconImageCellRenderer(
                                resources.getIcon(resources.ICON_FX))));

                    viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

                    const input = ScenePlugin.getInstance()
                        .getFXExtensions()
                        .flatMap(e => {

                            const factories = e.getFXObjectFactories();

                            if (factories.length === 0) {

                                return [e] as Array<any>;
                            }

                            return factories as Array<any>;
                        });

                    viewer.setInput(input);

                    const dlg = new controls.dialogs.ViewerDialog(viewer, false);

                    dlg.create();

                    dlg.setTitle("Shader Effects");

                    dlg.enableButtonOnlyWhenOneElementIsSelected(
                        dlg.addOpenButton("Add", (sel) => {

                            this.getEditor()
                                .getDropManager()
                                .addFXObjects(sel[0]);
                        }));

                    dlg.addCancelButton();
                });

                btn.style.gridColumn = "1 / span 3";
            }
        }

        canEdit(obj: ISceneGameObject, n: number): boolean {

            return isGameObject(obj) && FXObjectExtension.allowGameObject(obj);
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}