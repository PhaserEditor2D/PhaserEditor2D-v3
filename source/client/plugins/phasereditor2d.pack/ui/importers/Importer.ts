namespace phasereditor2d.pack.ui.importers {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export abstract class Importer {

        private _type: string;

        constructor(type: string) {
            this._type = type;
        }

        getType() {
            return this._type;
        }

        abstract acceptFile(file: io.FilePath): boolean;

        abstract createItemData(file: io.FilePath);

        async importFile(pack: core.AssetPack, file: io.FilePath): Promise<core.AssetPackItem> {

            const computer = new ide.utils.NameMaker(item => item.getKey());

            computer.update(pack.getItems());

            const data = this.createItemData(file);

            data.type = this.getType();
            data.key = computer.makeName(file.getNameWithoutExtension());

            const item = pack.createPackItem(data);

            pack.getItems().push(item);

            await item.preload();

            return item;
        }
    }

}