namespace phasereditor2d.scene.ui.editor.properties {

    import controls = colibri.ui.controls;

    export declare type GetPropertySection = (page: controls.properties.PropertyPage) => BaseSceneSection<any>;

    export class SceneEditorPropertySectionExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.scene.ui.editor.properties.SceneEditorPropertySectionExtension";

        private _sectionProviders: GetPropertySection[];

        constructor(...sectionProviders: GetPropertySection[]) {
            super(SceneEditorPropertySectionExtension.POINT_ID);

            this._sectionProviders = sectionProviders;
        }

        getSectionProviders(editor?: SceneEditor) {
            
            return this._sectionProviders;
        }
    }
}