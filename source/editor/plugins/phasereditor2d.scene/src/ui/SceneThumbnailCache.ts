namespace phasereditor2d.scene.ui {

    import controls = colibri.ui.controls;
    import core = colibri.core;

    const localForage = window["localforage"] as LocalForage;

    export class SceneThumbnailCache extends core.io.FileContentCache<controls.IImage> {

        static _instance: SceneThumbnailCache;
        static _database: LocalForage;

        static getInstance() {

            if (!this._instance) {

                this._database = localForage.createInstance({
                    name: "phasereditor2d.scene.ui.SceneThumbnailCache",
                    driver: localForage.INDEXEDDB
                });

                this._instance = new SceneThumbnailCache();
            }

            return this._instance;
        }

        static async clearCache() {

            SceneThumbnailCache.getInstance();

            await this._database.clear();
        }

        private constructor() {
            super(async (file, force) => {

                const db = SceneThumbnailCache._database;

                const imageKey = file.getFullName() + "@image";
                const modTimeKey = file.getFullName() + "@modTime";

                const currentFileTime = file.getModTime();

                if (!force) {

                    try {

                        const blob = await db.getItem(imageKey) as Blob;
                        const savedFileTime = await db.getItem(modTimeKey) as number;

                        if (blob) {

                            if (currentFileTime === savedFileTime) {

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

                const image = new SceneThumbnailImage(file);

                await image.preload();

                const element = image.getImageElement();

                if (element) {

                    const newBlob = await controls.Controls.createBlobFromImage(element);

                    db.setItem(imageKey, newBlob);
                    db.setItem(modTimeKey, currentFileTime);
                }

                return Promise.resolve(image);
            });
        }
    }
}