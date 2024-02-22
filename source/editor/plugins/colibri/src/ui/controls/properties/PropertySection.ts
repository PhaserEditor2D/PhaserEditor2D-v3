/// <reference path="./FormBuilder.ts" />
namespace colibri.ui.controls.properties {

    export declare type Updater = () => void;

    export abstract class PropertySection<T> extends FormBuilder {

        private _id: string;
        private _title: string;
        private _page: PropertyPage;
        private _updaters: Updater[];
        private _fillSpace: boolean;
        private _collapsedByDefault: boolean;
        private _icon: controls.IImage;
        private _typeHash: string;

        constructor(
            page: PropertyPage,
            id: string,
            title: string,
            fillSpace = false,
            collapsedByDefault = false,
            icon?: controls.IImage,
            typeHash?: string) {

            super();

            this._page = page;
            this._id = id;
            this._title = title;
            this._fillSpace = fillSpace;
            this._collapsedByDefault = collapsedByDefault;
            this._icon = icon;
            this._typeHash = typeHash;

            this._updaters = [];

            const localTabSection = localStorage.getItem(this.localStorageKey("tabSection"));
        }

        abstract createForm(parent: HTMLDivElement): void;

        abstract canEdit(obj: any, n: number): boolean;

        onSectionHidden() {
            // nothing
        }

        canEditAll(selection: any[]) {

            return true;
        }

        private localStorageKey(prop: string) {

            return "PropertySection[" + this._id + "]." + prop;
        }

        abstract canEditNumber(n: number): boolean;

        createMenu(menu: controls.Menu) {
            // empty by default
        }

        hasMenu() {

            return false;
        }

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

        isCollapsedByDefault() {

            return this._collapsedByDefault;
        }

        getPage() {

            return this._page;
        }

        getSelection(): T[] {

            return this._page.getSelection();
        }

        getSelectionFirstElement(): T {

            return this.getSelection()[0];
        }

        getId() {

            return this._id;
        }

        getTitle() {

            return this._title;
        }

        isDynamicTitle() {

            return false;
        }

        getIcon() {

            return this._icon;
        }

        getTypeHash() {

            return this._typeHash;
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

        flatValues_StringJoinDifferent(values: string[]): string {

            const set = new Set(values);

            return [...set].join(",");
        }

        flatValues_StringOneOrNothing(values: string[]): string {

            const set = new Set(values);

            return set.size === 1 ? values[0] : `(${values.length} selected)`;
        }

        flatValues_BooleanAnd(values: boolean[]) {

            for (const value of values) {

                if (!value) {

                    return false;
                }
            }

            return true;
        }

        parseNumberExpressionString(expr: string, isInteger = false) {

            let value: number;

            const parser = new exprEval.Parser();

            try {

                value = parser.evaluate(expr);

                if (typeof value === "number") {

                    if (isInteger) {

                        return Math.floor(value);
                    }

                    return value;
                }

            } catch (e) {

                // nothing, wrong syntax
            }

            if (isInteger) {

                return Number.parseInt(expr, 10);
            }

            return Number.parseFloat(expr);
        }

        parseNumberExpression(textElement: HTMLInputElement, isInteger = false) {

            const expr = textElement.value;

            const value = this.parseNumberExpressionString(expr, isInteger);

            if (typeof value === "number") {

                textElement.value = value.toString();
            }

            return value;
        }

        createGridElement(parent: HTMLElement, cols = 0, simpleProps = true) {

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


    }
}