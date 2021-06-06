namespace phasereditor2d.ide {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export const ICON_PLAY = "play";

    export class IDEPlugin extends colibri.Plugin {

        public eventActivationChanged = new controls.ListenerList<boolean>();

        private static _instance = new IDEPlugin();

        private _openingProject: boolean;
        private _desktopMode: boolean;
        private _advancedJSEditor: boolean;
        private _licenseActivated: boolean;
        private _externalEditorName: string;

        static getInstance() {
            return this._instance;
        }

        private constructor() {
            super("phasereditor2d.ide");

            this._openingProject = false;
            this._licenseActivated = false;
        }

        registerExtensions(reg: colibri.ExtensionRegistry) {

            // windows

            reg.addExtension(
                new colibri.ui.ide.WindowExtension(
                    () => new ui.DesignWindow()
                )
            );

            reg.addExtension(
                new colibri.ui.ide.WindowExtension(
                    () => new ui.WelcomeWindow()
                )
            );

            // icons

            reg.addExtension(
                colibri.ui.ide.IconLoaderExtension.withPluginFiles(this, [
                    ICON_PLAY
                ]));

            // keys

            reg.addExtension(
                new colibri.ui.ide.commands.CommandExtension(
                    ui.actions.IDEActions.registerCommands
                )
            );

            // themes

            reg.addExtension(new colibri.ui.ide.themes.ThemeExtension({
                dark: false,
                id: "lightBlue",
                classList: ["lightBlue"],
                displayName: "Light Blue",
                viewerForeground: controls.Controls.LIGHT_THEME.viewerForeground,
                viewerSelectionForeground: controls.Controls.LIGHT_THEME.viewerSelectionForeground,
                viewerSelectionBackground: controls.Controls.LIGHT_THEME.viewerSelectionBackground,
            }));

            reg.addExtension(new colibri.ui.ide.themes.ThemeExtension({
                dark: false,
                id: "lightGray",
                classList: ["light", "lightGray"],
                displayName: "Light Gray",
                viewerForeground: controls.Controls.LIGHT_THEME.viewerForeground,
                viewerSelectionForeground: controls.Controls.LIGHT_THEME.viewerSelectionForeground,
                viewerSelectionBackground: controls.Controls.LIGHT_THEME.viewerSelectionBackground,
            }));

            // new dialogs

            reg.addExtension(new ui.dialogs.NewProjectDialogExtension());

            // files view menu

            if (IDEPlugin.getInstance().isDesktopMode()) {

                reg.addExtension(new controls.MenuExtension(files.ui.views.FilesView.MENU_ID, {
                    command: ui.actions.CMD_LOCATE_FILE
                }));
            }
        }

        async compileProject() {

            const exts = colibri.Platform.getExtensions<core.CompileProjectExtension>(core.CompileProjectExtension.POINT_ID);

            const dlg = new controls.dialogs.ProgressDialog();

            dlg.create();
            dlg.setTitle("Compiling Project");

            const monitor = new controls.dialogs.ProgressDialogMonitor(dlg);

            for (const ext of exts) {

                monitor.addTotal(ext.getTotal());
            }

            for (const ext of exts) {

                await ext.preload(monitor);
            }

            dlg.close();
        }

        async requestServerMode() {

            const data = await colibri.core.io.apiRequest("GetServerMode");

            this._desktopMode = data.desktop === true;
            this._advancedJSEditor = data.advancedJSEditor === true;
            this._licenseActivated = data.unlocked === true;
            this._externalEditorName = data.externalEditorName || "Alien";
        }

        getExternalEditorName() {

            return this._externalEditorName;
        }

        async requestUpdateAvailable() {

            if (this.isDesktopMode()) {

                if (await this.isNewUpdateAvailable()) {

                    colibri.Platform.getWorkbench().showNotification("A new version is available!");
                }
            }
        }

        async isNewUpdateAvailable() {

            const data = await colibri.core.io.apiRequest("GetNewVersionAvailable");

            return data.available;
        }

        isLicenseActivated() {

            return this._licenseActivated;
        }

        isDesktopMode() {
            return this._desktopMode;
        }

        isAdvancedJSEditor() {
            return this._advancedJSEditor;
        }

        createHelpMenuItem(menu: controls.Menu, helpPath: string) {

            menu.addAction({
                text: "Help",
                callback: () => {

                    controls.Controls.openUrlInNewPage("https://help.phasereditor2d.com/v3/" + helpPath);
                }
            });
        }

        async openFirstWindow() {

            const wb = colibri.Platform.getWorkbench();

            wb.eventProjectOpened.addListener(() => {

                wb.getGlobalPreferences().setValue("defaultProjectData", {
                    projectName: wb.getFileStorage().getRoot().getName()
                });
            });

            const prefs = wb.getGlobalPreferences();

            const defaultProjectData = prefs.getValue("defaultProjectData");

            let win: ui.DesignWindow = null;

            if (defaultProjectData) {

                const projectName = defaultProjectData["projectName"];

                const { projects } = await wb.getFileStorage().getProjects();

                if (projects.indexOf(projectName) >= 0) {

                    await this.ideOpenProject(projectName);

                    return;
                }
            }

            win = wb.activateWindow(ui.WelcomeWindow.ID) as ui.DesignWindow;

            if (win) {

                win.restoreState(wb.getProjectPreferences());
            }
        }

        async ideOpenProject(projectName: string, workspacePath?: string) {

            this._openingProject = true;

            controls.dialogs.Dialog.closeAllDialogs();

            const dlg = new ui.dialogs.OpeningProjectDialog();
            dlg.create();
            dlg.setTitle("Opening " + projectName);
            dlg.setProgress(0);

            const monitor = new controls.dialogs.ProgressDialogMonitor(dlg);

            try {

                const wb = colibri.Platform.getWorkbench();

                {
                    const win = wb.getActiveWindow();

                    if (win instanceof ui.DesignWindow) {

                        win.saveState(wb.getProjectPreferences());
                    }
                }

                console.log(`IDEPlugin: opening project ${projectName}`);

                colibri.Platform.onElectron(async () => {

                    let ws = workspacePath;

                    if (!ws) {

                        const result = await colibri.Platform.getWorkbench().getFileStorage().getProjects();

                        ws = result.workspacePath;
                    }

                    document.title = `Phaser Editor 2D v${VER} ${this.isLicenseActivated() ? "Premium" : "Free"} (${ws})`;

                }, () => {

                    document.title = `Phaser Editor 2D v${VER} ${this.isLicenseActivated() ? "Premium" : "Free"}`;
                });

                const designWindow = wb.activateWindow(ui.DesignWindow.ID) as ui.DesignWindow;

                const editorArea = designWindow.getEditorArea();

                editorArea.closeAllEditors();

                await wb.openProject(projectName, workspacePath, monitor);

                dlg.setProgress(1);

                if (designWindow) {

                    designWindow.restoreState(wb.getProjectPreferences());
                }

            } finally {

                this._openingProject = false;

                dlg.close();
            }
        }

        isOpeningProject() {
            return this._openingProject;
        }

        openProjectInVSCode() {

            this.openFileExternalEditor(colibri.ui.ide.FileUtils.getRoot());
        }

        async openFileExternalEditor(file: io.FilePath) {

            const resp = await colibri.core.io.apiRequest("OpenVSCode", { location: file.getFullName() });

            if (resp.error) {

                alert(resp.error);
            }
        }
    }

    colibri.Platform.addPlugin(IDEPlugin.getInstance());

    /* program entry point */

    export const VER = "3.14.0-next";

    async function main() {

        colibri.CACHE_VERSION = VER;

        console.log(`%c %c Phaser Editor 2D %c v${VER} %c %c https://phasereditor2d.com `,
            "background-color:red",
            "background-color:#3f3f3f;color:whitesmoke",
            "background-color:orange;color:black",
            "background-color:red",
            "background-color:silver",
        );

        colibri.ui.controls.dialogs.AlertDialog.replaceConsoleAlert();

        await IDEPlugin.getInstance().requestServerMode();

        await colibri.Platform.start();

        await IDEPlugin.getInstance().openFirstWindow();

        await IDEPlugin.getInstance().requestUpdateAvailable();
    }

    window.addEventListener("load", main);
}