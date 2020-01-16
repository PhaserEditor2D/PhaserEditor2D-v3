namespace phasereditor2d.scene.ui.sceneobjects {

    export class Container extends Phaser.GameObjects.Container implements ISceneObject {

        private _editorSupport: ContainerEditorSupport;

        constructor(scene: Scene, x: number, y: number, children: ISceneObject[]) {
            super(scene, x, y, children);

            this._editorSupport = new ContainerEditorSupport(this);
        }

        getEditorSupport() {
            return this._editorSupport;
        }

        get list(): ISceneObject[] {
            return super.list as any;
        }

        set list(list: ISceneObject[]) {
            super.list = list;
        }
    }
}