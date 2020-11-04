namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;

    export abstract class GameObjectEditorSupport<T extends ISceneGameObject> extends EditorSupport<T> {

        private _extension: SceneGameObjectExtension;
        private _prefabId: string;
        private _serializables: json.ISerializable[];
        // tslint:disable-next-line:ban-types
        private _componentMap: Map<Function, Component<any>>;
        private _unlockedProperties: Set<string>;

        constructor(extension: SceneGameObjectExtension, obj: T, scene: Scene) {
            super(obj, extension.getTypeName().toLowerCase(), scene);

            this._extension = extension;
            this._unlockedProperties = new Set();
            this._serializables = [];
            this._componentMap = new Map();

            obj.setDataEnabled();

            this.setId(Phaser.Utils.String.UUID());

            this.addComponent(new VariableComponent(obj));
            this.addComponent(new PrefabUserPropertyComponent(obj));
            this.addComponent(new UserComponentsEditorComponent(obj));

            this.setInteractive();

            scene.sys.displayList.add(obj as Phaser.GameObjects.GameObject);
        }

        abstract setInteractive(): void;

        /**
         * Destroy the object. Return `true` if it requires a complete refresh of the scene, to re-build all objects.
         */
        destroy(): boolean | void {

            const obj = this.getObject() as Phaser.GameObjects.GameObject;

            obj.disableInteractive();

            obj.destroy();

            obj.active = false;

            (obj as unknown as Phaser.GameObjects.Components.Visible).visible = false;

            // hack, to remove the object from the input list

            const list = this.getScene().input["_list"] as any[];

            const i = list.indexOf(obj);

            if (i > 0) {

                list.splice(i, 1);
            }

            return false;
        }

        hasProperty(property: IProperty<any>) {

            for (const comp of this._componentMap.values()) {

                if (comp.getProperties().has(property)) {

                    return true;
                }
            }

            return false;
        }

        isLockedProperty(property: IProperty<any>) {

            return !this.isUnlockedProperty(property);
        }

        isUnlockedProperty(property: IProperty<any>) {

            if (property === TransformComponent.x || property === TransformComponent.y) {

                return true;
            }

            if (this.isPrefabInstance()) {

                if (property instanceof UserComponentPropertyWrapper) {

                    const userComp = property.getUserComponent();

                    const editorUserComp = this.getComponent(UserComponentsEditorComponent) as UserComponentsEditorComponent;

                    if (editorUserComp.hasLocalUserComponent(userComp.getName())) {

                        return true;
                    }
                }

                return this._unlockedProperties.has(property.name);
            }

            return true;
        }

        setUnlockedProperty(property: IProperty<any>, unlock: boolean) {

            if (unlock) {

                this._unlockedProperties.add(property.name);

            } else {

                this._unlockedProperties.delete(property.name);
            }
        }

        private static async buildPrefabDependencyHash(builder: ide.core.MultiHashBuilder, prefabId: string) {

            if (!prefabId) {
                return;
            }

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const file = finder.getPrefabFile(prefabId);

            if (!file) {
                return;
            }

            const token = "prefab(" + prefabId + "," + file.getModTime() + ")";

            builder.addPartialToken(token);

            const sceneData = finder.getSceneData(file);

            if (!sceneData) {
                return;
            }

            for (const objData of sceneData.displayList) {

                this.buildPrefabDependencyHash(builder, objData.prefabId);
            }
        }

        async buildDependencyHash(args: IBuildDependencyHashArgs) {

            GameObjectEditorSupport.buildPrefabDependencyHash(args.builder, this._prefabId);

            for (const comp of this.getComponents()) {

                comp.buildDependenciesHash(args);
            }
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {

            const sprite = this.getObject() as unknown as Phaser.GameObjects.Sprite;

            const points: Phaser.Math.Vector2[] = [
                new Phaser.Math.Vector2(0, 0),
                new Phaser.Math.Vector2(0, 0),
                new Phaser.Math.Vector2(0, 0),
                new Phaser.Math.Vector2(0, 0)
            ];

            let w = sprite.width;
            let h = sprite.height;

            if (sprite instanceof Phaser.GameObjects.BitmapText) {
                // the BitmapText.width is considered a displayWidth, it is already multiplied by the scale
                w = w / sprite.scaleX;
                h = h / sprite.scaleY;
            }

            const ox = sprite.originX;
            const oy = sprite.originY;

            const x = -w * ox;
            const y = -h * oy;

            const tx = sprite.getWorldTransformMatrix();

            tx.transformPoint(x, y, points[0]);
            tx.transformPoint(x + w, y, points[1]);
            tx.transformPoint(x + w, y + h, points[2]);
            tx.transformPoint(x, y + h, points[3]);

            return points.map(p => camera.getScreenPoint(p.x, p.y));
        }

        // tslint:disable-next-line:ban-types
        getComponent(ctr: Function): Component<any> {

            return this._componentMap.get(ctr);
        }

        // tslint:disable-next-line:ban-types
        hasComponent(ctr: Function) {

            return this._componentMap.has(ctr);
        }

        getComponents() {

            return this._componentMap.values();
        }

        // tslint:disable-next-line:ban-types
        static getObjectComponent(obj: any, ctr: Function) {

            if (this.hasEditorSupport(obj)) {

                const support = (obj as ISceneGameObject).getEditorSupport();

                return support.getComponent(ctr) ?? null;
            }

            return null;
        }

        static hasEditorSupport(obj: any) {

            return obj && obj instanceof Phaser.GameObjects.GameObject
                && typeof obj["getEditorSupport"] === "function";
        }

        static getEditorSupport(obj: any) {

            if (this.hasEditorSupport(obj)) {

                return (obj as ISceneGameObject).getEditorSupport();
            }

            return null;
        }

        // tslint:disable-next-line:ban-types
        static hasObjectComponent(obj: any, ctr: Function) {

            return this.getObjectComponent(obj, ctr) !== null;
        }

        addComponent(...components: Array<Component<any>>) {

            for (const c of components) {

                this._componentMap.set(c.constructor, c);
            }

            this._serializables.push(...components);
        }

        protected setNewId(sprite: sceneobjects.ISceneGameObject) {
            this.setId(Phaser.Utils.String.UUID());
        }

        getExtension() {
            return this._extension;
        }

        getId() {

            return this.getObject().name;
        }

        setId(id: string) {

            this.getObject().name = id;
        }

        getParentId(): string {

            if (this.getObject().parentContainer) {

                return (this.getObject().parentContainer as unknown as ISceneGameObject)
                    .getEditorSupport().getId();
            }

            return undefined;
        }

        isPrefabInstance() {
            return typeof this._prefabId === "string";
        }

        _setPrefabId(prefabId: string) {
            this._prefabId = prefabId;
        }

        getAllParents() {

            const list: Container[] = [];

            this.getAllParents2(list);

            return list;
        }

        isDescendentOf(container: Container) {

            const set = new Set(this.getAllParents());

            return set.has(container);
        }

        private getAllParents2(list: Container[]) {

            const obj = this.getObject();

            if (obj.parentContainer) {

                list.push(obj.parentContainer as Container);
            }

            return list;
        }

        isPrefabInstanceElement() {

            return this.isPrefabInstance() && this.getOwnerPrefabInstance() !== this.getObject();
        }

        getOwnerPrefabInstance(): ISceneGameObject {

            const obj = this.getObject();

            if (obj.parentContainer) {

                const parent = obj.parentContainer as unknown as ISceneGameObject;

                const owner = parent.getEditorSupport().getOwnerPrefabInstance();

                if (owner) {

                    return owner;
                }
            }

            if (obj.getEditorSupport().isPrefabInstance()) {

                return obj;
            }

            return null;
        }

        getPrefabId() {

            return this._prefabId;
        }

        getPrefabName() {

            const file = this.getPrefabFile();

            if (file) {

                return file.getNameWithoutExtension();

            }

            return null;
        }

        getPrefabFile() {

            if (this._prefabId) {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const file = finder.getPrefabFile(this._prefabId);

                return file;
            }

            return null;
        }

        getPrefabData() {

            if (this._prefabId) {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const data = finder.getPrefabData(this._prefabId);

                return data;
            }

            return null;
        }

        getPrefabSerializer() {

            const data = this.getPrefabData();

            if (data) {

                return this.getScene().getMaker().getSerializer(data);
            }

            return null;
        }

        getObjectType() {

            const ser = this.getScene().getMaker().getSerializer({
                id: this.getId(),
                type: this._extension.getTypeName(),
                prefabId: this._prefabId,
                label: "temporal"
            });

            return ser.getType();
        }

        getPhaserType() {

            const ser = this.getScene().getMaker().getSerializer({
                id: this.getId(),
                type: this._extension.getTypeName(),
                prefabId: this._prefabId,
                label: "temporal",
            });

            return ser.getPhaserType();
        }

        getSerializer(data: json.IObjectData) {

            return this.getScene().getMaker().getSerializer(data);
        }

        writeJSON(data: json.IObjectData) {

            if (this.isPrefabInstance()) {

                data.prefabId = this._prefabId;

            } else {

                data.type = this._extension.getTypeName();
            }

            data.id = this.getId();

            if (this._prefabId && this._unlockedProperties.size > 0) {

                data["unlock"] = [...this._unlockedProperties];
            }

            const ser = this.getSerializer(data);

            for (const s of this._serializables) {

                s.writeJSON(ser);
            }
        }

        readJSON(data: json.IObjectData) {

            const ser = this.getSerializer(data);

            this.setId(data.id);

            this._prefabId = data.prefabId;
            this._unlockedProperties = new Set(data["unlock"] ?? []);

            for (const s of this._serializables) {

                s.readJSON(ser);
            }
        }
    }
}