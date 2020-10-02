namespace phasereditor2d.scene.ui.sceneobjects {

    export class TilemapEditorSupport extends ScenePlainObjectEditorSupport<Tilemap> {

        constructor(scene: Scene, obj: Tilemap) {
            super(TilemapExtension.getInstance(), obj, scene);
        }

        destroy() {

            this.getObject().destroy();
        }

        async buildDependencyHash(args: IBuildDependencyHashArgs) {
            //
        }
    }
}