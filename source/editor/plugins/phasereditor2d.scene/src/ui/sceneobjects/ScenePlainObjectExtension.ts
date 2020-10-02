namespace phasereditor2d.scene.ui.sceneobjects {

    export class ScenePlainObjectExtension extends SceneObjectExtension {

        private _category: string;

        constructor(config: {
            id: string,
            category: string,
            typeName: string,
            phaserTypeName: string,
            iconName: string,
        }) {
            super(config);

            this._category = config.category;
        }

        getCategory() {

            return this._category;
        }
    }
}