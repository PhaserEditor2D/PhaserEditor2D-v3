namespace colibri.ui.controls.properties {

    export declare type Updater = () => void;

    export abstract class PropertySection<T> {

        private _id: string;
        private _title: string;
        private _page: PropertyPage;
        private _updaters: Updater[];
        private _fillSpace: boolean;

        constructor(page: PropertyPage, id: string, title: string, fillSpace = false) {
            this._page = page;
            this._id = id;
            this._title = title;
            this._fillSpace = fillSpace;
            this._updaters = [];
        }

        protected abstract createForm(parent: HTMLDivElement);

        abstract canEdit(obj: any, n: number): boolean;

        abstract canEditNumber(n: number): boolean;

        updateWithSelection(): void {
            for (const updater of this._updaters) {
                updater();
            }
        }

        addUpdater(updater: Updater) {
            this._updaters.push(updater);
        }

        isFillSpace() {
            return this._fillSpace;
        }

        getPage() {
            return this._page;
        }

        getSelection(): T[] {
            return this._page.getSelection();
        }

        getId() {
            return this._id;
        }

        getTitle() {
            return this._title;
        }

        create(parent: HTMLDivElement): void {
            this.createForm(parent);
        }

        flatValues_Number(values: number[]): string {
            const set = new Set(values);

            if (set.size == 1) {
                const value = set.values().next().value;
                return value.toString();
            }

            return "";
        }

        flatValues_StringJoin(values: string[]): string {
            return values.join(",");
        }

        protected createGridElement(parent: HTMLElement, cols = 0, simpleProps = true) {
            const div = document.createElement("div");

            div.classList.add("formGrid");

            if (cols > 0) {
                div.classList.add("formGrid-cols-" + cols);
            }

            if (simpleProps) {
                div.classList.add("formSimpleProps");
            }
            parent.appendChild(div);
            return div;
        }

        protected createLabel(parent: HTMLElement, text = "") {

            const label = document.createElement("label");

            label.classList.add("formLabel");
            label.innerText = text;

            parent.appendChild(label);

            return label;
        }

        protected createButton(parent: HTMLElement, text : string, callback: () => void) {
            
            const btn = document.createElement("button");
            
            btn.innerText = text;

            btn.addEventListener("click", e => callback());

            parent.appendChild(btn);

            return btn;
        }

        protected createText(parent: HTMLElement, readOnly = false) {

            const text = document.createElement("input");

            text.type = "text";
            text.classList.add("formText");
            text.readOnly = readOnly;

            parent.appendChild(text);

            return text;
        }

        protected createCheckbox(parent: HTMLElement) {

            const check = document.createElement("input");
            
            check.type = "checkbox";
            check.classList.add("formCheckbox");

            parent.appendChild(check);

            return check;
        }
    }
}