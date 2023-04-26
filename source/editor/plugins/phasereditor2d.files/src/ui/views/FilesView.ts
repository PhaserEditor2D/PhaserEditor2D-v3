
namespace phasereditor2d.files.ui.views {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;

    export const TAB_SECTION_DESIGN = "Design";
    export const TAB_SECTION_ASSETS = "Assets";
    export const TAB_SECTIONS = [TAB_SECTION_DESIGN, TAB_SECTION_ASSETS];

    export class FilesView extends ide.ViewerView {

        static ID = "phasereditor2d.files.ui.views.FilesView";
        static MENU_ID = "phasereditor2d.files.ui.views.FilesView#ContextMenu";

        private _propertyProvider = new FilePropertySectionProvider();

        constructor() {
            super(FilesView.ID);

            this.setTitle("Files");

            this.setIcon(ide.Workbench.getWorkbench().getWorkbenchIcon(colibri.ICON_FOLDER));
        }

        onPartAdded() {

            super.onPartActivated();

            const folder = this.getPartFolder();
            const label = folder.getLabelFromContent(this);

            for (const section of TAB_SECTIONS) {

                folder.addTabSection(label, section, this.getId());
            }

            folder.eventTabSectionSelected.addListener(async (section: string) => {

                const provider = section ? new FilteredContentProvider(section)
                    : new viewers.FileTreeContentProvider();

                // await colibri.Platform.getWorkbench().getFileStorage().getRoot().visitAsync(async (file) => {

                //     if (file.isFile()) {

                //         await colibri.Platform.getWorkbench().getContentTypeRegistry().preload(file);
                //     }
                // });

                this.getViewer().setContentProvider(provider);
                this.getViewer().setScrollY(0);
            });
        }

        protected createViewer() {

            return new controls.viewers.TreeViewer(FilesView.ID);
        }

        fillContextMenu(menu: controls.Menu) {

            menu.addMenu(this.createNewFileMenu());

            menu.addMenu(this.createOpenWithMenu());

            menu.addSeparator();

            menu.add(new actions.RenameFileAction(this));

            menu.add(new actions.MoveFilesAction(this));

            menu.add(new actions.CopyFilesAction(this));

            menu.add(new actions.DeleteFilesAction(this));

            menu.add(new actions.UploadFilesAction(this));

            menu.addSeparator();

            menu.addExtension(FilesView.MENU_ID);
        }

        createOpenWithMenu(): controls.Menu {

            const menu = new controls.Menu("Open With...");

            const reg = colibri.Platform.getWorkbench().getEditorRegistry();

            const sel = this.getViewer().getSelection();
            const file = sel.length === 1 && sel[0] instanceof io.FilePath ? sel[0] : undefined;

            const factories: colibri.ui.ide.EditorFactory[] = [];

            const defaultFactory = reg.getDefaultFactory();

            const registeredFactory = file ? reg.getFactoryForInput(file) : undefined;

            if (registeredFactory && registeredFactory !== defaultFactory) {

                factories.push(registeredFactory);
            }

            if (defaultFactory) {

                factories.push(defaultFactory);
            }

            factories.push(...reg.getFactories().filter(f => f !== defaultFactory && f !== registeredFactory));

            for (const factory of factories) {

                menu.addAction({
                    text: factory.getName(),
                    enabled: file !== undefined,
                    callback: () => colibri.Platform.getWorkbench().openEditor(file, factory)
                });

                if (factory === defaultFactory) {

                    menu.addSeparator();
                }
            }

            return menu;
        }

        private createNewFileMenu() {

            const menu = new controls.Menu("New...");

            const extensions = colibri.Platform.getExtensionRegistry()
                .getExtensions<dialogs.NewDialogExtension>(files.ui.dialogs.NewDialogExtension.POINT_ID);

            for (const ext of extensions) {

                menu.add(new controls.Action({
                    text: ext.getDialogName(),
                    icon: ext.getDialogIcon(),
                    callback: () => {

                        const sel = this.getViewer().getSelectionFirstElement();
                        let loc = sel ? sel as io.FilePath : colibri.Platform.getWorkbench().getProjectRoot();

                        if (loc.isFile()) {

                            loc = loc.getParent();
                        }

                        const dlg = ext.createDialog({
                            initialFileLocation: loc
                        });

                        dlg.setTitle(`New ${ext.getDialogName()}`);
                    }
                }));
            }

            return menu;
        }

        getPropertyProvider() {

            return this._propertyProvider;
        }

        protected createPart(): void {

            super.createPart();

            const wb = ide.Workbench.getWorkbench();

            const root = wb.getProjectRoot();

            const viewer = this._viewer;

            viewer.setStyledLabelProvider(new viewers.StyledFileLabelProvider());
            viewer.setContentProvider(new viewers.FileTreeContentProvider());
            viewer.setCellRendererProvider(new viewers.FileCellRendererProvider());
            viewer.setInput(root);

            viewer.repaint();

            viewer.eventOpenItem.addListener(async (file: io.FilePath) => {

                if (file.isFolder()) {

                    viewer.setExpanded(file, !viewer.isExpanded(file));

                    viewer.repaint();

                    return;
                }

                FilesPlugin.getInstance().getOpenFileAction()(file);
            });

            wb.getFileStorage().addChangeListener(change => this.onFileStorageChange(change));

            wb.eventEditorActivated.addListener(() => {

                const editor = wb.getActiveEditor();

                if (editor) {

                    const input = editor.getInput();

                    if (input instanceof io.FilePath) {

                        // gives it a time because other listeners need to do their job.
                        viewer.setSelection([input]);
                        viewer.reveal(input);
                    }
                }
            });
        }

        private async onFileStorageChange(change: io.FileStorageChange) {

            const viewer = this.getViewer();

            const oldSelection = this.getViewer().getSelection();

            viewer.setInput(ide.FileUtils.getRoot());

            await viewer.repaint();

            if (oldSelection.length > 0) {

                const newSelection = oldSelection

                    .map(obj => obj as io.FilePath)

                    .filter(file => {

                        const file2 = colibri.ui.ide.FileUtils.getFileFromPath(file.getFullName());

                        return file2 !== null;
                    });

                if (newSelection.length !== oldSelection.length) {
                    this.getViewer().setSelection(newSelection);
                    this.getViewer().repaint();
                }
            }
        }

        getIcon() {
            return colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER);
        }
    }

    class FilteredContentProvider extends viewers.FileTreeContentProvider {

        private _section: string;
        private static _cache = new Map<string, string>();

        constructor(section: string) {
            super();

            this._section = section;
        }

        private isFileIncluded(file: io.FilePath) {

            const contentType = colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(file);

            const supported = this.isContentTypeSupportedBySection(contentType, this._section);

            return supported;
        }

        private isContentTypeSupportedBySection(contentType: string, section) {

            const extensions = colibri.Platform.getExtensions(ContentTypeSectionExtension.POINT_ID) as ContentTypeSectionExtension[];

            for (const ext of extensions) {

                if (ext.isContentTypeSupportedBySection(contentType, section)) {

                    return true;
                }
            }

            return false;
        }

        getChildren(parent: io.FilePath): any[] {

            const children = super.getChildren(parent);

            return children.filter((file: io.FilePath) => {

                if (file.isFolder()) {

                    return this.getChildren(file).length > 0;
                }

                return this.isFileIncluded(file);
            });
        }
    }
}