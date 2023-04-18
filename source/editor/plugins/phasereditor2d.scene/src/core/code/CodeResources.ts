namespace phasereditor2d.scene.core.code {

    import io = colibri.core.io;
    import controls = colibri.ui.controls;

    type ISpec = "js" | "ts" | "js-module" | "ts-module";

    const SPEC_EXT = {
        "js": "js",
        "js-module": "js",
        "ts": "ts",
        "ts-module": "ts"
    }

    interface IResource {
        id: string,
        path: string
    }

    export class CodeResources {

        private _plugin: colibri.Plugin;
        private _resources: IResource[];
        private _resDataMap: Map<string, string>;

        constructor(plugin: colibri.Plugin) {

            this._plugin = plugin;
            this._resources = [];
            this._resDataMap = new Map();
        }

        addResource(id: string, path: string) {

            this._resources.push({ id, path });
        }

        addCodeResource(fileName: string) {

            for (const spec of ["js", "ts", "js-module", "ts-module"]) {

                const ext = SPEC_EXT[spec];

                this.addResource(`${spec}/${fileName}`, `code-resources/${spec}/${fileName}.${ext}`);
            }
        }

        addCodeDefsResource(fileName: string) {

            this.addResource(`defs/${fileName}`, `code-resources/defs/${fileName}.d.ts`);
        }

        async preload(): Promise<void> {

            for (const res of this._resources) {

                const data = await this._plugin.getString(res.path);

                this._resDataMap.set(res.id, data);
            }
        }

        async createFile(resId: string, parent: io.FilePath, name: string): Promise<io.FilePath> {

            const data = this._resDataMap.get(resId);

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
                const resources = this._resources.filter(r => r.id.startsWith(`${spec}/`));
                
                const defsRes = this._resources.find(r => r.id.startsWith("defs"));

                if (defsRes) {

                    resources.push(defsRes);
                }

                monitor.addTotal(resources.length + 1);

                await this.preload();
                monitor.step();

                console.log(resources);

                for (const resource of resources) {

                    const fileName = resource.path.split("/").pop();

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