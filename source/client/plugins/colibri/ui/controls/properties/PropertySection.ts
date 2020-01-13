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

            if (set.size === 1) {

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

        protected createLabel(parent: HTMLElement, text = "", tooltip = "") {

            const label = document.createElement("label");

            label.classList.add("formLabel");
            label.innerText = text;

            if (tooltip) {
                Tooltip.tooltip(label, tooltip);
            }

            parent.appendChild(label);

            return label;
        }

        protected createButton(parent: HTMLElement, text: string, callback: (e?: MouseEvent) => void) {

            const btn = document.createElement("button");

            btn.innerText = text;

            btn.addEventListener("click", e => callback(e));

            parent.appendChild(btn);

            return btn;
        }

        protected createMenuButton(
            parent: HTMLElement, text: string,
            items: Array<{ name: string, value: any }>,
            callback: (value: any) => void) {

            const btn = this.createButton(parent, text, e => {

                const menu = new controls.Menu();

                for (const item of items) {

                    menu.add(new Action({
                        text: item.name,
                        callback: () => {
                            callback(item.value);
                        }
                    }));
                }

                menu.create(e);
            });

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

        protected createTextArea(parent: HTMLElement, readOnly = false) {

            const text = document.createElement("textarea");

            text.classList.add("formText");
            text.readOnly = readOnly;

            parent.appendChild(text);

            return text;
        }

        private static NEXT_ID = 0;

        protected createCheckbox(parent: HTMLElement, label?: HTMLLabelElement) {

            const check = document.createElement("input");

            if (label) {

                const id = (PropertySection.NEXT_ID++).toString();

                label.htmlFor = id;

                check.setAttribute("id", id);
            }

            check.type = "checkbox";
            check.classList.add("formCheckbox");

            parent.appendChild(check);

            return check;
        }
    }
}