///<reference path="../../ui/SceneDataMigrationExtension.ts"/>
namespace phasereditor2d.scene.core.migrations {

    export class NestedPrefaScopeMigration extends ui.SceneDataMigrationExtension {

        migrate(data: json.ISceneData) {

            if (data.meta.version < 4) {

                this.migrateList(data.displayList);
            }
        }

        private migrateList(list?: json.IObjectData[]) {

            for (const obj of list) {

                if (obj.scope && obj.scope.toString() == "NESTED_PREFAB") {

                    console.log(`Migrate nested prefab scope to PUBLIC_NESTED_PREFAB [${obj.id}]`);

                    obj.scope = ui.sceneobjects.ObjectScope.PUBLIC_NESTED_PREFAB;
                }

                if (obj.list) {

                    this.migrateList(obj.list);
                }

                if (obj.nestedPrefabs) {

                    this.migrateList(obj.nestedPrefabs);
                }
            }
        }
    }
}