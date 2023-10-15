namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import core = colibri.core;

    const localForage = window["localforage"] as LocalForage;

    export abstract class ThumbnailCache<TObject> extends core.io.ContentCache<TObject, controls.IImage> {

        private _database: LocalForage;

         async clearCache() {

            await this._database?.clear();
        }

        constructor(dbName: string) {
            super(async (file, force) => {

                this._database = localForage.createInstance({
                    name: dbName,
                    driver: localForage.INDEXEDDB
                });

                const db = this._database;

                const objKey = this.computeObjectKey(file);

                const imageKey = objKey + "@image";
                const hashKey =  objKey + "@modTime";

                const currentHash = this.computeObjectHash(file);

                if (!force) {

                    try {

                        const blob = await db.getItem(imageKey) as Blob;
                        const savedFileTime = await db.getItem(hashKey) as string;

                        if (blob) {

                            if (currentHash === savedFileTime) {

                                const imgElement = controls.Controls.createImageFromBlob(blob);

                                await new Promise((resolver, reject) => {

                                    imgElement.addEventListener("load", () => resolver(undefined));
                                });

                                return new controls.ImageWrapper(imgElement);
                            }
                        }

                    } catch (error) {

                        console.log(error);
                    }
                }

                const image = this.createObjectImage(file);

                await image.preload();

                const element = image.getImageElement();

                if (element) {

                    const newBlob = await controls.Controls.createBlobFromImage(element);

                    db.setItem(imageKey, newBlob);
                    db.setItem(hashKey, currentHash);
                }

                return Promise.resolve(image);
            });
        }

        abstract createObjectImage(obj: TObject): SceneThumbnailImage;
    }
}