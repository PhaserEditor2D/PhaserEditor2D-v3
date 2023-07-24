/// <reference path="../controls/Control.ts" />

namespace colibri.ui.ide {

    import io = colibri.core.io;

    declare type RestoreEditorData = {
        inputDataList: Array<{
            inputExtensionId: string,
            inputState: any,
            editorState: any,
            editorFactory: string
        }>,
        activeEditorIndex: number,
        tabIconSize: number
    };

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

            let activeEditorIndex = 0;

            {
                const activeEditor = editorArea.getSelectedTabContent() as EditorPart;
                activeEditorIndex = Math.max(0, editors.indexOf(activeEditor));
            }

            const restoreEditorData: RestoreEditorData = {
                inputDataList: [],
                activeEditorIndex: activeEditorIndex,
                tabIconSize: editorArea.getTabIconSize()
            };

            for (const editor of editors) {

                const input = editor.getInput();

                const inputExtension = Platform.getWorkbench().getEditorInputExtension(input);

                const editorState = {};

                editor.saveState(editorState);

                restoreEditorData.inputDataList.push({
                    inputExtensionId: inputExtension.getId(),
                    inputState: inputExtension.getEditorInputState(input),
                    editorState: editorState,
                    editorFactory: editor.getEditorFactory().getName()
                });
            }

            prefs.setValue("restoreEditorState", restoreEditorData);
        }

        protected restoreEditors(prefs: colibri.core.preferences.Preferences) {

            const editorArea = this.getEditorArea();

            const restoreEditorData = prefs.getValue("restoreEditorState") as RestoreEditorData;

            if (restoreEditorData) {

                if (restoreEditorData.tabIconSize) {

                    editorArea.setTabIconSize(restoreEditorData.tabIconSize);
                }

                let lastEditor: EditorPart = null;

                const wb = colibri.Platform.getWorkbench();

                for (const inputData of restoreEditorData.inputDataList) {

                    const inputState = inputData.inputState;

                    if (!inputState) {

                        continue;
                    }

                    const inputExtension = Platform.getWorkbench()
                        .getEditorInputExtensionWithId(inputData.inputExtensionId);

                    const input = inputExtension.createEditorInput(inputState);

                    if (input) {

                        const factory = wb.getEditorRegistry().getFactoryByName(inputData.editorFactory);

                        const editor = wb.createEditor(input, factory);

                        if (!editor) {

                            continue;
                        }

                        lastEditor = editor;

                        const editorState = inputData.editorState;

                        try {

                            editor.setRestoreState(editorState);

                        } catch (e) {
                            console.error(e);
                        }
                    }
                }

                let activeEditor = editorArea.getEditors()[restoreEditorData.activeEditorIndex];

                if (!activeEditor) {

                    activeEditor = lastEditor;
                }

                if (activeEditor) {

                    editorArea.activateEditor(activeEditor);
                    wb.setActivePart(activeEditor);
                }
            }

            if (editorArea.getEditors().length === 0) {

                this.openFromUrlSearchParameter();
            }
        }

        private openFromUrlSearchParameter() {
            
            const params = new URLSearchParams(window.location.search);
            
            const filePath = params.get("openfile");

            if (!filePath) {

                return;
            }

            const root = FileUtils.getRoot().getName();

            console.log(`Workbench: opening editor for "${filePath}"`);

            const file = FileUtils.getFileFromPath(`${root}/${filePath}`);

            if (file) {

                colibri.Platform.getWorkbench().openEditor(file);

            } else {

                console.log("Workbench: file not found.");
            }
        }

        private onStorageChanged(e: io.FileStorageChange) {

            const editorArea = this.getEditorArea();
            const editorsToRemove: FileEditor[] = [];

            for (const editor of editorArea.getEditors()) {

                if (editor instanceof FileEditor) {

                    const file = editor.getInput();

                    if (file) {

                        if (e.isDeleted(file.getFullName())) {

                            try {

                                editorsToRemove.push(editor);

                            } catch (e) {
                                console.error(e);
                            }
                        }
                    }
                }
            }
            if (editorsToRemove.length > 0) {

                editorArea.closeEditors(editorsToRemove);
            }
        }

        create() {

            if (this._created) {
                return;
            }

            this._created = true;

            window.addEventListener("resize", () => this.layout());

            Platform.getWorkbench().eventThemeChanged.addListener(() => this.layout());

            if (colibri.CAPABILITY_FILE_STORAGE) {

                FileUtils.getFileStorage().addChangeListener(e => {

                    this.onStorageChanged(e);
                });
            }

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
                    this.findViews(childElement as any, views);
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