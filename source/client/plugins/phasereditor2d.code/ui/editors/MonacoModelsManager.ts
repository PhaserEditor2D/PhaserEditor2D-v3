namespace phasereditor2d.code.ui.editors {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class MonacoModelsManager {

        private static _instance : MonacoModelsManager;

        static getInstance() {

            if (!this._instance) {

                this._instance = new MonacoModelsManager();
            }

            return this._instance;
        }

        private _started : boolean;

        private _extraLibs: {
            disposable: monaco.IDisposable,
            file: io.FilePath
        }[];

        constructor() {

            this._started = false;
            this._extraLibs = [];
        }

        async start() {

            if (this._started) {
                return;
            }

            this._started = true;

            this.updateExtraLibs();

            colibri.Platform.getWorkbench().getFileStorage().addChangeListener(change => this.onStorageChanged(change));

        }

        private onStorageChanged(change: io.FileStorageChange) {

            console.info(`MonacoModelsManager: storage changed.`);

            const test = (paths: Set<string>) => {

                for (const r of paths) {

                    if (r.endsWith(".d.ts")) {
                        return true;
                    }
                }

                return false;
            }

            const update = test(change.getDeleteRecords())
                || test(change.getModifiedRecords())
                || test(change.getRenameToRecords())
                || test(change.getRenameFromRecords())
                || test(change.getAddRecords());

            if (update) {
                
                this.updateExtraLibs();
            }
        }

        async updateExtraLibs() {

            console.log("MonacoModelsManager: updating extra libs.");

            for (const lib of this._extraLibs) {

                console.log(`MonacoModelsManager: disposing ${lib.file.getFullName()}`);

                lib.disposable.dispose();
            }

            const files = colibri.ui.ide.FileUtils.getRoot().flatTree([], false);

            const tsFiles = files.filter(file => file.getName().endsWith(".d.ts"));

            for (const file of tsFiles) {

                const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);

                const d = monaco.languages.typescript.javascriptDefaults.addExtraLib(content);

                console.log(`MonacoModelsManager: add extra lib ${file.getFullName()}`);

                this._extraLibs.push({
                    disposable: d,
                    file: file
                });
            }
        }
    }
}