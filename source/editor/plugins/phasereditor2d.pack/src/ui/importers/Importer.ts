namespace phasereditor2d.pack.ui.importers {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export abstract class Importer {

        private _type: string;
        private _multipleFiles: boolean;

        constructor(type: string) {
            this._type = type;
            this._multipleFiles = false;
        }

        isMultipleFiles() {

            return this._multipleFiles;
        }

        setMultipleFiles(multipleFiles: boolean) {

            this._multipleFiles = multipleFiles;
        }

        getType() {
            return this._type;
        }

        abstract acceptFile(file: io.FilePath): boolean;

        abstract createItemData(pack: core.AssetPack, file: io.FilePath | io.FilePath[]);

        async autoImport(pack: core.AssetPack, files: io.FilePath[]) {

            if (this.isMultipleFiles()) {

                return [await this.importMultipleFiles(pack, files)];

            } else {

                const items: core.AssetPackItem[] = [];

                for (const file of files) {

                    items.push(await this.importFile(pack, file))
                }

                return items;
            }
        }

        async importFile(pack: core.AssetPack, file: io.FilePath | io.FilePath[]): Promise<core.AssetPackItem> {

            const data = this.createItemData(pack, file);

            const firstFile = Array.isArray(file) ? file[0] : file;

            data.type = this.getType();
            
            const computer = new ide.utils.NameMaker(i => i.getKey());

            computer.update(pack.getItems());

            const baseKey = this.computeItemFromKey(firstFile);

            const key = computer.makeName(baseKey);

            data.key = key;

            const item = pack.createPackItem(data);

            pack.addItem(item);

            await item.preload();

            const finder = new core.PackFinder();
            await finder.preload();
            
            await item.build(finder);

            return item;
        }

        protected computeItemFromKey(file: io.FilePath) {

            return file.getNameWithoutExtension();
        }

        async importMultipleFiles(pack: core.AssetPack, files: io.FilePath[]): Promise<core.AssetPackItem> {

            const computer = new ide.utils.NameMaker(i => i.getKey());

            computer.update(pack.getItems());

            const data = this.createItemData(pack, files);

            data.type = this.getType();
            data.key = computer.makeName(files[0].getNameWithoutExtension());

            const item = pack.createPackItem(data);

            pack.addItem(item);

            await item.preload();

            const finder = new core.PackFinder();
            
            await finder.preload();

            await item.build(finder);

            return item;
        }
    }

}