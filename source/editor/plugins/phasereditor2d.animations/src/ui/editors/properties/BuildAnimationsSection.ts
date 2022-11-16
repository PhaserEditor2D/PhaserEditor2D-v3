namespace phasereditor2d.animations.ui.editors.properties {

    import controls = colibri.ui.controls;

    type BuildAnimationElement = pack.core.AssetPackImageFrame
        | pack.core.ImageFrameContainerAssetPackItem;

    export class BuildAnimationsSection extends controls.properties.PropertySection<BuildAnimationElement> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.animations.ui.editors.properties.BuildAnimationsSection", "Auto Build Animations", false, false);
        }

        private getEditor() {

            return colibri.Platform.getWorkbench().getActiveEditor() as AnimationsEditor;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 1);

            const clustersElement = document.createElement("div");

            comp.appendChild(clustersElement);

            const btn = this.createButton(comp, "Build", async () => {

                const builder = new AnimationsBuilder(this.getEditor(), this.getSelection());

                builder.build();
            });

            this.addUpdater(() => {

                const builder = new AnimationsBuilder(this.getEditor(), this.getSelection());

                const clusters = builder.buildClusters();

                const len = clusters.length;

                let html: string = "";

                if (len > 0) {

                    html += clusters.map(c => `<b>${c.prefix}</b> <small>(${c.elements.length} frames)</small>`).join("<br>")
                    html += "<br><br>";
                }

                clustersElement.innerHTML = html;

                btn.disabled = len === 0;
                btn.textContent = "Build " + len + " animations";
            });
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