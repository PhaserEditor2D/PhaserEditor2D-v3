namespace phasereditor2d.animations.ui.editors {

    import controls = colibri.ui.controls;

    export class AnimationsBuilder {
        private _editor: AnimationsEditor;
        private _assets: any[];

        constructor(editor: AnimationsEditor, assets: any[]) {

            this._editor = editor;
            this._assets = assets;
        }

        build() {

            const dlg = new controls.dialogs.InputDialog();
            dlg.create();
            dlg.setTitle("Animations prefix");
            dlg.setMessage("Enter a prefix to be inserted in the name of the new animations")
            dlg.setInitialValue("");
            dlg.setInputValidator(value => true);
            dlg.setResultCallback((prefix) => {

                this.autoBuild(prefix);
            })
        }

        private autoBuild(prependToName: string) {

            const editor = this._editor;

            const nameMaker = new colibri.ui.ide.utils.NameMaker((a: Phaser.Animations.Animation) => a.key)

            nameMaker.update(editor.getAnimations());

            const clusters = this.buildClusters();

            const animsArray: any[] = clusters.map(c => {

                return {
                    key: nameMaker.makeName(prependToName + c.prefix),
                    frameRate: 24,
                    repeat: -1,
                    frames: c.elements.map(e => {

                        const packFrame = e.data as pack.core.AssetPackImageFrame;

                        const packItem = packFrame.getPackItem();

                        if (packItem instanceof pack.core.ImageAssetPackItem) {

                            return {
                                key: packItem.getKey()
                            }

                        }

                        return {
                            key: packItem.getKey(),
                            frame: packFrame.getName()
                        }
                    })
                }
            });

            const scene = editor.getScene();

            const data = scene.anims.toJSON();

            data.anims.push(...animsArray);

            editor.fullResetDataOperation(data, async () => {

                editor.setSelection(animsArray.map(a => editor.getAnimation(a.key)));

                editor.getElement().focus();

                colibri.Platform.getWorkbench().setActivePart(editor);
            });
        }

        buildClusters() {

            const labelProvider = this._editor
                .getEditorViewerProvider(blocks.ui.views.BlocksView.EDITOR_VIEWER_PROVIDER_KEY)
                .getLabelProvider();

            const builder = new NameClustersBuilder();
            const used = new Set();

            for (const elem of this._assets) {

                let frames: pack.core.AssetPackImageFrame[] = [];

                if (elem instanceof pack.core.ImageFrameContainerAssetPackItem) {

                    frames = elem.getFrames();

                } else if (elem instanceof pack.core.AssetPackImageFrame){

                    frames = [elem];
                }

                for (const frame of frames) {

                    {
                        const id = frame.getPackItem().getKey() + "$" + frame.getName();

                        if (used.has(id)) {

                            continue;
                        }

                        used.add(id);
                    }

                    let name = typeof frame.getName() === "string" ?
                        frame.getName() as string :
                        frame.getPackItem().getKey() + "-" + frame.getName();

                    if (frame.getPackItem() instanceof pack.core.SpritesheetAssetPackItem) {

                        name = frame.getPackItem().getKey() + "-" + labelProvider.getLabel(frame.getName());
                    }

                    const lowerName = name.toLowerCase();

                    for (const ext of [".png", ".jpg", ".bmp", ".gif", ".webp"]) {

                        if (lowerName.endsWith(ext)) {

                            name = name.substring(0, name.length - ext.length);
                        }
                    }

                    builder.addElement({
                        name: name,
                        data: frame
                    });
                }
            }

            return builder.build();
        }
    }
}