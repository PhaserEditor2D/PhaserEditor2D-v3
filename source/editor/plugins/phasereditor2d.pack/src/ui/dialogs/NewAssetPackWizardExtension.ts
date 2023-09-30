namespace phasereditor2d.pack.ui.dialogs {

    import io = colibri.core.io;

    export class NewAssetPackFileWizardExtension extends files.ui.dialogs.NewFileContentExtension {

        constructor() {
            super({
                dialogName: "Asset Pack File",
                dialogIconDescriptor: resources.getIconDescriptor(resources.ICON_ASSET_PACK),
                initialFileName: "asset-pack",
                fileExtension: "json"
            });
        }

        getCreateFileContentFunc() {
            return (args: files.ui.dialogs.ICreateFileContentArgs) => JSON.stringify({
                section1: {
                    files: []
                },
                meta: {
                    app: "Phaser Editor 2D - Asset Pack Editor",
                    url: "https://phasereditor2d.com",
                    contentType: core.contentTypes.CONTENT_TYPE_ASSET_PACK,
                    version: 2
                }
            });
        }

        getInitialFileLocation() {
            return super.findInitialFileLocationBasedOnContentType(pack.core.contentTypes.CONTENT_TYPE_ASSET_PACK);
        }
    }
}