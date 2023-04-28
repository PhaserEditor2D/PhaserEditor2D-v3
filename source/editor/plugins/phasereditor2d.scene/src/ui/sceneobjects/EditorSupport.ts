namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export enum ObjectScope {

        METHOD = "METHOD",
        CLASS = "CLASS",
        PUBLIC = "PUBLIC",
        LOCAL_NESTED_PREFAB = "LOCAL_NESTED_PREFAB",
        NESTED_PREFAB = "NESTED_PREFAB",
    }

    export abstract class EditorSupport<T> {

        private _object: T;
        private _label: string;
        private _useGameObjectName: boolean;
        private _scope: ObjectScope;
        private _scene: Scene;

        constructor(obj: T, label: string, scene: Scene) {

            this._object = obj;
            this._scene = scene;
            this._label = label;
            this._useGameObjectName = false;
            this._scope = ObjectScope.METHOD;

            this.setId(Phaser.Utils.String.UUID());
        }

        static getEditorSupport(obj: any): EditorSupport<any> {

            if (obj["getEditorSupport"]) {

                const support = obj["getEditorSupport"]();

                if (support instanceof EditorSupport)

                    return support;
            }

            return null;
        }

        abstract destroy();

        abstract buildDependencyHash(args: IBuildDependencyHashArgs): Promise<void>;

        abstract getCellRenderer(): controls.viewers.ICellRenderer;

        abstract getId(): string;

        abstract setId(id: string): void;

        abstract getPhaserType(): string;

        computeContentHash() {

            return "";
        }

        isMethodScope() {

            return this._scope === ObjectScope.METHOD;
        }

        getObject() {

            return this._object;
        }

        getLabel() {

            return this._label;
        }

        setLabel(label: string) {

            this._label = label;
        }

        isUseGameObjectName() {

            return this._useGameObjectName;
        }

        setUseGameObjectName(useGameObjectName: boolean) {

            this._useGameObjectName = useGameObjectName;
        }

        getScope() {

            return this._scope;
        }

        isNestedPrefabScope() {

            return this._scope === ObjectScope.NESTED_PREFAB
                || this._scope === ObjectScope.LOCAL_NESTED_PREFAB;
        }

        isPublic() {

            return this._scope === ObjectScope.PUBLIC
                || this._scope === ObjectScope.NESTED_PREFAB;
        }

        setScope(scope: ObjectScope) {

            this._scope = scope;
        }

        getScene() {

            return this._scene;
        }

        setScene(scene: Scene) {

            this._scene = scene;
        }

        getPropertyDefaultValue(prop: IProperty<T>) {

            return prop.defValue;
        }

        isUnlockedProperty(prop: IProperty<T>) {

            return true;
        }
    }
}