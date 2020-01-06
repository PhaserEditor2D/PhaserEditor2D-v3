namespace phasereditor2d.scene.ui.sceneobjects {

    import read = colibri.core.json.read;
    import write = colibri.core.json.write;
    import controls = colibri.ui.controls;
    import json = core.json;

    export enum ObjectScope {

        METHOD = "METHOD",
        CLASS = "CLASS",
        PUBLIC = "PUBLIC"
    }

    export abstract class EditorSupport<T extends SceneObject> {

        private _extension: SceneObjectExtension;
        private _object: T;
        private _prefabId: string;
        private _label: string;
        private _scope: ObjectScope;
        private _scene: GameScene;
        private _serializables: json.Serializable[];
        // tslint:disable-next-line:ban-types
        private _components: Map<Function, Component<any>>;

        constructor(extension: SceneObjectExtension, obj: T) {

            this._extension = extension;
            this._object = obj;
            this._serializables = [];
            this._components = new Map();
            this._object.setDataEnabled();
            this.setId(Phaser.Utils.String.UUID());
            this._scope = ObjectScope.METHOD;
        }

        abstract getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera): Phaser.Math.Vector2[];

        abstract getCellRenderer(): controls.viewers.ICellRenderer;

        // tslint:disable-next-line:ban-types
        getComponent(ctr: Function): Component<any> {
            return this._components.get(ctr);
        }

        // tslint:disable-next-line:ban-types
        hasComponent(ctr: Function) {
            return this._components.has(ctr);
        }

        getComponents() {
            return this._components.values();
        }

        // tslint:disable-next-line:ban-types
        static getObjectComponent(obj: any, ctr: Function) {

            if (obj && typeof obj["getEditorSupport"] === "function") {

                const support = obj["getEditorSupport"]() as EditorSupport<any>;

                return support.getComponent(ctr) ?? null;
            }

            return null;
        }

        protected addComponent(...components: Array<Component<any>>) {

            for (const c of components) {

                this._components.set(c.constructor, c);
            }

            this._serializables.push(...components);
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

        getScope() {
            return this._scope;
        }

        setScope(scope: ObjectScope) {
            this._scope = scope;
        }

        getScene() {
            return this._scene;
        }

        setScene(scene: GameScene) {
            this._scene = scene;
        }

        isPrefabInstance() {
            return typeof this._prefabId === "string";
        }

        getOwnerPrefabInstance(): SceneObject {

            if (this._object.parentContainer) {

                const parent = this._object.parentContainer as unknown as SceneObject;

                return parent.getEditorSupport().getOwnerPrefabInstance();
            }

            if (this._object.getEditorSupport().isPrefabInstance()) {

                return this._object;
            }

            return null;
        }

        getPrefabId() {
            return this._prefabId;
        }

        getPrefabName() {

            if (this._prefabId) {

                const file = this._scene.getMaker().getSceneDataTable().getPrefabFile(this._prefabId);

                if (file) {

                    return file.getNameWithoutExtension();
                }
            }

            return null;
        }

        getPrefabData() {

            if (this._prefabId) {

                const data = this._scene.getMaker().getSceneDataTable().getPrefabData(this._prefabId);

                return data;
            }

            return null;
        }

        getPrefabSerializer() {

            const data = this.getPrefabData();

            if (data) {

                return this._scene.getMaker().getSerializer(data);
            }

            return null;
        }

        getObjectType() {

            const ser = this._scene.getMaker().getSerializer({
                id: this.getId(),
                type: this._extension.getTypeName(),
                prefabId: this._prefabId
            });

            return ser.getType();
        }

        getPhaserType() {

            const ser = this._scene.getMaker().getSerializer({
                id: this.getId(),
                type: this._extension.getTypeName(),
                prefabId: this._prefabId
            });

            return ser.getPhaserType();
        }

        getSerializer(data: json.ObjectData) {

            return this._scene.getMaker().getSerializer(data);
        }

        writeJSON(data: json.ObjectData) {

            if (this._prefabId) {
                data.prefabId = this._prefabId;
            }

            const ser = this.getSerializer(data);

            if (!this._prefabId) {

                ser.write("type", this._extension.getTypeName());
            }

            ser.write("id", this.getId());
            ser.write("label", this._label);
            write(data, "scope", this._scope, ObjectScope.METHOD);

            for (const s of this._serializables) {

                s.writeJSON(ser);
            }
        }

        readJSON(data: json.ObjectData) {

            const ser = this.getSerializer(data);

            this.setId(ser.read("id"));
            this._prefabId = ser.getData().prefabId;
            this._label = ser.read("label");
            this._scope = read(data, "scope", ObjectScope.METHOD);

            for (const s of this._serializables) {

                s.readJSON(ser);
            }
        }
    }
}