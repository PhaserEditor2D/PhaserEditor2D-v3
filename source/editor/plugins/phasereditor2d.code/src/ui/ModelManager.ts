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

                    if (!fileName.endsWith(".js")) {

                        continue;
                    }

                    const file = fileMap.get(fileName);

                    const str = await utils.preloadAndGetFileString(file);

                    monaco.editor.createModel(str, "javascript", CodePlugin.fileUri(fileName));
                }

                // handle deletions

                for (const fileName of e.getDeleteRecords()) {

                    if (!fileName.endsWith(".js")) {

                        continue;
                    }

                    const model = monaco.editor.getModel(CodePlugin.fileUri(fileName));

                    if (model) {

                        model.dispose();
                    }
                }

                // handle modifications

                for (const fileName of e.getModifiedRecords()) {

                    if (!fileName.endsWith(".js")) {

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

                    if (!oldFileName.endsWith(".js")) {

                        continue;
                    }

                    const newFileName = e.getRenameTo(oldFileName);

                    const oldModel = monaco.editor.getModel(CodePlugin.fileUri(oldFileName));

                    monaco.editor.createModel(
                        oldModel.getValue(), "javascript", CodePlugin.fileUri(newFileName));

                    oldModel.dispose();
                }

            });
        }
    }
}