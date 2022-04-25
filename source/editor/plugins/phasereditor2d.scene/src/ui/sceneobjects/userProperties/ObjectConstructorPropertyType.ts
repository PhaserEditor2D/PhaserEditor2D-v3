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
        }

        buildDeclarePropertyCodeDOM(prop: UserProperty, value: string): core.code.FieldDeclCodeDOM {

            return this.buildExpressionFieldCode(prop, "FunctionConstructor", value);
        }

        buildSetObjectPropertyCodeDOM(comp: Component<any>, args: ISetObjectPropertiesCodeDOMArgs, userProp: UserProperty): void {

            comp.buildSetObjectPropertyCodeDOM_StringVerbatimProperty(args, userProp.getComponentProperty());
        }

        protected async updateIcon(iconControl: controls.IconControl, value: string) {

            if (value.startsWith("Phaser.GameObjects.")) {

                // find the extension and set the icon from the extension
                
            } else {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                await finder.preload(controls.EMPTY_PROGRESS_MONITOR);

                const file = finder.getSceneFiles()
                    .find(f => this.valueToString(null, f) === value);

                if (file) {

                    const cache = SceneThumbnailCache.getInstance();

                    await cache.preload(file);

                    const img = cache.getContent(file);

                    if (img) {

                        await img.preloadSize();
                        await img.preload();

                        iconControl.setIcon(img);

                    } else {

                        iconControl.setIcon(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));
                    }
                }
            }
        }

        protected getDialogSize() {

            return {
                width: window.innerWidth / 2,
                height: window.innerHeight / 2
            };
        }

        protected async createViewer() {

            const viewer = new controls.viewers.TreeViewer(this.getId());

            viewer.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider(() => new viewers.SceneFileCellRenderer()));
            viewer.setLabelProvider(new controls.viewers.LabelProvider((file: io.FilePath) => {

                const label = this.valueToString(viewer, file);

                return label;
            }));
            viewer.setTreeRenderer(new controls.viewers.GridTreeViewerRenderer(viewer));
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());

            return viewer;
        }

        protected async loadViewerInput(viewer: controls.viewers.TreeViewer) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            viewer.setInput(finder.getPrefabFiles());
        }

        protected valueToString(viewer: controls.viewers.TreeViewer, selected: io.FilePath): string {

            const data = ScenePlugin.getInstance().getSceneFinder().getSceneData(selected);

            return data?.settings?.sceneKey || selected.getNameWithoutExtension();
        }
    }
}