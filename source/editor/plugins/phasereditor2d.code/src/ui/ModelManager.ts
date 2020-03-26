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

                for (const fileName of e.getAddRecords()) {

                    if (!fileName.endsWith(".js")) {

                        continue;
                    }

                    const file = fileMap.get(fileName);

                    const str = await utils.preloadAndGetFileString(file);

                    monaco.editor.createModel(str, "javascript", monaco.Uri.file(fileName));
                }

                for (const fileName of e.getDeleteRecords()) {

                    if (!fileName.endsWith(".js")) {

                        continue;
                    }

                    const model = monaco.editor.getModel(monaco.Uri.file(fileName));

                    if (model) {

                        model.dispose();
                    }
                }

                for (const fileName of e.getModifiedRecords()) {

                    if (!fileName.endsWith(".js")) {

                        continue;
                    }

                    const file = fileMap.get(fileName);

                    const content = await utils.preloadAndGetFileString(file);

                    const model = monaco.editor.getModel(monaco.Uri.file(fileName));

                    if (model.getValue() !== content) {

                        model.setValue(content);
                    }
                }
            });
        }
    }
}