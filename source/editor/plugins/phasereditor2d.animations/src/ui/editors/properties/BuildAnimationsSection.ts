namespace phasereditor2d.animations.ui.editors.properties {

    import controls = colibri.ui.controls;

    type BuildAnimationElement = pack.core.AssetPackImageFrame
        | pack.core.ImageFrameContainerAssetPackItem;

    export class BuildAnimationsSection extends controls.properties.PropertySection<BuildAnimationElement> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "id", "Auto Build Animations", false, false);
        }

        private getEditor() {

            return colibri.Platform.getWorkbench().getActiveEditor() as AnimationsEditor;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 1);

            const clustersElement = document.createElement("div");

            comp.appendChild(clustersElement);

            const btn = this.createButton(comp, "Build", async () => {

                const dlg = new controls.dialogs.InputDialog();
                dlg.create();
                dlg.setTitle("Animations prefix");
                dlg.setMessage("Enter a prefix to be inserted in the name of the new animations:")
                dlg.setInitialValue("");
                dlg.setInputValidator(value => true);
                dlg.setResultCallback((prefix) => {

                    this.autoBuild(prefix);
                })
            });

            this.addUpdater(() => {

                const allClusters = this.buildClusters();

                const clusters = allClusters.filter(c => c.elements.length > 1);

                const len = clusters.length;

                let html: string = "";

                if (len > 0) {

                    html += clusters.map(c => `<b>${c.prefix}</b> <small>(${c.elements.length} frames)</small>`).join("<br>")
                    html += "<br><br>";
                }

                const skipped = allClusters.length - len;

                if (skipped > 0) {

                    html += `<small>Skipping ${skipped} animations with a single frame.</small>`;
                    html += "<br><br>";
                }


                clustersElement.innerHTML = html;

                btn.disabled = len === 0;
                btn.textContent = "Build " + len + " animations";
            });
        }

        private autoBuild(prependToName: string) {

            const editor = this.getEditor();

            const nameMaker = new colibri.ui.ide.utils.NameMaker((a: Phaser.Animations.Animation) => a.key)

            nameMaker.update(editor.getAnimations());

            const clusters = this.buildClusters().filter(c => c.elements.length > 1);

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

            editor.runAddAnimationsOperation(data, () => {

                editor.reset(data, false);

                editor.setSelection(animsArray.map(a => editor.getAnimation(a.key)));

                editor.getElement().focus();

                colibri.Platform.getWorkbench().setActivePart(editor);
            });
        }

        private buildClusters() {

            const builder = new NameClustersBuilder();

            for (const elem of this.getSelection()) {

                let frames: pack.core.AssetPackImageFrame[];

                if (elem instanceof pack.core.ImageFrameContainerAssetPackItem) {

                    frames = elem.getFrames();

                } else {

                    frames = [elem];
                }

                for (const frame of frames) {

                    const name = typeof frame.getName() === "string" ?
                        frame.getName() as string :
                        frame.getPackItem().getKey() + "-" + frame.getName();

                    builder.addElement({
                        name: name,
                        data: frame
                    })
                }
            }

            return builder.build();
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof pack.core.AssetPackImageFrame
                || obj instanceof pack.core.ImageFrameContainerAssetPackItem
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}