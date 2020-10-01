namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class SceneObjectExtension extends colibri.Extension {

        private _typeName: string;
        private _phaserTypeName: string;
        private _iconName: string;

        constructor(config: {
            id: string,
            typeName: string,
            phaserTypeName: string,
            iconName: string,
        }) {
            super(config.id);

            this._typeName = config.typeName;
            this._phaserTypeName = config.phaserTypeName;
            this._iconName = config.iconName;
        }

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