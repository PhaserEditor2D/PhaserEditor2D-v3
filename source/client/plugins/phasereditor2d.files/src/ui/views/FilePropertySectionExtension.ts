namespace phasereditor2d.files.ui.views {

    import controls = colibri.ui.controls;

    export declare type GetPropertySection =
        (page: controls.properties.PropertyPage) => controls.properties.PropertySection<any>;

    export class FilePropertySectionExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.files.ui.views.FilePropertySectionExtension";

        private _sectionProviders: GetPropertySection[];

        constructor(...sectionProviders: GetPropertySection[]) {
            super(FilePropertySectionExtension.POINT_ID);

            this._sectionProviders = sectionProviders;
        }

        getSectionProviders() {
            return this._sectionProviders;
        }
    }
}