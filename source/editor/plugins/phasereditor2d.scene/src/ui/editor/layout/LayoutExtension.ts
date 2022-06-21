namespace phasereditor2d.scene.ui.editor.layout {

    import controls = colibri.ui.controls;

    export interface ILayoutExtensionConfig {
        name: string;
        group: string;
        icon: controls.IconImage
    }

    export abstract class LayoutExtension<T extends ILayoutExtensionConfig> extends colibri.Extension {

        static POINT_ID = "phasereditor2d.scene.ui.editor.layout.LayoutExtension"

        private _config: T;

        constructor(config: T) {
            super(LayoutExtension.POINT_ID);

            this._config = config;
        }

        getConfig() {

            return this._config;
        }

        abstract performLayout(editor: SceneEditor): Promise<void>;
    }
}