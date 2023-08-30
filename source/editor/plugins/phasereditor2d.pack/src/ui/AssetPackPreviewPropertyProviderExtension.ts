namespace phasereditor2d.pack.ui {

    import controls = colibri.ui.controls;

    type IPreviewPropertySectionProvider = (page: controls.properties.PropertyPage) => controls.properties.PropertySection<any>;

    export class AssetPackPreviewPropertyProviderExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.pack.ui.AssetPackPreviewPropertyProviderExtension";

        private _providers: IPreviewPropertySectionProvider[];

        constructor(...providers: IPreviewPropertySectionProvider[]) {
            super(AssetPackPreviewPropertyProviderExtension.POINT_ID);

            this._providers = providers;
        }

        getSections(page: controls.properties.PropertyPage) {

            return this._providers.map(providers => providers(page));
        }
    }
}