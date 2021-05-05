namespace colibri.problems.ui.views {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class ProblemsView extends colibri.ui.ide.ViewerView {

        static VIEW_ID = "colibri.problems.ui.views.ProblemsView";
        static EDITOR_VIEWER_PROVIDER_KEY = "Problems";
        private _extensionMap: Map<string, ProblemBuilderExtension[]>;

        constructor() {
            super(ProblemsView.VIEW_ID);

            this.setIcon(ProblemsPlugin.getInstance().getIcon(ICON_ERROR));
            this.setTitle("Problems");

            this._extensionMap = Platform.getExtensions<ProblemBuilderExtension>(ProblemBuilderExtension.POINT_ID).reduce((prev, current) => {

                const list = prev.get(current.getContentType()) || [];

                list.push(current);

                prev.set(current.getContentType(), list);

                return prev;

            }, new Map<string, ProblemBuilderExtension[]>());
        }

        private registerStorageListener() {

            Platform.getWorkbench().getFileStorage().addChangeListener(change => this.storageChanged());
        }

        private async storageChanged() {

            const reg = Platform.getWorkbench().getContentTypeRegistry();

            const files = colibri.ui.ide.FileUtils.getAllFiles();

            files.forEach(async f => await reg.preload(f));

            const problems: core.Problem[] = [];

            for (const [ct, extensions] of this._extensionMap.entries()) {

                const buildFiles = files.filter(f => reg.getCachedContentType(f) === ct);

                for (const ext of extensions) {

                    const result = await ext.build(buildFiles);

                    problems.push(...result);
                }
            }

            this.getViewer().setInput(problems);
            this.getViewer().repaint();

            if (problems.length > 0) {

                this.setTitle(`Problems (${problems.length})`);

            } else {

                this.setTitle("Problems");
            }
        }

        protected createViewer(): colibri.ui.controls.viewers.TreeViewer {

            const viewer = new controls.viewers.TreeViewer(this.getId() + ".Viewer");
            viewer.setStyledLabelProvider(new ProblemsStyledLabelProvider());
            viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            viewer.setCellRendererProvider(new ProblemsCellRendererProvider());

            viewer.eventOpenItem.addListener(() => {

                const problem = viewer.getSelectionFirstElement() as core.Problem;

                if (problem) {

                    problem.reveal();
                }
            });

            return viewer;
        }

        createPart() {

            super.createPart();

            this.registerStorageListener();

            this.storageChanged();
        }
    }
}