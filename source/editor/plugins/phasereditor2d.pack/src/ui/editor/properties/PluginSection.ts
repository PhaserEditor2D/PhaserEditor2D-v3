/// <reference path="./BaseSection.ts" />

namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class PluginSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.PluginSection", "Plugin", core.PLUGIN_TYPE);
        }

        canEdit(obj: any, n: number) {
            return super.canEdit(obj, n) && obj instanceof core.PluginAssetPackItem;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            {
                // URL
                this.createFileField(comp, "URL", "url", webContentTypes.core.CONTENT_TYPE_JAVASCRIPT,
                    "Phaser.Loader.LoaderPlugin.plugin(url)");
            }

            {
                // start

                this.createLabel(comp, "Start",
                    this.getHelp("Phaser.Loader.LoaderPlugin.plugin(start)"));

                const checkbox = this.createCheckbox(comp);
                checkbox.style.gridColumn = "2 / span 2";

                checkbox.addEventListener("change", e => {
                    this.changeItemField("start", checkbox.checked, true);
                });

                this.addUpdater(() => {
                    const data = this.getSelection()[0].getData();
                    checkbox.checked = data.start;
                });
            }

            this.createSimpleTextField(comp, "Mapping", "mapping",
                this.getHelp("Phaser.Loader.LoaderPlugin.plugin(mapping)"));

        }
    }
}