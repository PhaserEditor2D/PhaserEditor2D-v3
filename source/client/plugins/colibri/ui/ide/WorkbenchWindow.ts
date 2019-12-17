/// <reference path="../controls/Control.ts" />

namespace colibri.ui.ide {

    import io = colibri.core.io;

    declare type RestoreEditorData = {
        fileDataList: {
            fileName: string,
            state: any
        }[],
        activeEditorFile: string,
        tabIconSize: number
    }


    export abstract class WorkbenchWindow extends controls.Control {

        private _toolbar: MainToolbar;
        private _clientArea: controls.Control;
        private _id: string;
        private _created: boolean;

        constructor(id: string) {
            super("div", "Window");

            this.getElement().id = id;

            this._id = id;

            this._created = false;

        }

        saveState(prefs: colibri.core.preferences.Preferences) {
            // nothing, derived classes can use methods like saveEditorsSate()
        }

        restoreState(prefs: colibri.core.preferences.Preferences) {
            // nothing, derived classes can use methods like restoreEditors().
        }

        protected saveEditorsState(prefs: colibri.core.preferences.Preferences) {

            const editorArea = this.getEditorArea();

            const editors = editorArea.getEditors();

            let activeEditorFile: string = null;

            {
                const activeEditor = editorArea.getSelectedTabContent() as EditorPart;

                if (activeEditor) {

                    const input = activeEditor.getInput();

                    if (input instanceof io.FilePath) {

                        activeEditorFile = input.getFullName();
                    }
                }
            }

            const restoreEditorData: RestoreEditorData = {
                fileDataList: [],
                activeEditorFile: activeEditorFile,
                tabIconSize: editorArea.getTabIconSize()
            };

            for (const editor of editors) {

                const input = editor.getInput();

                if (input instanceof colibri.core.io.FilePath) {

                    const state = {};

                    editor.saveState(state);

                    restoreEditorData.fileDataList.push({
                        fileName: input.getFullName(),
                        state: state
                    });
                }
            }

            prefs.setValue("restoreEditorData", restoreEditorData);
        }

        protected restoreEditors(prefs: colibri.core.preferences.Preferences) {

            const editorArea = this.getEditorArea();

            const editors = editorArea.getEditors();

            const restoreEditorData = prefs.getValue("restoreEditorData") as RestoreEditorData;

            editorArea.closeAll();

            if (restoreEditorData) {

                if (restoreEditorData.tabIconSize) {
                    editorArea.setTabIconSize(restoreEditorData.tabIconSize);
                }

                let activeEditor: EditorPart = null;
                let lastEditor : EditorPart = null;

                const wb = colibri.Platform.getWorkbench();

                for (const fileData of restoreEditorData.fileDataList) {

                    const fileName = fileData.fileName;

                    const file = colibri.ui.ide.FileUtils.getFileFromPath(fileName);

                    if (file) {

                        const editor = wb.createEditor(file);

                        if (!editor) {
                            continue;
                        }

                        lastEditor = editor;

                        const state = fileData.state;

                        try {

                            editor.setRestoreState(state);

                        } catch (e) {
                            console.error(e);
                        }

                        if (file.getFullName() === restoreEditorData.activeEditorFile) {
                            activeEditor = editor;
                        }
                    }
                }

                if (!activeEditor) {
                    activeEditor = lastEditor;
                }

                if (activeEditor) {
                    
                    editorArea.activateEditor(activeEditor);
                    wb.setActivePart(activeEditor);
                }
            }
        }

        create() {

            if (this._created) {
                return;
            }

            this._created = true;

            window.addEventListener("resize", e => {
                this.layout();
            });

            window.addEventListener(controls.EVENT_THEME_CHANGED, e => this.layout());

            this._toolbar = new MainToolbar();
            this._clientArea = new controls.Control("div", "WindowClientArea");
            this._clientArea.setLayout(new controls.FillLayout());

            this.add(this._toolbar);
            this.add(this._clientArea);

            this.setLayout(new WorkbenchWindowLayout());

            this.createParts();
        }

        protected abstract createParts();

        getId() {
            return this._id;
        }

        getToolbar() {
            return this._toolbar;
        }

        getClientArea() {
            return this._clientArea;
        }

        getViews() {

            const views: ViewPart[] = [];

            this.findViews(this.getElement(), views);

            return views;
        }

        getView(viewId: string) {

            const views = this.getViews();

            return views.find(view => view.getId() === viewId);
        }

        private findViews(element: HTMLElement, views: ViewPart[]) {

            const control = controls.Control.getControlOf(element);

            if (control instanceof ViewPart) {

                views.push(control);

            } else {

                for (let i = 0; i < element.childElementCount; i++) {
                    const childElement = element.children.item(i);
                    this.findViews(<any>childElement, views);
                }
            }
        }

        protected createViewFolder(...parts: Part[]): ViewFolder {

            const folder = new ViewFolder();
            for (const part of parts) {
                folder.addPart(part);
            }

            return folder;
        }

        abstract getEditorArea(): EditorArea;
    }
}