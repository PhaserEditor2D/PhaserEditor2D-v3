namespace phasereditor2d.pack.core {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export abstract class AssetPackItem {
        private _pack: AssetPack;
        private _data: any;
        private _editorData: any;

        constructor(pack: AssetPack, data: any) {
            this._pack = pack;
            this._data = data;
            this._editorData = {};
        }

        getFileFromAssetUrl(url: string) {

            if (!url) {

                return undefined;
            }

            return AssetPackUtils.getFileFromPackUrl(this.getPack(), url);
        }

        computeUsedFiles(files: Set<io.FilePath>) {

            this.addFilesFromDataKey(files, "url");

            this.addFilesFromDataKey(files, "urls");

            this.addFilesFromDataKey(files, "normalMap");
        }

        protected addFilesFromDataKey(files: Set<io.FilePath>, ...keys: string[]) {

            const urls: string[] = [];

            for (const key of keys) {

                if (Array.isArray(this._data[key])) {

                    urls.push(...this._data[key]);
                }

                if (typeof (this._data[key]) === "string") {

                    urls.push(this._data[key]);
                }
            }

            this.addFilesFromUrls(files, urls);
        }

        protected addFilesFromUrls(files: Set<io.FilePath>, urls: string[]) {

            for (const url of urls) {

                const file = this.getFileFromAssetUrl(url);

                if (file) {

                    files.add(file);
                }
            }
        }

        getEditorData() {
            return this._editorData;
        }

        getPack() {
            return this._pack;
        }

        getKey(): string {
            return this._data["key"];
        }

        setKey(key: string) {
            this._data["key"] = key;
        }

        getType(): string {
            return this._data["type"];
        }

        getData() {
            return this._data;
        }

        addToPhaserCache(game: Phaser.Game, cache: parsers.AssetPackCache) {
            // empty
        }

        async preload(): Promise<controls.PreloadResult> {

            return controls.Controls.resolveNothingLoaded();
        }

        /**
         * For building connections with other assets.
         * It is the case of the frames of the sprite animations.
         * 
         * @param finder 
         */
        async build(finder: pack.core.PackFinder) {
            // empty
        }

        resetCache() {
            // empty
        }

        getPackItem() {

            return this;
        }

        computeHash() {

            const files = new Set<io.FilePath>();

            this.computeUsedFiles(files);

            const builder = new ide.core.MultiHashBuilder();

            for (const file of files) {

                builder.addPartialFileToken(file);
            }

            const str = JSON.stringify(this.getData());

            builder.addPartialToken(str);

            const hash = builder.build();

            return hash;
        }
    }
}