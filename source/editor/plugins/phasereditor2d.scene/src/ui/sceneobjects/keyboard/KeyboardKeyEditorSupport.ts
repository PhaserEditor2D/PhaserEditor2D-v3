namespace phasereditor2d.scene.ui.sceneobjects {

    export class KeyboardKeyEditorSupport extends ScenePlainObjectEditorSupport<KeyboardKey> {

        constructor(scene: Scene, obj: KeyboardKey) {
            super(KeyboardKeyExtension.getInstance(),
                obj, scene,
                new KeyboardKeyComponent(obj)
            );
        }

        destroy() {
            // nothing
        }

        async buildDependencyHash(args: IBuildDependencyHashArgs) {

            // nothing
        }
    }
}