namespace phasereditor2d.code.ui.editors {

    import io = colibri.core.io;
    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;

    function isSrcFile(file: io.FilePath) {

        if (!file) {
            return false;
        }

        const name = file.getName();

        if (name.endsWith(".min.js")) {
            return false;
        }

        if (name === "phaser.js") {
            return false;
        }

        return name.endsWith(".js");
    }

    function isDefFile(file: io.FilePath) {

        return file.getName().endsWith(".d.ts");
    }

    class MonacoModelsProjectPreloader extends colibri.ui.ide.PreloadProjectResourcesExtension {

        private _manager: MonacoModelsManager;

        constructor(manager: MonacoModelsManager) {
            super();

            this._manager = manager;
        }

        async computeTotal(): Promise<number> {

            return this._manager.computePreloadTotal();
        }

        preload(monitor: controls.IProgressMonitor) {

            return this._manager.preload(monitor);
        }


    }

    export class MonacoModelsManager {

        private _fileModelMap: Map<string, monaco.editor.ITextModel>;
        private _changeListener: io.ChangeListenerFunc;
        private _filesModifiedByMonacoEditor: Set<io.FilePath>;

        constructor() {

            this._fileModelMap = new Map();
            this._filesModifiedByMonacoEditor = new Set();

            this._changeListener = change => {

                // added files

                for (const name of change.getAddRecords()) {

                    const file = ide.FileUtils.getFileFromPath(name);

                    if (isSrcFile(file)) {

                        this.addSrcFile(file);

                    } else if (name.endsWith(".d.ts")) {

                        this.addDefFile(file);
                    }
                }

                // modified files

                for (const name of change.getModifiedRecords()) {

                    const file = ide.FileUtils.getFileFromPath(name);

                    if (this._filesModifiedByMonacoEditor.has(file)) {

                        continue;
                    }

                    const model = this._fileModelMap.get(file.getFullName());

                    if (model) {

                        const content = ide.FileUtils.getFileString(file);
                        model.setValue(content);
                    }
                }

                this._filesModifiedByMonacoEditor = new Set();

                // deleted files

                for (const name of change.getDeleteRecords()) {

                    const model = this._fileModelMap.get(name);

                    if (model) {

                        model.dispose();
                    }
                }

                // moved files

                for (const from of change.getRenameFromRecords()) {

                    const to = change.getRenameTo(from);

                    const model = this._fileModelMap.get(from);

                    if (model) {

                        // TODO: we should rename the model URI

                        this._fileModelMap.set(to, model);
                        this._fileModelMap.delete(from);

                        model.dispose();
                    }
                }
            };
        }

        fileModifiedByMonacoEditor(file: io.FilePath) {

            this._filesModifiedByMonacoEditor.add(file);
        }

        private reset() {

            this._fileModelMap.clear();

            for (const model of monaco.editor.getModels()) {

                model.dispose();
            }

            ide.FileUtils.getFileStorage().addChangeListener(this._changeListener);
        }

        getProjectPreloader() {

            return new MonacoModelsProjectPreloader(this);
        }

        async computePreloadTotal() {

            const srcFiles = ide.FileUtils.getAllFiles()
                .filter(isSrcFile);

            const defFiles = ide.FileUtils.getAllFiles()
                .filter(isDefFile);

            return srcFiles.length + defFiles.length;
        }

        async preload(monitor: controls.IProgressMonitor) {

            this.reset();

            const srcFiles = ide.FileUtils.getAllFiles()
                .filter(isSrcFile);

            const defFiles = ide.FileUtils.getAllFiles()
                .filter(isDefFile);

            for (const file of defFiles) {

                await this.addDefFile(file);

                monitor.step();
            }

            for (const file of srcFiles) {

                await this.addSrcFile(file);

                monitor.step();
            }

            monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
            monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
        }

        private async addSrcFile(file: io.FilePath) {

            const value = await ide.FileUtils.preloadAndGetFileString(file);

            const uri = monaco.Uri.file(file.getFullName());

            const model = monaco.editor.createModel(value, null, uri);

            this._fileModelMap.set(file.getFullName(), model);
        }

        private async addDefFile(file: io.FilePath) {

            const content = await ide.FileUtils.preloadAndGetFileString(file);

            monaco.languages.typescript.javascriptDefaults.addExtraLib(content);
            monaco.languages.typescript.typescriptDefaults.addExtraLib(content);
        }

        getModel(file: io.FilePath) {

            return this._fileModelMap.get(file.getFullName());
        }
    }
}