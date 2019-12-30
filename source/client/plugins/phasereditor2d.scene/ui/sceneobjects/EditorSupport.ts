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
        private _supporters: Map<Function, any>;

        constructor(extension: SceneObjectExtension, obj: T) {

            this._extension = extension;
            this._object = obj;
            this._serializers = [];
            this._supporters = new Map();

            this._object.setDataEnabled();
            this.setId(Phaser.Utils.String.UUID());
        }

        abstract getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera);

        abstract getCellRenderer(): controls.viewers.ICellRenderer;

        // tslint:disable-next-line:no-shadowed-variable
        getSupporter<T>(
            // tslint:disable-next-line:ban-types
            supporterType: Function): T {

            return this._supporters.get(supporterType) as T;
        }

        // tslint:disable-next-line:ban-types
        hasSupporter(supporterType: Function) {
            return this._supporters.has(supporterType);
        }

        protected addSupporters(...supporters: any[]) {

            for (const supporter of supporters) {

                this._supporters.set(supporter.constructor, supporter);
            }

            this._serializers.push(...supporters);
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