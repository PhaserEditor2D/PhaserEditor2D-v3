/// <reference path="./EditorSupport.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;

    export abstract class GameObjectEditorSupport<T extends ISceneGameObject> extends EditorSupport<T> {

        private _extension: SceneGameObjectExtension;
        private _prefabId: string;
        private _serializables: json.ISerializable[];
        // tslint:disable-next-line:ban-types
        private _componentMap: Map<Function, Component<any>>;
        private _unlockedProperties: Set<string>;
        private _isNestedPrefabInstance: boolean;

        // parent
        private _allowPickChildren: boolean;
        private _showChildrenInOutline: boolean;
        private _countPrefabChildren: number;
        private _allowAppendChildren: boolean;

        private _objectChildren: ISceneGameObject[];

        constructor(extension: SceneGameObjectExtension, obj: T, scene: Scene) {
            super(obj, extension.getTypeName().toLowerCase(), scene);

            this._extension = extension;
            this._unlockedProperties = new Set();
            this._serializables = [];
            this._componentMap = new Map();
            this._isNestedPrefabInstance = false;

            this._allowPickChildren = true;
            this._showChildrenInOutline = true;
            this._countPrefabChildren = 0;
            this._allowAppendChildren = false;

            this._objectChildren = [];

            obj.setDataEnabled();

            this.setId(Phaser.Utils.String.UUID());

            this.addComponent(new VariableComponent(obj));
            this.addComponent(new PrefabUserPropertyComponent(obj));
            this.addComponent(new UserComponentsEditorComponent(obj));

            this.setInteractive();

            scene.addGameObject(obj);
        }

        static isDisplayObjectType(type: string) {

            return type !== ScriptNodeExtension.getInstance().getTypeName();
        }

        isDisplayObject() {

            return true;
        }

        addObjectChild(child: ISceneGameObject): void {

            const obj = this.getObject();

            if (obj instanceof Layer || obj instanceof Container) {

                obj.add(child);

            } else {

                this._objectChildren.push(child);
            }

            if (child instanceof ScriptNode) {

                child.removeFromParent();

                child.setParent(obj);
            }
        }

        removeObjectChild(child: ISceneGameObject): void {

            const obj = this.getObject();

            if (obj instanceof Layer || obj instanceof Container) {

                obj.remove(child);

            } else {

                const i = this._objectChildren.indexOf(child);

                if (i >= 0) {

                    this._objectChildren.splice(i, 1);
                }

                if (child instanceof ScriptNode) {

                    child.setParent(undefined);
                }
            }
        }

        removeAllObjectChildren() {

            const obj = this.getObject();

            if (obj instanceof Layer || obj instanceof Container) {

                return obj.removeAll(true);

            } else {

                this._objectChildren = [];
            }
        }

        getDisplayObjectChildren() {

            return this.getObjectChildren()
                .filter(obj => obj.getEditorSupport().isDisplayObject());
        }

        getEditableObjectChildren() {

            if (this.isPrefabInstance()) {

                return this.getAppendedChildren();
            }

            return this.getObjectChildren();
        }

        getObjectChildren(): ISceneGameObject[] {

            const obj = this.getObject();

            if (obj instanceof Layer) {

                return obj.getChildren() as T[];
            }

            if (obj instanceof Container) {

                return obj.list as ISceneGameObject[];
            }

            return this._objectChildren;
        }

        getObjectParentOrDisplayList() {

            const parent = this.getObjectParent();

            if (parent instanceof Layer || parent instanceof Container) {

                return parent;
            }

            return this.getScene().children;
        }

        getObjectParent(): ISceneGameObject | undefined {

            const obj = this.getObject();

            if (obj.parentContainer) {

                return obj.parentContainer as Container;
            }

            if (obj.displayList instanceof Layer) {

                return obj.displayList;
            }

            return undefined;
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

            for (const obj of this.getObjectChildren()) {

                obj.getEditorSupport().destroy();
            }

            if (this.isDisplayObject()) {

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

            } else {

                const obj = this.getObject();

                const parent = this.getObjectParent();

                if (parent) {

                    parent.getEditorSupport().removeObjectChild(obj);

                } else {

                    this.getScene().removeGameObject(obj);
                }
            }

            return false;
        }

        hasProperty(property: IProperty<any>) {

            for (const comp of this.getActiveComponents()) {

                if (comp.getProperties().has(property)) {

                    return true;
                }
            }

            return false;
        }

        hasUnlockedProperties() {

            return this._unlockedProperties.size > 0;
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

                    if (this.isLocalUserProperty(property)) {

                        return true;
                    }
                }

                return this._unlockedProperties.has(property.name);
            }

            return true;
        }

        isLocalUserProperty(property: UserComponentPropertyWrapper) {

            const userComp = property.getUserComponent();

            const editorUserComp = this.getUserComponentsComponent();

            if (editorUserComp.hasLocalUserComponent(userComp.getName())) {

                return true;
            }

            return false;
        }

        setUnlockedProperty(property: IProperty<any>, unlock: boolean) {

            if (unlock) {

                this._unlockedProperties.add(property.name);

            } else {

                this._unlockedProperties.delete(property.name);
            }
        }

        setUnlockedPropertyXY(property: IPropertyXY, unlock: boolean) {

            this.setUnlockedProperty(property.x, unlock);
            this.setUnlockedProperty(property.y, unlock);
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

            for (const comp of this.getActiveComponents()) {

                comp.buildDependenciesHash(args);
            }

            if (!this.isPrefabInstance()) {

                for (const obj of this.getObjectChildren()) {

                    obj.getEditorSupport().buildDependencyHash(args);
                }
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

            const { originX, originY } = this.computeOrigin();

            const x = -w * originX;
            const y = -h * originY;

            const tx = sprite.getWorldTransformMatrix();

            tx.transformPoint(x, y, points[0]);
            tx.transformPoint(x + w, y, points[1]);
            tx.transformPoint(x + w, y + h, points[2]);
            tx.transformPoint(x, y + h, points[3]);

            return points.map(p => camera.getScreenPoint(p.x, p.y));
        }

        getOriginSectionId() {

            return OriginSection.SECTION_ID;
        }

        getOriginProperties() {

            if (this.hasComponent(OriginComponent)) {

                return [OriginComponent.originX, OriginComponent.originY];
            }

            return [];
        }

        supportsOrigin() {

            return this.getOriginProperties().length > 0;
        }

        computeOrigin(): { originX: number, originY: number } {

            const { originX, originY } = this.getObject() as any;

            return { originX, originY };
        }

        computeDisplayOrigin() {

            const { width, height } = this.computeSize();
            const { originX, originY } = this.computeOrigin();

            return {
                displayOriginX: width * originX,
                displayOriginY: height * originY
            };
        }

        computeSize() {

            const obj = this.getObject() as any;

            return { width: obj.width, height: obj.height };
        }

        setComponentActive(ctr: Function, active: boolean) {

            const comp = this._componentMap.get(ctr);

            comp.setActive(active);
        }

        // tslint:disable-next-line:ban-types
        getComponent(ctr: Function): Component<any> {

            const comp = this._componentMap.get(ctr);

            if (comp && comp.isActive()) {

                return comp;
            }

            return undefined;
        }

        // tslint:disable-next-line:ban-types
        hasComponent(ctr: Function) {

            const comp = this._componentMap.get(ctr);

            if (comp) {

                return comp.isActive();
            }

            return false;
        }

        getComponents() {

            return this._componentMap.values();
        }

        getActiveComponents() {

            return [...this._componentMap.values()].filter(comp => comp.isActive());
        }

        getUserComponentsComponent() {

            return this.getComponent(UserComponentsEditorComponent) as UserComponentsEditorComponent;
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

            const parent = this.getObjectParent();

            if (parent) {

                return parent.getEditorSupport().getId();
            }

            return undefined;
        }

        /**
         * Checks if it is a nested prefab instance that can be modified.
         * It means, if there is a path from a root prefab 
         * walking thought nested prefabs until reach this object.
         *
         * @returns If it is reachable.
         */
        isMutableNestedPrefabInstance() {

            if (this.isNestedPrefabInstance()) {

                const parentSupport = this.getObjectParent().getEditorSupport();

                return parentSupport.isMutableNestedPrefabInstance()
                    || parentSupport.isPrefabInstanceRoot();
            }

            return false;
        }

        /**
         * If it is a prefab instance that was first defined as root prefab.
         * It maybe pointing to a nested prefab, but it then will point to a root prefab.
         * 
         * @returns If it is.
         */
        isRootPrefabDefined() {

            return this.isPrefabInstance() && !this.isNestedPrefabDefined();
        }

        /**
         * If it's first definition as prefab is a nested prefab.
         * It means, in any case, it isn't an instance of a root prefab.
         * 
         * @returns Is it defined as nested prefab?
         */
        private isNestedPrefabDefined() {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            if (this.isPrefabInstance()) {

                const id = finder.getOriginalPrefabId(this.getPrefabId());

                return finder.isNestedPrefab(id);
            }

            return false;
        }

        /**
         * Checks if the object is a prefab instance and the parent isn't a prefab instance.
         * It is a prefab instance added to the scene, it is not part of a bigger prefab.
         * It is the bigger prefab.
         * But ok, it is possible it is also a child appended to a prefab instance.
         * 
         * @returns If it is the root.
         */
        isPrefabInstanceRoot() {

            if (this.isPrefabInstance() && !this.isNestedPrefabInstance()) {

                const parent = this.getObjectParent();

                if (!parent || !parent.getEditorSupport().isPrefabInstance()) {

                    return true;
                }
            }

            return false;
        }

        isNestedPrefabInstance() {

            return this._isNestedPrefabInstance;
        }

        _setNestedPrefabInstance(isNestedPrefabInstace: boolean) {

            this._isNestedPrefabInstance = isNestedPrefabInstace;
        }

        isPrefabInstance() {

            return this._prefabId !== undefined && this._prefabId !== null;
        }

        isPrefeabInstanceAppendedChild() {

            const parent = this.getObjectParent();

            if (parent && parent.getEditorSupport().isPrefabInstance()) {

                const parentES = (parent.getEditorSupport() as DisplayParentGameObjectEditorSupport<any>);

                const countPrefabChildren = parentES.getCountPrefabChildren();

                const index = parentES.getObjectChildren().indexOf(this.getObject());

                return index >= countPrefabChildren;
            }

            return false;
        }

        /**
         * Checks if the object is a child or nested child of prefab instance.
         *
         * @returns If it is element.
         */
        isPrefabInstanceElement() {

            const owner = this.getOwnerPrefabInstance();

            if (owner) {

                return owner !== this.getObject();
            }

            return false;
        }

        getAllParents() {

            const list: Array<Container | Layer> = [];

            this.getAllParents2(this.getObject(), list);

            return list;
        }

        /**
        * If this object type has a custom method for setting the size of the object.
        * 
        * @returns Generate a custom code for setting the size properties.
        */
        isCustom_SizeComponent_buildSetObjectPropertiesCodeDOM() {

            return false;
        }

        /**
         * Get the size properties for this object type. By default it uses the properties from the SizeComponent.
         * 
         * @returns The size properties.
         */
        getSizeProperties() {

            if (this.hasComponent(SizeComponent)) {

                return [SizeComponent.width, SizeComponent.height];
            }

            return [];
        }

        /**
         * The section ID for the size properties of this object type. By default it retures the SizeSection ID.
         * 
         * @returns The size section id.
         */
        getSizeSectionId() {

            return SizeSection.SECTION_ID;
        }

        /**
         * If this object type requires to update the display origin after changing the size.
         * 
         * @returns Generate updateDisplayOrigin()?
         */
        getSizeComponentGeneratesUpdateDisplayOrigin() {

            return true;
        }

        /**
         * This callback method is executed when the texture of this object is changed by TextureComponent.
         */
        onUpdateAfterSetTexture() {
            // nothing by default
        }

        isDescendentOf(parent: Container | Layer) {

            const set = new Set(this.getAllParents());

            return set.has(parent);
        }

        private getAllParents2(obj: ISceneGameObject, list: Array<Container | Layer>) {

            const objParent = obj.getEditorSupport().getObjectParent();

            if (objParent && (objParent instanceof Layer || objParent instanceof Container)) {

                list.push(objParent);

                this.getAllParents2(objParent, list);
            }

            return list;
        }

        isScenePrefabObject() {

            return this.getScene().isPrefabSceneType() && this.getScene().getPrefabObject() === this.getObject();
        }

        getMutableNestedPrefabChildren(): ISceneGameObject[] {

            if (this.isPrefabInstance()) {

                const children = this.getObjectChildren();

                return children
                    .filter(obj => obj.getEditorSupport().isMutableNestedPrefabInstance());
            }

            return [];
        }

        getOwnerPrefabInstance(): ISceneGameObject {

            const parents = this.getAllParents();

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

        getPrefabOrNestedPrefabFile() {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            if (this.isNestedPrefabInstance()) {

                const originalId = finder.getOriginalPrefabId(this._prefabId);

                if (finder.isNestedPrefab(originalId)) {

                    return null;

                } else {

                    return finder.getPrefabFile(originalId);
                }
            }

            return this.getPrefabFile();
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

            this.writeJSON_children(this.getObject(), data);
        }

        readJSON(data: json.IObjectData) {

            const ser = this.getSerializer(data);

            this.setId(data.id);

            this._prefabId = data.prefabId;
            this._unlockedProperties = new Set(data["unlock"] ?? []);

            for (const s of this._serializables) {

                s.readJSON(ser);
            }

            this.readJSON_children(this.getObject(), data);
        }

        // parent methods

        getCountPrefabChildren() {

            return this._countPrefabChildren;
        }

        isAllowAppendChildren() {

            return this._allowAppendChildren;
        }

        setAllowAppendChildren(allowAppendChild: boolean) {

            this._allowAppendChildren = allowAppendChild;
        }

        isAllowPickChildren() {

            return this._allowPickChildren;
        }

        setAllowPickChildren(childrenPickable: boolean) {

            this._allowPickChildren = childrenPickable;
        }

        isShowChildrenInOutline() {

            return this._showChildrenInOutline;
        }

        setShowChildrenInOutline(showChildrenInOutline: boolean) {

            this._showChildrenInOutline = showChildrenInOutline;
        }

        getAppendedChildren() {

            const children = this.getObjectChildren();

            const appended = children.slice(this._countPrefabChildren);

            return appended;
        }

        private writeJSON_children(container: ISceneGameObject, containerData: json.IObjectData) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const containerES = container.getEditorSupport();

            if (containerES.isPrefabInstance()) {

                // write nested prefabs

                containerData.nestedPrefabs = containerES.getObjectChildren()

                    .filter(obj => obj.getEditorSupport().isMutableNestedPrefabInstance())

                    .filter(obj => finder.existsPrefab(obj.getEditorSupport().getPrefabId()))

                    .map(obj => {

                        const objData = {} as json.IObjectData;

                        obj.getEditorSupport().writeJSON(objData);

                        return objData as json.IObjectData;
                    })

                    .filter(data =>
                        (data.nestedPrefabs ?? []).length > 0
                        || (data.unlock ?? []).length > 0
                        || (data.components ?? []).length > 0
                        || (data.list ?? []).length > 0);

                // write appended objects

                containerData.list = containerES.getAppendedChildren().map(obj => {

                    const objData = {} as json.IObjectData;

                    obj.getEditorSupport().writeJSON(objData);

                    return objData as json.IObjectData;
                });

            } else {

                containerData.list = containerES.getObjectChildren().map(obj => {

                    const objData = {} as json.IObjectData;

                    obj.getEditorSupport().writeJSON(objData);

                    return objData as json.IObjectData;
                });
            }
        }

        private static readPrefabChildren(serializer: core.json.Serializer, list: json.IObjectData[]) {

            if (serializer.isPrefabInstance()) {

                this.readPrefabChildren(serializer.getPrefabSerializer(), list);
            }

            const localList = serializer.getData()["list"] || [];

            list.push(...localList);
        }

        static buildRawChildrenData(containerData: json.IObjectData) {

            const serializer = new json.Serializer(containerData);

            const isPrefabContainer = serializer.isPrefabInstance();

            /**
             * The orginal children of the container's prefab.
             * It means, it doesn't include the appended children.
             */
            let prefabChildren: json.IObjectData[] = [];

            /**
             * All the final children to be added to the container.
             */
            let children: json.IObjectData[];

            /**
             * Just the children added explicity to this container (without looking to the prefab).
             */
            const localChildren = containerData.list || [];

            if (isPrefabContainer) {

                prefabChildren = [];

                this.readPrefabChildren(serializer.getPrefabSerializer(), prefabChildren);

                const updatedPrefabChildren = DisplayParentGameObjectEditorSupport
                    .buildUpdatedPrefabChildrenDataWithNestedPrefab(containerData, prefabChildren);

                children = [...updatedPrefabChildren, ...localChildren];

            } else {

                // it is not a prefab, just get the local children
                children = localChildren;
            }

            return { prefabChildren, children };
        }

        private readJSON_children(parent: ISceneGameObject, containerData: json.IObjectData) {

            const parentES = parent.getEditorSupport();

            const { children, prefabChildren } = DisplayParentGameObjectEditorSupport
                .buildRawChildrenData(containerData);

            parentES._countPrefabChildren = prefabChildren.length;

            const maker = parentES.getScene().getMaker();

            parent.getEditorSupport().removeAllObjectChildren();

            let i = 0;

            for (const childData of children) {

                let initObjData: any = {
                    id: childData.id,
                    prefabId: childData.prefabId,
                    type: childData.type,
                    label: childData.label,
                };

                // This is a very very ugly solution for this issue:
                // https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/229
                // but making a bigger change in serialization at this moment could introduce a lot of bugs
                // and the TilemapLayer is a unique case in Phaser & the editor.
                // For example, you cannot create a prefab instance of a TilemapLayer
                if (childData.type === "TilemapLayer") {

                    initObjData = childData;
                }

                // creates an empty object
                const sprite = maker.createObject(initObjData);

                if (sprite) {

                    parent.getEditorSupport().addObjectChild(sprite);

                    // if it is not an appended child
                    if (i < prefabChildren.length) {

                        const prefabData = prefabChildren[i];

                        if (prefabData.scope === sceneobjects.ObjectScope.NESTED_PREFAB) {

                            sprite.getEditorSupport()._setNestedPrefabInstance(true);
                        }
                    }

                    // updates the object with the final data
                    sprite.getEditorSupport().readJSON(childData);
                }

                i++;
            }
        }

        /**
         * Build the children data but modified by the nested prefab info.
         * 
         * @param objData The container data
         * @param originalPrefabChildren The container's prefab children
         * @returns The children but modified by the nested prefabs
         */
        private static buildUpdatedPrefabChildrenDataWithNestedPrefab(objData: core.json.IObjectData, originalPrefabChildren: core.json.IObjectData[]) {

            const result: json.IObjectData[] = [];

            const localNestedPrefabs = objData.nestedPrefabs ?? [];

            for (const originalChild of originalPrefabChildren) {

                if (originalChild.scope !== sceneobjects.ObjectScope.NESTED_PREFAB) {

                    result.push(originalChild);

                } else {

                    // find a local nested prefab

                    let localNestedPrefab: json.IObjectData;

                    for (const local of localNestedPrefabs) {

                        const localOriginalIdOfNestedPrefab = this.findOriginalIdOfNestedPrefab(local);

                        if (localOriginalIdOfNestedPrefab === originalChild.id) {

                            const remoteNestedPrefab = this.findRemoteNestedPrefab(objData.prefabId, originalChild.id);

                            if (remoteNestedPrefab) {

                                localNestedPrefab = colibri.core.json.copy(local) as json.IObjectData;
                                localNestedPrefab.prefabId = remoteNestedPrefab.id;

                            } else {

                                localNestedPrefab = local;
                            }

                            break;
                        }
                    }

                    if (localNestedPrefab) {

                        result.push(localNestedPrefab);

                    } else {

                        // we don't have a local prefab, find one remote and create a pointer to it

                        const remoteNestedPrefab = this.findRemoteNestedPrefab(objData.prefabId, originalChild.id);

                        if (remoteNestedPrefab) {

                            // we found a remote nested prefab, create a link to it

                            const nestedPrefab: core.json.IObjectData = {
                                id: Phaser.Utils.String.UUID(),
                                prefabId: remoteNestedPrefab.id,
                                label: remoteNestedPrefab.label,
                            };

                            result.push(nestedPrefab);

                        } else {

                            // ok, just create a link with the original child

                            const nestedPrefab: core.json.IObjectData = {
                                id: Phaser.Utils.String.UUID(),
                                prefabId: originalChild.id,
                                label: originalChild.label,
                            };

                            result.push(nestedPrefab);
                        }
                    }
                }
            }

            return result;
        }

        private static findRemoteNestedPrefab(parentPrefabId: string, originalNestedPrefabId: string): json.IObjectData {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const prefabData = finder.getPrefabData(parentPrefabId);

            if (!prefabData) {

                return null;
            }

            const nestedPrefab = (prefabData.nestedPrefabs ?? []).find(obj => {

                // const thisOriginalId = finder.getOriginalPrefabId(obj.prefabId);
                const thisOriginalId = this.findOriginalIdOfNestedPrefab(obj);

                return thisOriginalId === originalNestedPrefabId
            });

            if (nestedPrefab) {

                return nestedPrefab;
            }

            if (prefabData.prefabId) {

                return this.findRemoteNestedPrefab(prefabData.prefabId, originalNestedPrefabId);
            }

            return null;
        }

        private static findOriginalIdOfNestedPrefab(obj: json.IObjectData) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            if (obj.prefabId && finder.isNestedPrefab(obj.prefabId)) {

                const prefabData = finder.getPrefabData(obj.prefabId);

                return this.findOriginalIdOfNestedPrefab(prefabData);
            }

            return obj.id;
        }
    }
}