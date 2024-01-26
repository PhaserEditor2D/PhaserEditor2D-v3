namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export interface ICreateExtraDataResult {

        dataNotFoundMessage?: string;
        abort?: boolean;
        data?: any;
    }

    export interface ICreateDefaultArgs {

        x: number;
        y: number;
        scene: Scene;
        parent?: ISceneGameObject;
        extraData?: any;
    }

    export abstract class SceneObjectExtension extends colibri.Extension {

        private _typeName: string;
        private _typeNameAlias: string[];
        private _phaserTypeName: string;
        private _phaserTypeThirdPartyLib: string;
        private _phaserTypeThirdPartyLibModule: string;
        private _iconDescriptor: controls.IconDescriptor;
        private _category: string;

        constructor(config: {
            extensionPoint: string,
            typeName: string,
            typeNameAlias?: string[],
            phaserTypeName: string,
            phaserTypeThirdPartyLib?: string;
            phaserTypeThirdPartyLibModule?: string;
            category: string,
            icon: colibri.ui.controls.IconDescriptor,
        }) {
            super(config.extensionPoint);

            this._typeName = config.typeName;
            this._typeNameAlias = config.typeNameAlias || [];
            this._phaserTypeName = config.phaserTypeName;
            this._phaserTypeThirdPartyLib = config.phaserTypeThirdPartyLib;
            this._phaserTypeThirdPartyLibModule = config.phaserTypeThirdPartyLibModule;
            this._category = config.category;
            this._iconDescriptor = config.icon;
        }

        /**
         * Some types like TilemapLayer are too complex to be included in a prefab instance.
         * For now, those types should be excluded from a prefab scene.
         */
        isAvailableAsPrefabElement(): boolean {

            return true;
        }

        /**
         * Collect the data used to create a new, empty object. For example, a BitmapText requires
         * a BitmapFont key to be created, so this method opens a dialog to select the font.
         */
        async collectExtraDataForCreateDefaultObject(editor: ui.editor.SceneEditor, inReplaceTypeContext = false): Promise<ICreateExtraDataResult> {

            return {};
        }

        /**
         * Create an empty object of this extension.
         *
         * @param args The data needed to create the object.
         */
        abstract createDefaultSceneObject(args: ICreateDefaultArgs): ISceneObject[];

        getIcon() {

            return this._iconDescriptor.getIcon();
        }

        getBlockCellRenderer(): controls.viewers.ICellRenderer {

            return new controls.viewers.IconImageCellRenderer(this.getIcon());
        }

        getCategory() {

            return this._category;
        }

        getTypeName() {

            return this._typeName;
        }

        getTypeNameAlias() {

            return this._typeNameAlias;
        }

        getPhaserTypeName() {

            return this._phaserTypeName;
        }

        getPhaserTypeThirdPartyLib() {

            return this._phaserTypeThirdPartyLib;
        }

        getPhaserTypeThirdPartyLibModule() {

            return this._phaserTypeThirdPartyLibModule;
        }

        isThirdPartyLib() {

            return Boolean(this._phaserTypeThirdPartyLib);
        }

        getHelp() {

            let helpKey: string;

            if (this.isThirdPartyLib()) {

                helpKey = this.getPhaserTypeThirdPartyLib() + "." + this.getPhaserTypeName();

            } else {

                helpKey = this.getPhaserTypeName();
            }

            return ScenePlugin.getInstance().getPhaserDocs().getDoc(helpKey);
        }
    }
}