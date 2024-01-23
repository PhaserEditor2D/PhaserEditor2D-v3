/// <reference path="./ViewerView.ts" />

namespace colibri.ui.ide {

    import viewers = controls.viewers;

    export abstract class EditorViewerView extends ide.ViewerView {

        private _currentEditor: EditorPart;
        private _currentViewerProvider: EditorViewerProvider;
        private _viewerStateMap: Map<EditorPart, viewers.ViewerState>;
        private _tabSectionListener: (section: string) => void;

        constructor(id: string) {
            super(id);

            this._viewerStateMap = new Map();
            this._tabSectionListener = section => {

                this.onTabSectionSelected(section);
            }
        }

        protected createViewer(): viewers.TreeViewer {

            const viewer = new viewers.TreeViewer(this.getId() + ".EditorViewerView");

            viewer.eventSelectionChanged.addListener(() => {

                if (this._currentViewerProvider) {

                    this._currentViewerProvider.onViewerSelectionChanged(this._viewer.getSelection());
                }
            });

            viewer.eventOpenItem.addListener(() => {

                this._currentViewerProvider.onViewerDoubleClick(this._viewer.getSelection());
            });

            return viewer;
        }

        protected createPart(): void {

            super.createPart();

            Workbench.getWorkbench().eventEditorActivated.addListener(() => this.onWorkbenchEditorActivated());
        }

        fillContextMenu(menu: controls.Menu) {

            if (this._currentViewerProvider) {

                this._currentViewerProvider.fillContextMenu(menu);
            }
        }

        abstract getViewerProvider(editor: EditorPart): EditorViewerProvider;

        private async onWorkbenchEditorActivated() {

            if (this._currentEditor !== null) {

                const state = this._viewer.getState();
                this._viewerStateMap.set(this._currentEditor, state);
            }

            const editor = Workbench.getWorkbench().getActiveEditor();

            if (editor && editor.isEmbeddedMode()) {

                // we don't want an embedded editor to be connected with the editor viewers.
                return;
            }

            let provider: EditorViewerProvider = null;

            if (editor) {

                if (editor === this._currentEditor) {

                    provider = this._currentViewerProvider;

                } else {

                    provider = this.getViewerProvider(editor);
                }
            }

            const tabsPane = this.getPartFolder();
            const tabLabel = tabsPane.getLabelFromContent(this);

            tabsPane.eventTabSectionSelected.removeListener(this._tabSectionListener);

            tabsPane.removeAllSections(tabLabel);

            if (provider) {

                await provider.preload();

                this._viewer.setTreeRenderer(provider.getTreeViewerRenderer(this._viewer));
                this._viewer.setStyledLabelProvider(provider.getStyledLabelProvider());
                this._viewer.setLabelProvider(provider.getLabelProvider());
                this._viewer.setCellRendererProvider(provider.getCellRendererProvider());
                this._viewer.setContentProvider(provider.getContentProvider());
                this._viewer.setInput(provider.getInput());

                provider.setViewer(this._viewer);

                const state = this._viewerStateMap.get(editor);

                if (state) {

                    provider.prepareViewerState(state);

                    this._viewer.setState(state);
                    this._filteredViewer.filterText(state.filterText);

                } else {

                    this._filteredViewer.filterText("");

                    const treeRenderer = this._viewer.getTreeRenderer();

                    if (treeRenderer instanceof viewers.GridTreeViewerRenderer) {

                        const roots = this.getViewer().getContentProvider().getRoots(this._viewer.getInput());
                        const expanded = roots.filter(r => treeRenderer.isSection(r))

                        for (const obj of expanded) {

                            this._viewer.setExpanded(obj, true);
                        }
                    }
                }

                if (provider.allowsTabSections()) {

                    for (const section of provider.getTabSections()) {

                        tabsPane.addTabSection(tabLabel, section, this.getId());
                    }

                    tabsPane.selectTabSection(tabLabel, provider.getSelectedTabSection());
                }

            } else {

                this._viewer.setInput(null);
                this._viewer.setContentProvider(new controls.viewers.EmptyTreeContentProvider());
            }

            this._currentViewerProvider = provider;
            this._currentEditor = editor;

            this._viewer.repaint();

            if (provider && provider.allowsTabSections()) {

                tabsPane.eventTabSectionSelected.addListener(this._tabSectionListener);
            }
        }

        private onTabSectionSelected(section: string) {

            if (this._currentViewerProvider) {

                this._currentViewerProvider.tabSectionChanged(section);
            }
        }

        getPropertyProvider() {

            if (this._currentViewerProvider) {

                return this._currentViewerProvider.getPropertySectionProvider();
            }

            return null;
        }

        getUndoManager() {

            if (this._currentViewerProvider) {
                return this._currentViewerProvider.getUndoManager();
            }

            return super.getUndoManager();
        }
    }
}