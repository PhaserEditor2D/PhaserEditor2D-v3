/// <reference path="../controls/TabPane.ts" />

namespace colibri.ui.ide {

    export class PartFolder extends controls.TabPane {

        constructor(...classList: string[]) {
            super("PartsTabPane", ...classList);

            this.eventControlLayout.addListener(() => {

                const content = this.getSelectedTabContent();

                if (content) {

                    content.layout();
                }
            });

            this.eventTabClosed.addListener((part: Part) => {

                if (part.onPartClosed()) {

                    if (this.getContentList().length === 1) {

                        Workbench.getWorkbench().setActivePart(null);

                        if (this instanceof EditorArea) {

                            Workbench.getWorkbench().setActiveEditor(null);
                        }
                    }

                } else {

                    return controls.CANCEL_EVENT;
                }
            });

            this.eventTabSelected.addListener((part: Part) => {

                Workbench.getWorkbench().setActivePart(part);

                part.onPartShown();
            });

            this.eventTabLabelResized.addListener(() => {

                for (const part of this.getParts()) {

                    part.dispatchTitleUpdatedEvent();
                }
            });
        }

        addPart(part: Part, closeable = false, selectIt = true): void {

            part.eventPartTitleChanged.addListener(() => {

                const icon = part.getIcon();

                if (icon) {

                    icon.preload().then(() => {

                        this.setTabTitle(part, part.getTitle(), icon);
                    });

                } else {

                    this.setTabTitle(part, part.getTitle(), null);
                }
            });

            this.addTab(part.getTitle(), part.getIcon(), part, closeable, selectIt);

            part.setPartFolder(this);

            part.onPartAdded();

            // we do this here because the icon can be computed with the input.
            part.dispatchTitleUpdatedEvent();
        }

        getParts(): Part[] {
            return this.getContentList() as Part[];
        }
    }
}