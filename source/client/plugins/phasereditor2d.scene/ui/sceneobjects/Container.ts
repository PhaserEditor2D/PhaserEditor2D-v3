namespace phasereditor2d.scene.ui.sceneobjects {

    export class Container extends Phaser.GameObjects.Container implements SceneObject {

        private _editorSupport: ContainerEditorSupport;

        constructor(scene: GameScene, x: number, y: number, children: SceneObject[]) {
            super(scene, x, y, children);

            this._editorSupport = new ContainerEditorSupport(this);
        }

        getEditorSupport() {
            return this._editorSupport;
        }

        get list(): SceneObject[] {
            return super.list as any;
        }

        set list(list: SceneObject[]) {
            super.list = list;
        }
    }
}