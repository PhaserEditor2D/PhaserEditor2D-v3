namespace phasereditor2d.scene.ui.sceneobjects {

    export class Container extends Phaser.GameObjects.Container implements ISceneObject {

        private _editorSupport: ContainerEditorSupport;

        constructor(scene: Scene, x: number, y: number, children: ISceneObject[]) {
            super(scene, x, y, children);

            this._editorSupport = new ContainerEditorSupport(this, scene);
        }

        getEditorSupport() {

            return this._editorSupport;
        }

        getList(): ISceneObject[] {

            return super.list as any;
        }
    }
}