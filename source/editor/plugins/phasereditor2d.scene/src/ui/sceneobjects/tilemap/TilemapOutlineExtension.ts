/// <reference path="../../editor/outline/SceneEditorOutlineExtension.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TilemapOutlineExtension extends editor.outline.SceneEditorOutlineExtension {

        isLabelProviderFor(element: any): boolean {

            return element instanceof Phaser.Tilemaps.Tileset;
        }

        getLabelProvider(): colibri.ui.controls.viewers.ILabelProvider {

            return new controls.viewers.LabelProvider(obj => {

                if (obj instanceof Phaser.Tilemaps.Tileset) {

                    return obj.name;
                }

                return "";
            });
        }

        isCellRendererProviderFor(element: any): boolean {

            return this.isLabelProviderFor(element);
        }

        getCellRendererProvider(): colibri.ui.controls.viewers.ICellRendererProvider {

            return new controls.viewers.EmptyCellRendererProvider(obj => {

                if (obj instanceof Phaser.Tilemaps.Tileset) {

                    if (obj.image) {

                        const editor = colibri.Platform.getWorkbench().getActiveEditor();

                        if (editor instanceof ui.editor.SceneEditor) {

                            const cache = editor.getScene().getPackCache();

                            const image = cache.getImage(obj.image.key)
                                || cache.getSpritesheetImage(obj.image.key);

                            if (image) {

                                return new controls.viewers.ImageCellRenderer(image);
                            }
                        }
                    }
                }

                return new controls.viewers.EmptyCellRenderer(false);
            });
        }

        isContentProviderFor(parent: any): boolean {

            return parent instanceof Tilemap;
        }

        getContentProvider(): colibri.ui.controls.viewers.ITreeContentProvider {

            return new TilemapContentProvider();
        }
    }

    class TilemapContentProvider implements controls.viewers.ITreeContentProvider {

        getRoots(input: any): any[] {

            return [];
        }

        getChildren(parent: any): any[] {

            if (parent instanceof Tilemap) {

                return parent.tilesets;
            }

            return [];
        }

    }
}