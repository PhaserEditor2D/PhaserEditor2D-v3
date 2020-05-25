namespace phasereditor2d.code.ui {

    import io = colibri.core.io;

    export class ModelManager {

        constructor() {

            const utils = colibri.ui.ide.FileUtils;

            const storage = colibri.ui.ide.Workbench.getWorkbench().getFileStorage();

            storage.addFirstChangeListener(async (e) => {

                const files = utils.getRoot().flatTree([], false);

                const fileMap = new Map<string, io.FilePath>();

                for (const file of files) {

                    fileMap.set(file.getFullName(), file);
                }

                // handle additions

                for (const fileName of e.getAddRecords()) {

                    if (!ModelManager.handleFileName(fileName)) {

                        continue;
                    }

                    const file = fileMap.get(fileName);

                    const str = await utils.preloadAndGetFileString(file);

                    const lang = this.getModeId(fileName);

                    monaco.editor.createModel(str, lang, CodePlugin.fileUri(fileName));
                }

                // handle deletions

                for (const fileName of e.getDeleteRecords()) {

                    if (!ModelManager.handleFileName(fileName)) {

                        continue;
                    }

                    const model = monaco.editor.getModel(CodePlugin.fileUri(fileName));

                    if (model) {

                        model.dispose();
                    }
                }

                // handle modifications

                for (const fileName of e.getModifiedRecords()) {

                    if (!ModelManager.handleFileName(fileName)) {

                        continue;
                    }

                    const file = fileMap.get(fileName);

                    const content = await utils.preloadAndGetFileString(file);

                    const model = monaco.editor.getModel(CodePlugin.fileUri(fileName));

                    if (model.getValue() !== content) {

                        model.setValue(content);
                    }
                }

                // handle renames

                for (const oldFileName of e.getRenameFromRecords()) {

                    if (!ModelManager.handleFileName(oldFileName)) {

                        continue;
                    }

                    const newFileName = e.getRenameTo(oldFileName);

                    const oldModel = monaco.editor.getModel(CodePlugin.fileUri(oldFileName));

                    const lang = this.getModeId(newFileName);

                    monaco.editor.createModel(
                        oldModel.getValue(), lang, CodePlugin.fileUri(newFileName));

                    oldModel.dispose();
                }
            });
        }

        private getModeId(filename: string) {

            return filename.endsWith(".js") ? "javascript" : "typescript";
        }

        public static handleFileName(filename: string) {

            return filename.endsWith(".js") || filename.endsWith(".ts");
        }
    }
}