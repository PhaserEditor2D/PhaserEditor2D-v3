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
            });
        }
    }
}