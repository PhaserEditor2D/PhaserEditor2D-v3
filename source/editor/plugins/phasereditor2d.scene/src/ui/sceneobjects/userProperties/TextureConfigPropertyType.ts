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

        buildDeclarePropertyCodeDOM(prop: UserProperty, value: string): core.code.MemberDeclCodeDOM[] {

            return [this.buildExpressionFieldCode(prop, "{key:string,frame?:string|number}", value)];
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

        createViewer(finder: pack.core.PackFinder) {

            const viewer = super.createViewer(finder);

            viewer.setContentProvider(new TextureContentProvider());
            const renderer = new pack.ui.viewers.AssetPackTreeViewerRenderer(viewer, false);
            renderer.setSections([]);
            viewer.setTreeRenderer(renderer);
            viewer.setCellSize(72, true);

            return viewer;
        }
    }

    class TextureContentProvider implements controls.viewers.ITreeContentProvider {

        getRoots(input: any): any[] {

            const packs = input as pack.core.AssetPack[];

            const result = [];

            for (const pack1 of packs) {

                for (const item of pack1.getItems()) {

                    if (item instanceof pack.core.AssetPackImageFrame) {

                        result.push(item);

                    } else if (item instanceof pack.core.ImageFrameContainerAssetPackItem) {

                        result.push(item);
                    }
                }
            }

            return result;
        }

        getChildren(parent: any): any[] {

            if (parent instanceof pack.core.ImageFrameContainerAssetPackItem) {

                if (!(parent instanceof pack.core.ImageAssetPackItem)) {

                    return parent.getFrames();
                }
            }

            return [];
        }
    }
}