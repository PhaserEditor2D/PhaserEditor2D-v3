namespace phasereditor2d.scene.ui.sceneobjects {

    import read = colibri.core.json.read;
    import write = colibri.core.json.write;
    import controls = colibri.ui.controls;

    export abstract class EditorSupport<T extends SceneObject> {

        private _extension: SceneObjectExtension;
        private _object: T;
        private _label: string;
        private _scene: GameScene;
        private _serializers: json.ObjectSerializer[];
        // tslint:disable-next-line:ban-types
        private _components: Map<Function, any>;

        constructor(extension: SceneObjectExtension, obj: T) {

            this._extension = extension;
            this._object = obj;
            this._serializers = [];
            this._components = new Map();

            this._object.setDataEnabled();
            this.setId(Phaser.Utils.String.UUID());
        }

        abstract getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera);

        abstract getCellRenderer(): controls.viewers.ICellRenderer;

        // tslint:disable-next-line:ban-types
        getComponent(ctr: Function): any {
            return this._components.get(ctr) as T;
        }

        // tslint:disable-next-line:ban-types
        hasComponent(ctr: Function) {
            return this._components.has(ctr);
        }

        protected addComponent(...components: any[]) {

            for (const c of components) {

                this._components.set(c.constructor, c);
            }

            this._serializers.push(...components);
        }

        protected setNewId(sprite: sceneobjects.SceneObject) {
            this.setId(Phaser.Utils.String.UUID());
        }

        getExtension() {
            return this._extension;
        }

        getObject() {
            return this._object;
        }

        getId() {
            return this._object.name;
        }

        setId(id: string) {
            this._object.name = id;
        }

        getLabel() {
            return this._label;
        }

        setLabel(label: string) {
            this._label = label;
        }

        getScene() {
            return this._scene;
        }

        setScene(scene: GameScene) {
            this._scene = scene;
        }

        writeJSON(data: any) {

            write(data, "id", this.getId());
            write(data, "type", this._extension.getTypeName());
            write(data, "label", this._label);

            for (const s of this._serializers) {
                s.writeJSON(data);
            }
        }

        readJSON(data: any) {

            this.setId(read(data, "id"));
            this._label = read(data, "label");

            for (const s of this._serializers) {
                s.readJSON(data);
            }
        }
    }
}