namespace phasereditor2d.scene.core.code {

    import io = colibri.core.io;
    import controls = colibri.ui.controls;

    type ISpec = "js" | "ts" | "js-module" | "ts-module";

    interface IResource {
        id: string,
    }

    export class CodeResources2 {

        private _resKey: string;
        private _resources: IResource[];

        constructor(resKey: string) {

            this._resKey = resKey;
            this._resources = [];
        }

        addResource(id: string) {

            this._resources.push({ id });
        }

        addCodeResource(fileName: string) {

            for (const spec of ["js", "ts", "js-module", "ts-module"]) {

                const ext = spec.replace("-module", "");

                this.addResource(`${spec}/${fileName}.${ext}`);
            }
        }

        addCodeDefsResource(fileName: string) {

            this.addResource(`defs/${fileName}`);
        }

        async createFile(resId: string, parent: io.FilePath, name: string): Promise<io.FilePath> {

            const key = this._resKey + "/" + resId;

            const data = resources.getResString(key);

            console.log("creating resource", resId, "data", data);

            return await colibri.ui.ide.FileUtils.createFile_async(parent, name, data);
        }

        async createCodeFiles(spec: ISpec, dlgTitle: string) {

            try {

                const filesView = colibri.Platform.getWorkbench().getActiveWindow()
                    .getView(files.ui.views.FilesView.ID) as files.ui.views.FilesView;

                const sel = filesView.getSelection();

                let folder: colibri.core.io.FilePath;

                if (sel.length > 0) {

                    const file = sel[0] as colibri.core.io.FilePath;

                    if (file.isFolder()) {

                        folder = file;

                    } else {

                        folder = file.getParent();
                    }

                } else {

                    alert("Please, select a folder in the Files view.");
                    return;
                }

                const dlg = new controls.dialogs.ProgressDialog();
                dlg.create();
                dlg.setTitle(dlgTitle);

                const monitor = new controls.dialogs.ProgressDialogMonitor(dlg);

                const newFiles = [];
                const resourceList = this._resources.filter(r => r.id.startsWith(`${spec}/`));

                const defsRes = this._resources.find(r => r.id.startsWith("defs"));

                if (defsRes) {

                    resourceList.push(defsRes);
                }

                monitor.addTotal(resourceList.length + 1);

                monitor.step();

                for (const resource of resourceList) {

                    const fileName = resource.id.split("/").pop();

                    newFiles.push(await this.createFile(resource.id, folder, fileName));

                    monitor.step();
                }

                dlg.close();

                const viewer = filesView.getViewer();

                viewer.setExpanded(folder, true);

                await viewer.repaint();

                viewer.setSelection(newFiles);

            } catch (e) {

                console.log(e);

                alert("Error: " + e.message);
            }
        }

        registerCommands(categoryId: string, categoryName: string, reg: colibri.ExtensionRegistry) {

            reg.addExtension(new colibri.ui.ide.commands.CommandExtension(manager => {

                manager.addCategory({
                    id: categoryId,
                    name: categoryName,
                });

                for (const spec of ["js", "js-module", "ts", "ts-module"]) {

                    manager.add({
                        command: {
                            id: categoryId + "." + spec,
                            category: categoryId,
                            name: `Create User Files (${spec})`,
                            tooltip: `Create the user files with the ${categoryName} API.`
                        },
                        handler: {
                            executeFunc: args => {

                                this.createCodeFiles(spec as ISpec, `Creating ${categoryName} files`);
                            }
                        }
                    });
                }

            }));
        }
    }
}