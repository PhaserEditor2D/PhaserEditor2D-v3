namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export abstract class EditorSupport<T> {

        private _object: T;
        private _label: string;
        private _displayName: string;
        private _useGameObjectName: boolean;
        private _scope: ObjectScope;
        private _scene: Scene;

        constructor(obj: T, label: string, scene: Scene) {

            this._object = obj;
            this._scene = scene;
            this._label = label;
            this._displayName = "";
            this._useGameObjectName = false;
            this._scope = ObjectScope.LOCAL;

            this.setId(Phaser.Utils.String.UUID());
        }

        static getEditorSupport(obj: any): EditorSupport<any> {

            if (obj["getEditorSupport"]) {

                const support = obj["getEditorSupport"]();

                if (support instanceof EditorSupport) {

                    return support;
                }
            }

            return null;
        }

        abstract destroy(): void;

        abstract buildDependencyHash(args: IBuildDependencyHashArgs): Promise<void>;

        abstract getCellRenderer(): controls.viewers.ICellRenderer;

        abstract getId(): string;

        abstract setId(id: string): void;

        abstract getPhaserType(): string;

        computeContentHash() {

            return "";
        }

        isLocalScope() {

            return isLocalScope(this._scope);
        }

        isMethodScope() {

            return isMethodScope(this._scope);
        }

        isClassScope() {

            return isClassScope(this._scope);
        }

        isPublicScope() {

            return isPublicScope(this._scope);
        }

        isNestedPrefabScope() {

            return isNestedPrefabScope(this._scope);
        }

        isClassOrPublicScope() {

            return isClassOrPublicScope(this._scope);
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

        getDisplayName() {

            return this._displayName;
        }

        setDisplayName(displayName: string) {
            
            this._displayName = displayName;
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