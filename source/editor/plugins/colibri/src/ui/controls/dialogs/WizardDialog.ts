namespace colibri.ui.controls.dialogs {

    export class WizardDialog extends Dialog {
        private _pageDescArea: HTMLDivElement;
        private _pageArea: HTMLDivElement;
        private _clientArea: HTMLDivElement;
        private _pageTitleLabel: HTMLLabelElement;
        private _pages: WizardPage[];
        private _activePageIndex: number;
        private _finishButton: HTMLButtonElement;
        private _cancelButton: HTMLButtonElement;
        private _nextButton: HTMLButtonElement;
        private _backButton: HTMLButtonElement;

        constructor(...classList: string[]) {
            super("WizardDialog", ...classList);

            this._pages = [];
            this._activePageIndex = 0;
        }

        addPages(...pages: WizardPage[]) {

            for (const page of pages) {

                page.setWizard(this);
            }

            this._pages.push(...pages);
        }

        private createActivePage() {

            if (!this.hasPages()) {

                return;
            }

            const page = this.getActivePage();

            page.saveState();

            this._pageArea.innerHTML = "";

            page.createElements(this._pageArea);

            this._pageTitleLabel.textContent = page.getTitle();
            this._pageDescArea.innerHTML = page.getDescription();

            this.updateWizardButtons();
        }

        updateWizardButtons() {

            if (!this.hasPages()) {

                return;
            }

            const page = this.getActivePage();

            this._finishButton.disabled = !this.canFinishWizard();
            this._backButton.disabled = !page.canGoBack() || this._activePageIndex === 0;
            this._nextButton.disabled = !page.canGoNext() || this._activePageIndex === this._pages.length - 1;
        }

        protected canFinishWizard() {

            for (const page of this._pages) {

                if (!page.canFinish()) {

                    return false;
                }
            }

            return true;
        }

        hasPages() {

            return this._pages.length > 0;
        }

        getPages() {

            return this._pages;
        }

        getActivePageIndex() {

            return this._activePageIndex;
        }

        getActivePage() {

            return this._pages[this._activePageIndex];
        }

        create() {

            super.create();

            this._finishButton = this.addButton("Finish", () => {

                this.finishButtonPressed();

                this.close();
            });

            this._cancelButton = this.addCancelButton(() => {

                this.cancelButtonPressed();
            });

            this._nextButton = this.addButton("Next >", () => {

                this._activePageIndex++;

                this.createActivePage();
            });

            this._backButton = this.addButton("< Back", () => {

                this._activePageIndex--;

                this.createActivePage();
            });

            this.createActivePage();
        }

        createDialogArea() {

            this._clientArea = document.createElement("div");
            this._clientArea.classList.add("DialogClientArea");
            this.getElement().appendChild(this._clientArea);

            this._pageTitleLabel = document.createElement("label");
            this._pageTitleLabel.textContent = "The title";
            this._pageTitleLabel.classList.add("PageTitleLabel");
            this._clientArea.appendChild(this._pageTitleLabel);

            this._pageDescArea = document.createElement("div");
            this._pageDescArea.classList.add("PageDescArea");
            this._clientArea.appendChild(this._pageDescArea);

            this._pageArea = document.createElement("div");
            this._pageArea.classList.add("PageArea");
            this._pageArea.innerHTML = "page area";
            this._clientArea.appendChild(this._pageArea);
        }

        protected cancelButtonPressed() {
            // nothing
        }

        protected finishButtonPressed() {
            // nothing
        }
    }
}