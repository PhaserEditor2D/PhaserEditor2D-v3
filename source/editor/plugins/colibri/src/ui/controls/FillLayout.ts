namespace colibri.ui.controls {

    export class FillLayout implements ILayout {
        private _padding: number = 0;

        constructor(padding: number = 0) {
            this._padding = padding;
        }

        getPadding() {
            return this._padding;
        }

        setPadding(padding: number): void {
            this._padding = padding;
        }

        layout(parent: Control) {
            const children = parent.getChildren();

            if (children.length > 1) {
                console.warn("[FillLayout] Invalid number for children or parent control.");
            }

            const b = parent.getBounds();

            setElementBounds(parent.getElement(), b);

            if (children.length > 0) {
                const child = children[0];
                child.setBoundsValues(
                    this._padding,
                    this._padding,
                    b.width - this._padding * 2,
                    b.height - this._padding * 2
                );
            }
        }
    }

}