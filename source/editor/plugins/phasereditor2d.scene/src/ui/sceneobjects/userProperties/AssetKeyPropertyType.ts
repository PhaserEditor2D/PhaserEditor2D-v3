/// <reference path="./StringPropertyType.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class AssetKeyPropertyType extends AbstractAssetKeyPropertyType {

        constructor() {
            super({
                id: "asset-key",
                name: "Asset Key",
                dialogTitle: "Select Asset Key"
            });
        }
    }
}