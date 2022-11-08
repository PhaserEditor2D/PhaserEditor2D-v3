namespace phasereditor2d.scene.ui {

    export abstract class SceneDataMigrationExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.scene.ui.SceneDataMigrationExtension";

        constructor(priority?: number) {
            super(SceneDataMigrationExtension.POINT_ID, priority);
        }

        abstract migrate(data: core.json.ISceneData): void;
    }
}