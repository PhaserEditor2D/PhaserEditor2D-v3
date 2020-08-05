/// <reference path="./BaseSection.ts" />

namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;

    export class ScenePluginSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.ScenePluginSection", "Scene Plugin", core.SCENE_PLUGIN_TYPE);
        }

        canEdit(obj: any, n: number) {
            return super.canEdit(obj, n) && obj instanceof core.ScenePluginAssetPackItem;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createFileField(comp, "URL", "url", webContentTypes.core.CONTENT_TYPE_JAVASCRIPT,
                "Phaser.Loader.LoaderPlugin.scenePlugin(url)");

            this.createSimpleTextField(comp, "System Key", "systemKey",
                "Phaser.Loader.LoaderPlugin.scenePlugin(systemKey)");

            this.createSimpleTextField(comp, "Scene Key", "sceneKey",
                "Phaser.Loader.LoaderPlugin.scenePlugin(sceneKey)");
        }
    }
}