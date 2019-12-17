namespace phasereditor2d.scene.ui.gameobjects {

    export class EditorObjectMixin extends Phaser.GameObjects.GameObject {

        private _label : string;
        private _scene : GameScene;

        getEditorId() {
            return this.name;
        };
    
        setEditorId(id: string) {
            this.name = id;
        };
    
        getEditorLabel() {
            return this._label;
        };
    
        setEditorLabel(label: string) {
            this._label = label;
        };
    
        getEditorScene() {
            return this._scene;
        };
    
        setEditorScene(scene: GameScene) {
            this._scene = scene;
        };
    } 
}