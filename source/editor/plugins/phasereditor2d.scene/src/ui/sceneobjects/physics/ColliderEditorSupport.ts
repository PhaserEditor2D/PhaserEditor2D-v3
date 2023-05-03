namespace phasereditor2d.scene.ui.sceneobjects {

    export class ColliderEditorSupport extends ScenePlainObjectEditorSupport<Collider> {

        constructor(scene: Scene, obj: Collider) {
            super(ColliderExtension.getInstance(), obj, scene,

                new ColliderComponent(obj)
            );

            this.setScope(ObjectScope.LOCAL);
        }

        destroy() {

            // nothing
        }

        async buildDependencyHash(args: IBuildDependencyHashArgs): Promise<void> {

            // nothing
        }
    }
}