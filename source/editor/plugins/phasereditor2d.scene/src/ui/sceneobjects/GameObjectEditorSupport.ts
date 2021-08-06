namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;

    export function isNestedPrefabInstance(obj: any) {

        const support = GameObjectEditorSupport.getEditorSupport(obj);

        if (support) {

            return support.isNestedPrefabInstance();
        }

        return false;
    }

    export function isGameObject(obj: any) {

        return GameObjectEditorSupport.hasEditorSupport(obj);
    }

    export function getObjectChildren(obj: ISceneGameObject) {

        if (obj instanceof Layer || obj instanceof Container) {

            return obj.getChildren();
        }

        return [];
    }

    export function getObjectParent(obj: ISceneGameObject) {

        return GameObjectEditorSupport.getObjectParent(obj);
    }

    export function getObjectParentOrDisplayList(obj: ISceneGameObject) {

        return getObjectParent(obj) || obj.getEditorSupport().getScene().sys.displayList;
    }

    export abstract class GameObjectEditorSupport<T extends ISceneGameObject> extends EditorSupport<T> {

        private _extension: SceneGameObjectExtension;
        private _prefabId: string;
        private _serializables: json.ISerializable[];
        // tslint:disable-next-line:ban-types
        private _componentMap: Map<Function, Component<any>>;
        private _unlockedProperties: Set<string>;
        private _isNestedPrefabInstance: boolean;

        constructor(extension: SceneGameObjectExtension, obj: T, scene: Scene) {
            super(obj, extension.getTypeName().toLowerCase(), scene);

            this._extension = extension;
            this._unlockedProperties = new Set();
            this._serializables = [];
            this._componentMap = new Map();
            this._isNestedPrefabInstance = false;

            obj.setDataEnabled();

            this.setId(Phaser.Utils.String.UUID());

            this.addComponent(new VariableComponent(obj));
            this.addComponent(new PrefabUserPropertyComponent(obj));
            this.addComponent(new UserComponentsEditorComponent(obj));

            this.setInteractive();

            scene.sys.displayList.add(obj as Phaser.GameObjects.GameObject);
        }

        static getObjectParent(obj: ISceneGameObject): Container | Layer {

            if (obj.parentContainer) {

                return obj.parentContainer as Container;
            }

            if (obj.displayList instanceof Layer) {

                return obj.displayList;
            }

            return null;
        }

        static getObjectChildren(obj: ISceneGameObject): ISceneGameObject[] {

            if (obj instanceof Container
                || obj instanceof Layer
                || obj instanceof Phaser.GameObjects.DisplayList) {

                return obj.list as ISceneGameObject[];
            }

            return [];
        }

        abstract setInteractive(): void;

        protected computeContentHashWithProperties(obj: ISceneGameObject, ...properties: Array<IProperty<any>>) {

            return properties.map(prop => prop.name + "=" + prop.getValue(obj)).join(";");
        }

        protected computeContentHashWithComponent(obj: ISceneGameObject, ...compConstructors: any[]) {

            const props = compConstructors.flatMap(ctr => [...obj.getEditorSupport().getComponent(ctr).getProperties()])

            return this.computeContentHashWithProperties(obj, ...props);
        }

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

        isUnlockedPropertyXY(property: IPropertyXY) {

            return this.isUnlockedProperty(property.x) && this.isUnlockedProperty(property.y);
        }

        isUnlockedProperty(property: IProperty<any>) {

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

        _clearUnlockProperties() {

            this._unlockedProperties.clear();
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

            const { originX, originY } = this.getScreenBoundsOrigin();

            const x = -w * originX;
            const y = -h * originY;

            const tx = sprite.getWorldTransformMatrix();

            tx.transformPoint(x, y, points[0]);
            tx.transformPoint(x + w, y, points[1]);
            tx.transformPoint(x + w, y + h, points[2]);
            tx.transformPoint(x, y + h, points[3]);

            return points.map(p => camera.getScreenPoint(p.x, p.y));
        }

        protected getScreenBoundsOrigin(): { originX: number, originY: number } {

            const { originX, originY } = this.getObject() as any;

            return { originX, originY };
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

            try {

                // tslint:disable-next-line:ban-types
                const support = obj["getEditorSupport"] as Function;

                return support.apply(obj) instanceof GameObjectEditorSupport;

            } catch (e) {
                // nothing
            }

            return false;
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

            const parent = GameObjectEditorSupport.getObjectParent(this.getObject());

            if (parent) {

                return parent.getEditorSupport().getId();
            }

            return undefined;
        }

        /**
         * Checks if it is a nested prefab instance that can be modified (published to the scene,
         * accessible from the prefab instance's root).
         *
         * @returns If active.
         */
        isActiveNestedPrefab() {

            if (this.isNestedPrefabInstance()) {

                const parent = getObjectParent(this.getObject()) as ISceneGameObject;
                const parentSupport = parent.getEditorSupport();

                return parentSupport.isNestedPrefabInstance()
                    || parentSupport.isPrefabInstanceRoot();
            }

            return false;
        }
        /**
         * Checks if the object is a prefab instance and the parent isn't a prefab instance.
         *
         * @returns If it is the root.
         */
        isPrefabInstanceRoot() {

            if (this.isPrefabInstance() && !this.isNestedPrefabInstance()) {

                const parent = getObjectParent(this.getObject());

                if (!parent || !parent.getEditorSupport().isPrefabInstance()) {

                    return true;
                }
            }

            return false;
        }

        isNestedPrefabInstance() {

            return this._isNestedPrefabInstance;
        }

        setIsNestedPrefabInstance(isNestedPrefabImage: boolean) {

            this._isNestedPrefabInstance = isNestedPrefabImage;
        }

        isPrefabInstance() {
            return typeof this._prefabId === "string";
        }

        getAllParents() {

            const list: Array<Container | Layer> = [];

            this.getAllParents2(this.getObject(), list);

            return list;
        }

        getSizeProperties() {

            if (this.hasComponent(SizeComponent)) {

                return [SizeComponent.width, SizeComponent.height];
            }

            return [];
        }

        getSizeSectionId() {

            return SizeSection.SECTION_ID;
        }

        isDescendentOf(parent: Container | Layer) {

            const set = new Set(this.getAllParents());

            return set.has(parent);
        }

        private getAllParents2(obj: ISceneGameObject, list: Array<Container | Layer>) {

            const objParent = GameObjectEditorSupport.getObjectParent(obj);

            if (objParent) {

                list.push(objParent);

                this.getAllParents2(objParent, list);
            }

            return list;
        }

        isScenePrefabObject() {

            return this.getScene().isPrefabSceneType() && this.getScene().getPrefabObject() === this.getObject();
        }

        isPrefabInstanceElement() {

            return this.isPrefabInstance() && this.getOwnerPrefabInstance() !== this.getObject();
        }

        getNestedPrefabs(): ISceneGameObject[] {

            if (!this.isPrefabInstance()) {

                return [];
            }

            const obj = this.getObject();

            if (obj instanceof Layer || obj instanceof Container) {

                const result: ISceneGameObject[] = [];

                for (const child of obj.getChildren()) {

                    if (child.getEditorSupport().isNestedPrefabInstance()) {

                        result.push(child);
                    }
                }

                return result;
            }

            return [];
        }

        getOwnerPrefabInstance(): ISceneGameObject {

            const parents = this.getAllParents().reverse();

            for (const parent of parents) {

                if (parent.getEditorSupport().isPrefabInstance()) {

                    return parent;
                }
            }

            if (this.isPrefabInstance()) {

                return this.getObject();
            }

            return null;
        }

        getPrefabId() {

            return this._prefabId;
        }

        setPrefabId(id: string) {

            this._prefabId = id;
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

        getPrefabSettings() {

            if (this._prefabId) {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const file = finder.getPrefabFile(this._prefabId);

                if (file) {

                    return finder.getSceneSettings(file);
                }
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

        static readNestedPrefabData(objData: json.IObjectData, map?: Map<string, json.IObjectData>, foreignPrefab = false) {

            map = map ?? new Map();

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const list = objData.nestedPrefabs || [];

            for (const data of list) {

                const id = finder.getOriginalPrefabId(data.prefabId);

                if (id && !map.has(id)) {

                    if (foreignPrefab) {

                        const copy = colibri.core.json.copy(data);
                        copy.prefabId = data.id;
                        copy.id = Phaser.Utils.String.UUID();

                        map.set(id, copy);

                    } else {

                        map.set(id, data);
                    }
                }
            }

            if (objData.prefabId) {

                const prefabData = finder.getPrefabData(objData.prefabId);

                this.readNestedPrefabData(prefabData, map, true);
            }

            return map;
        }
    }
}