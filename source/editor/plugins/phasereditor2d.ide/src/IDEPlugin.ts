namespace phasereditor2d.ide {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export const ICON_PLAY = "play";

    export class IDEPlugin extends colibri.Plugin {
        
        public eventActivationChanged = new controls.ListenerList<boolean>();

        private static _instance = new IDEPlugin();

        private _openingProject: boolean;
        private _desktopMode: boolean;
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

            // files view menu

            if (IDEPlugin.getInstance().isDesktopMode()) {

                reg.addExtension(new controls.MenuExtension(files.ui.views.FilesView.MENU_ID, {
                    command: ui.actions.CMD_LOCATE_FILE
                }));
            }

            phasereditor2d.files.FilesPlugin.getInstance().setOpenFileAction(file => this.openFileFromFilesView(file));
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
            this._licenseActivated = data.unlocked === true;
            this._externalEditorName = data.externalEditorName || "Alien";
        }

        async requestProjectConfig() {

            const data = await colibri.core.io.apiRequest("GetProjectConfig");

            return data;
        }

        getExternalEditorName() {

            return this._externalEditorName;
        }

        openBrowser(url: string) {

            colibri.Platform.onElectron(electron => {

                colibri.core.io.apiRequest("OpenBrowser", { url });

            }, () => {

                controls.Controls.openUrlInNewPage(url);
            });
        }

        async playProject(startScene?: string) {

            const config = await IDEPlugin.getInstance().requestProjectConfig();

            const search = startScene ? `?start=${startScene}` : "";

            colibri.Platform.onElectron(electron => {

                const url = config.playUrl + search;

                colibri.core.io.apiRequest("OpenBrowser", { url });

            }, () => {

                const url = (config.playUrl || colibri.ui.ide.FileUtils.getRoot().getExternalUrl())
                    + search;

                controls.Controls.openUrlInNewPage(url);
            });
        }

        async requestUpdateAvailable() {

            if (this.isDesktopMode()) {

                if (await this.isNewUpdateAvailable()) {

                    colibri.Platform.getWorkbench().showNotification("A new version is available!",
                        () => this.openBrowser("https://phasereditor2d.com/downloads"));
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

        createHelpMenuItem(menu: controls.Menu, helpPath: string) {

            menu.addAction({
                text: "Help",
                callback: () => {

                    controls.Controls.openUrlInNewPage("https://help.phasereditor2d.com/v3/" + helpPath);
                }
            });
        }

        async ideOpenProject() {

            this._openingProject = true;

            controls.dialogs.Dialog.closeAllDialogs();

            const dlg = new ui.dialogs.OpeningProjectDialog();
            dlg.create();
            dlg.setTitle("Opening project");
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

                console.log(`IDEPlugin: opening project`);

                document.title = `Phaser Editor 2D v${VER} ${this.isLicenseActivated() ? "Premium" : "Free"}`;

                const designWindow = wb.activateWindow(ui.DesignWindow.ID) as ui.DesignWindow;

                const editorArea = designWindow.getEditorArea();

                editorArea.closeAllEditors();

                await wb.openProject(monitor);

                dlg.setProgress(1);

                if (designWindow) {

                    designWindow.restoreState(wb.getProjectPreferences());
                }

                const projectName = wb.getFileStorage().getRoot().getName();

                document.title = `Phaser Editor 2D v${VER} ${this.isLicenseActivated() ? "Premium" : "Free"} ${projectName}`;

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

        setEnableOpenCodeFileInExternalEditor(enabled: boolean) {
            
            window.localStorage.setItem("phasereditor2d.ide.enableOpenCodeFileInExternalEditor", enabled? "1" : "0");
        }

        isEnableOpenCodeFileInExternalEditor() {

            return window.localStorage.getItem("phasereditor2d.ide.enableOpenCodeFileInExternalEditor") === "1";
        }

        private openFileFromFilesView(file: io.FilePath) {

            // a hack, detect if content type is JS, TS, or plain text, so it opens the external editor
            if (this.isEnableOpenCodeFileInExternalEditor()) {

                const ct = colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(file);

                switch (ct) {
                    case "typescript":
                    case "javascript":
                    case "html":
                    case "css":

                        console.log(`Openin ${file.getFullName()} with external editor`);

                        this.openFileExternalEditor(file);

                        return;
                }
            }

            colibri.Platform.getWorkbench().openEditor(file);
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

    export const VER = "3.60.2";

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

        await IDEPlugin.getInstance().ideOpenProject();

        await IDEPlugin.getInstance().requestUpdateAvailable();
    }

    window.addEventListener("load", main);
}