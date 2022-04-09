/// <reference path="./UserPropertyType.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ObjectVarPropertyType extends AbstractDialogPropertyType {

        constructor() {
            super({
                id: "object-var",
                dialogTitle: "Select Object",
                name: "Object Dialog",
                hasCustomIcon: true
            });

            this.setExpressionType("Phaser.GameObjects.GameObject");
        }

        hasCustomPropertyType(): boolean {

            return true;
        }

        getName() {

            return "Object Variable";
        }

        renderValue(value: any): string {

            return value;
        }

        buildDeclarePropertyCodeDOM(prop: UserProperty, value: string): core.code.FieldDeclCodeDOM {

            return this.buildExpressionFieldCode(prop, this.getExpressionType(), value);
        }

        buildSetObjectPropertyCodeDOM(comp: Component<any>, args: ISetObjectPropertiesCodeDOMArgs, userProp: UserProperty): void {

            comp.buildSetObjectPropertyCodeDOM_StringVerbatimProperty(args, userProp.getComponentProperty());
        }

        protected async createViewer() {

            const viewer = new controls.viewers.TreeViewer("phasereditor2d.scene.editor.ObjectVarExpressionType.Dialog");
            viewer.setCellRendererProvider(new editor.outline.SceneEditorOutlineRendererProvider());
            viewer.setLabelProvider(new editor.outline.SceneEditorOutlineLabelProvider());
            viewer.setStyledLabelProvider(new editor.outline.SceneEditorOutlineStyledLabelProvider());
            viewer.setContentProvider(new ObjectVarContentProvider(this.getEditor()));

            return viewer;
        }

        protected valueToString(viewer: colibri.ui.controls.viewers.TreeViewer, value: any): string {

            const support = EditorSupport.getEditorSupport(value);

            if (support) {

                return support.getLabel();
            }

            return viewer.getLabelProvider().getLabel(value);
        }

        protected loadViewerInput(viewer: colibri.ui.controls.viewers.TreeViewer): void {

            viewer.setInput(this.getEditor().getScene().getDisplayListChildren());
        }

        protected async updateIcon(iconControl: controls.IconControl, value: string): Promise<void> {

            const scene = this.getEditor().getScene();

            const foundElement = [undefined];

            scene.visitAll(obj => {

                if (!foundElement[0]) {

                    if (obj.getEditorSupport().getLabel() === value) {

                        foundElement[0] = obj;
                    }
                }
            });

            const found = foundElement[0];

            if (found) {

                const renderer = new editor.outline.SceneEditorOutlineRendererProvider()
                    .getCellRenderer(found);

                const icon = new controls.viewers.ImageFromCellRenderer(found, renderer, controls.RENDER_ICON_SIZE, controls.RENDER_ICON_SIZE)

                iconControl.setIcon(icon);

            } else {

                iconControl.setIcon(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));
            }
        }
    }

    class ObjectVarContentProvider extends editor.outline.SceneEditorOutlineContentProvider {

        getRoots(input: any): any[] {

            return input;
        }
    }
}