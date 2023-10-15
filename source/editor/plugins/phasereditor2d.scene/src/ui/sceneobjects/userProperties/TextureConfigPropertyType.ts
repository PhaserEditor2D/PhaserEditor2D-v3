namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TextureConfigPropertyType extends AbstractAssetKeyPropertyType {

        constructor() {
            super({
                id: "texture-config",
                name: "Texture Config",
                dialogTitle: "Select Texture",
                hasCustomIcon: true
            });
        }

        getDialogSize() {

            return {
                width: window.innerWidth * 2 / 3,
                height: window.innerHeight * 2 / 3
            };
        }

        protected getIcon(finder: pack.core.PackFinder, value: string): controls.IImage {

            try {

                const config = JSON.parse(value);

                if (config) {

                    const result = finder.getAssetPackItemImage(config.key, config.frame);

                    return result;
                }

            } catch (e) {
                // nothing
            }

            return null;
        }

        revealValue(viewer: controls.viewers.TreeViewer, value: string) {

            try {

                const obj = JSON.parse(value);

                const finder = new pack.core.PackFinder(...viewer.getInput());

                const found = finder.getAssetPackItemOrFrame(obj.key, obj.frame);

                if (found) {

                    viewer.setSelection([found]);
                    viewer.reveal(found);
                }

            } catch (e) {
                // nothing
            }
        }

        buildSetObjectPropertyCodeDOM(comp: Component<any>, args: ISetObjectPropertiesCodeDOMArgs, userProp: UserProperty): void {

            comp.buildSetObjectPropertyCodeDOM_StringVerbatimProperty(args, userProp.getComponentProperty());
        }

        buildDeclarePropertyCodeDOM(prop: UserProperty, value: string): core.code.FieldDeclCodeDOM {

            return this.buildExpressionFieldCode(prop, "{key:string,frame?:string|number}", value);
        }

        formatKeyFrame(key: string, frame: string | number) {

            let data: any;

            if (frame !== undefined) {

                data = { key, frame };

            } else {

                data = { key };
            }

            return JSON.stringify(data);
        }

        async createViewer() {

            const finder = new pack.core.PackFinder();
            await finder.preload();

            const viewer = await super.createViewer();
            viewer.setContentProvider(new TextureContentProvider(finder));
            viewer.setTreeRenderer(new pack.ui.viewers.AssetPackTreeViewerRenderer(viewer, false));
            viewer.setCellSize(72, true);

            return viewer;
        }
    }

    class TextureContentProvider implements controls.viewers.ITreeContentProvider {

        constructor(private finder: pack.core.PackFinder) {

        }

        getRoots(input: any): any[] {

            return [
                pack.core.IMAGE_TYPE,
                pack.core.SVG_TYPE,
                pack.core.ATLAS_TYPE,
                pack.core.ASEPRITE_TYPE,
                pack.core.SPRITESHEET_TYPE];
        }

        private getItems(type: string) {

            return this.finder.getPacks()
                .flatMap(p => p.getItems())
                .filter(item => item.getType() === type || type === pack.core.ATLAS_TYPE &&
                    pack.core.AssetPackUtils.isAtlasType(item.getType()));
        }

        getChildren(parent: any): any[] {

            if (typeof parent === "string") {

                return this.getItems(parent);
            }

            if (parent instanceof pack.core.ImageFrameContainerAssetPackItem
                || parent instanceof pack.core.AsepriteAssetPackItem) {

                if (!(parent instanceof pack.core.ImageAssetPackItem)) {

                    return parent.getFrames();
                }
            }

            return [];
        }
    }
}