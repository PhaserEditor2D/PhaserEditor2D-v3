namespace phasereditor2d.scene.core.json {

    export class Version1ToVersion2Migration {

        migrate(data: ISceneData) {

            console.log("Migrating: unlock position by default");

            this.migrateUnlockPosition(data.displayList);
        }

        private migrateUnlockPosition(list?: IObjectData[]) {

            if (list) {

                for (const obj of list) {

                    if (obj.prefabId) {

                        console.log(`Migrating: unlock position of ${obj.label}(${obj.id})`);
                        obj.unlock = obj.unlock ?? [];
                        obj.unlock.push("x", "y");
                    }

                    this.migrateUnlockPosition(obj.list);
                }
            }
        }
    }
}