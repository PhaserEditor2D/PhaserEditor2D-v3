namespace phasereditor2d.scene.ui.sceneobjects {

    export class TilemapEditorSupport extends ScenePlainObjectEditorSupport<Tilemap> {

        constructor(scene: Scene, obj: Tilemap) {
            super(TilemapExtension.getInstance(), obj, scene);
        }

        writeJSON(data: core.json.IScenePlainObjectData) {

            super.writeJSON(data)

            data["key"] = this.getObject().getTilemapAssetKey();
        }

        destroy() {

            this.getObject().destroy();
        }

        async buildDependencyHash(args: IBuildDependencyHashArgs) {
            //
        }
    }
}