///<reference path="../../ui/SceneDataMigrationExtension.ts"/>
namespace phasereditor2d.scene.core.migrations {

    export class OriginMigration_v2_to_v3 extends ui.SceneDataMigrationExtension {

        async migrate(data: json.ISceneData): Promise<void> {

            const version = data.meta.version ?? 1;

            if (version < 3) {

                await this.migrateList(data.displayList);
            }
        }

        private async migrateList(list: json.IObjectData[]) {

            for (const obj of list) {

                const serializer = new json.Serializer(obj);

                const type = serializer.getType();

                if (type === "Text" || type === "BitmapText") {

                    const origin = {
                        originX: serializer.read("originX", 0.5),
                        originY: serializer.read("originY", 0.5),
                    };

                    Object.assign(obj, origin);
                }

                if (obj.list) {

                    await this.migrateList(obj.list);
                }
            }
        }
    }
}