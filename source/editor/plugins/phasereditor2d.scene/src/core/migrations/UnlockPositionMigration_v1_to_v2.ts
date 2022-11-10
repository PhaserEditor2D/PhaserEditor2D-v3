///<reference path="../../ui/SceneDataMigrationExtension.ts"/>
namespace phasereditor2d.scene.core.migrations {

    export class UnlockPositionMigration_v1_to_v2 extends ui.SceneDataMigrationExtension {

        migrate(data: json.ISceneData) {

            const version = data.meta.version ?? 1;

            if (version === 1) {

                console.log("Migrating: unlock position by default");

                this.migrateList(data.displayList);
            }
        }

        private migrateList(list?: json.IObjectData[]) {

            for (const obj of list) {

                if (obj.prefabId) {

                    obj.unlock = obj.unlock ?? [];
                    obj.unlock.push("x", "y");
                }

                if (obj.list) {

                    this.migrateList(obj.list);
                }
            }
        }
    }
}