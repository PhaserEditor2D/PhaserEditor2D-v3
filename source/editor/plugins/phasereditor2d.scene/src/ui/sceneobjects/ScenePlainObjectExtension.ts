namespace phasereditor2d.scene.ui.sceneobjects {

    export class ScenePlainObjectExtension extends SceneObjectExtension {

        static POINT_ID = "phasereditor2d.scene.ui.sceneobjects.ScenePlainObjectExtension";

        private _category: string;

        constructor(config: {
            category: string,
            typeName: string,
            phaserTypeName: string,
            iconName: string,
        }) {
            super({
                extensionPoint: ScenePlainObjectExtension.POINT_ID,
                ...config
            });

            this._category = config.category;
        }

        getCategory() {

            return this._category;
        }
    }
}