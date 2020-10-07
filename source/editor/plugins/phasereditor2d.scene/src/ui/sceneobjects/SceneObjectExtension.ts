namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ICreateExtraDataResult {

        dataNotFoundMessage?: string;
        abort?: boolean;
        data?: any;
    }

    export interface ICreateDefaultArgs {

        x: number;
        y: number;
        scene: Scene;
        extraData?: any;
    }

    export abstract class SceneObjectExtension extends colibri.Extension {

        private _typeName: string;
        private _phaserTypeName: string;
        private _iconName: string;

        constructor(config: {
            extensionPoint: string,
            typeName: string,
            phaserTypeName: string,
            iconName: string,
        }) {
            super(config.extensionPoint);

            this._typeName = config.typeName;
            this._phaserTypeName = config.phaserTypeName;
            this._iconName = config.iconName;
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
        async collectExtraDataForCreateDefaultObject(editor: ui.editor.SceneEditor): Promise<ICreateExtraDataResult> {

            return {};
        }

        /**
         * Create an empty object of this extension.
         *
         * @param args The data needed to create the object.
         */
        abstract createDefaultSceneObject(args: ICreateDefaultArgs): ISceneObject;

        getIcon() {

            return ScenePlugin.getInstance().getIcon(this._iconName);
        }

        getTypeName() {
            return this._typeName;
        }

        getPhaserTypeName() {
            return this._phaserTypeName;
        }

        getHelp() {

            return ScenePlugin.getInstance().getPhaserDocs().getDoc(this.getPhaserTypeName());
        }
    }
}