///<reference path="../../ui/SceneDataMigrationExtension.ts"/>
namespace phasereditor2d.scene.core.migrations {

    export class TextAlignMigration extends ui.SceneDataMigrationExtension {

        migrate(data: json.ISceneData) {

            console.log("Migrating: Text align");

            this.migrateList(data.displayList);
        }

        private migrateList(list?: json.IObjectData[]) {

            for (const obj of list) {

                if (obj.type === "Text") {

                    const objData = obj as any;

                    if (typeof objData.align === "number") {

                        const alignProp = ui.sceneobjects.TextComponent.align;

                        objData.align = alignProp.values[objData.align] ?? alignProp.defValue;
                    }
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