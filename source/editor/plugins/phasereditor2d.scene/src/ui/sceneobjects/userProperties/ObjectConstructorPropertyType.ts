/// <reference path="./StringPropertyType.ts" />
/// <reference path="./AbstractDialogPropertyType.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class ObjectConstructorPropertyType extends AbstractDialogPropertyType {

        constructor() {
            super({
                id: "constructor",
                dialogTitle: "Select a Type",
                name: "Object Constructor",
                hasCustomIcon: true
            });

            this.setExpressionType("any");
        }

        hasCustomPropertyType(): boolean {

            return true;
        }

        getName(): string {

            return "Object Constructor";
        }

        buildDeclarePropertyCodeDOM(prop: UserProperty, value: string): core.code.FieldDeclCodeDOM {

            return this.buildExpressionFieldCode(prop, this.getExpressionType(), value);
        }

        buildSetObjectPropertyCodeDOM(comp: Component<any>, args: ISetObjectPropertiesCodeDOMArgs, userProp: UserProperty): void {

            comp.buildSetObjectPropertyCodeDOM_StringVerbatimProperty(args, userProp.getComponentProperty());
        }

        protected async updateIcon(iconControl: controls.IconControl, value: string) {

            let icon: controls.IImage = colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER);

            if (value.startsWith("Phaser.GameObjects.")) {

                icon = this.findIcon(value) || icon;

            } else {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const file = finder.getSceneFiles()
                    .find(f => this.valueToString(null, f) === value);

                if (file) {

                    const cache = SceneThumbnailCache.getInstance();

                    await cache.preload(file);

                    const img = cache.getContent(file);

                    if (img) {

                        await img.preloadSize();
                        await img.preload();

                        icon = img;
                    }
                }
            }

            iconControl.setIcon(icon);
        }

        private findIcon(type: string) {

            const ext = ScenePlugin.getInstance().getGameObjectExtensions().find(ext => ext.getPhaserTypeName() === type);

            if (ext) {

                return ext.getIcon();
            }

            return undefined;
        }

        protected async createViewer() {

            const viewer = new controls.viewers.TreeViewer(this.getId());

            viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider((element) => {

                if (element instanceof io.FilePath) {

                    return new viewers.SceneFileCellRenderer();
                }

                const icon = this.findIcon(element);

                if (icon) {

                    return new controls.viewers.IconImageCellRenderer(icon);
                }

                return new controls.viewers.EmptyCellRenderer();
            }));

            viewer.setLabelProvider(new controls.viewers.LabelProvider((element: io.FilePath | string) => {

                const label = this.valueToString(viewer, element);

                return label;
            }));
            // viewer.setTreeRenderer(new controls.viewers.GridTreeViewerRenderer(viewer));
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            viewer.setCellSize(32);

            return viewer;
        }

        protected async loadViewerInput(viewer: controls.viewers.TreeViewer) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const types = ScenePlugin.getInstance().getGameObjectExtensions().map(ext => ext.getPhaserTypeName());

            viewer.setInput([...finder.getPrefabFiles(), ...types]);
        }

        protected valueToString(viewer: controls.viewers.TreeViewer, selected: io.FilePath | string): string {

            if (selected instanceof io.FilePath) {

                return selected.getNameWithoutExtension();
            }

            return selected;
        }
    }
}