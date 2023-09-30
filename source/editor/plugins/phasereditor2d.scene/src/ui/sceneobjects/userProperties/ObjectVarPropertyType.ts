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

            const objES = EditorSupport.getEditorSupport(value);

            if (objES) {

                if (objES instanceof GameObjectEditorSupport && objES.isNestedPrefabInstance()) {

                    return core.code.SceneCodeDOMBuilder.getPrefabInstanceVarName(value);
                }

                return core.code.formatToValidVarName(objES.getLabel());
            }

            return core.code.formatToValidVarName(viewer.getLabelProvider().getLabel(value));
        }

        protected async loadViewerInput(viewer: colibri.ui.controls.viewers.TreeViewer): Promise<void> {

            const scene = this.getEditor().getScene();

            const input = [
                ...scene.getGameObjects(),
                ...scene.getPlainObjects(),
                ...scene.getObjectLists().getLists()
            ];

            viewer.setInput(input);
        }

        protected async updateIcon(iconControl: controls.IconControl, value: string): Promise<void> {

            const scene = this.getEditor().getScene();

            const foundElement = [undefined];

            scene.visitAllAskChildren(obj => {

                if (!foundElement[0]) {

                    const objES = obj.getEditorSupport();

                    if (objES.isNestedPrefabInstance()) {

                        const objVarName = core.code.SceneCodeDOMBuilder.getPrefabInstanceVarName(obj);

                        if (objVarName === value) {

                            foundElement[0] = obj;

                            return false;
                        }

                    } else if (core.code.formatToValidVarName(objES.getLabel()) === value) {

                        foundElement[0] = obj;

                        return false;
                    }

                    return true;
                }
            });

            let found = foundElement[0];

            if (!found) {

                found = scene.getPlainObjects().find(
                    obj => core.code.formatToValidVarName(obj.getEditorSupport().getLabel()) === value);
            }

            if (!found) {

                found = scene.getObjectLists().getLists()
                    .find(l => core.code.formatToValidVarName(l.getLabel()) === value);
            }

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

    export class ObjectVarContentProvider extends editor.outline.SceneEditorOutlineContentProvider {

        getRoots(input: any): any[] {

            return input;
        }
    }
}