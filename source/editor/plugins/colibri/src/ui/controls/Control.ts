namespace colibri.ui.controls {

    export class Control {

        public eventControlLayout = new ListenerList();
        public eventSelectionChanged = new ListenerList();

        private _bounds: IBounds = { x: 0, y: 0, width: 0, height: 0 };
        private _element: HTMLElement;
        private _children: Control[];
        private _layout: ILayout;
        private _container: Control;
        private _scrollY: number;
        private _layoutChildren: boolean;
        private _handlePosition = true;

        constructor(tagName: string = "div", ...classList: string[]) {

            this._children = [];

            this._element = document.createElement(tagName);
            this._element["__control"] = this;

            this.addClass("Control", ...classList);

            this._layout = null;
            this._container = null;
            this._scrollY = 0;
            this._layoutChildren = true;
        }

        static getControlOf(element: HTMLElement): Control {

            return element["__control"];
        }

        static getParentControl(element: HTMLElement) {

            if (element) {

                const control = this.getControlOf(element);

                return control || this.getParentControl(element.parentElement);
            }

            return null;
        }

        isHandlePosition() {

            return this._handlePosition;
        }

        setHandlePosition(_handlePosition: boolean): void {

            this._handlePosition = _handlePosition;
        }

        get style() {

            return this.getElement().style;
        }

        isLayoutChildren() {

            return this._layoutChildren;
        }

        setLayoutChildren(layout: boolean): void {

            this._layoutChildren = layout;
        }

        getScrollY() {

            return this._scrollY;
        }

        setScrollY(scrollY: number) {

            this._scrollY = scrollY;
        }

        getContainer() {

            return this._container;
        }

        getLayout() {

            return this._layout;
        }

        setLayout(layout: ILayout): void {

            this._layout = layout;

            this.layout();
        }

        addClass(...tokens: string[]): void {

            this._element.classList.add(...tokens);
        }

        removeClass(...tokens: string[]): void {

            this._element.classList.remove(...tokens);
        }

        containsClass(className: string) {

            return this._element.classList.contains(className);
        }

        getElement() {

            return this._element;
        }

        getControlPosition(windowX: number, windowY: number) {

            const b = this.getElement().getBoundingClientRect();

            return {
                x: windowX - b.left,
                y: windowY - b.top
            };
        }

        containsLocalPoint(x: number, y: number) {

            return x >= 0 && x <= this._bounds.width && y >= 0 && y <= this._bounds.height;
        }

        setBounds(bounds: IBounds): void {

            this._bounds.x = bounds.x === undefined ? this._bounds.x : bounds.x;
            this._bounds.y = bounds.y === undefined ? this._bounds.y : bounds.y;
            this._bounds.width = bounds.width === undefined ? this._bounds.width : bounds.width;
            this._bounds.height = bounds.height === undefined ? this._bounds.height : bounds.height;

            this.layout();
        }

        setBoundsValues(x: number, y: number, w: number, h: number): void {

            this.setBounds({ x: x, y: y, width: w, height: h });
        }

        getBounds() {

            return this._bounds;
        }

        setLocation(x: number, y: number): void {

            if (x !== undefined) {

                x = Math.floor(x);
                this._element.style.left = x + "px";
                this._bounds.x = x;
            }

            if (y !== undefined) {

                y = Math.floor(y);
                this._element.style.top = y + "px";
                this._bounds.y = y;
            }
        }

        layout(): void {

            if (this.isHandlePosition()) {

                setElementBounds(this._element, this._bounds);

            } else {

                setElementBounds(this._element, {
                    width: this._bounds.width,
                    height: this._bounds.height
                });
            }

            if (this._layout) {

                this._layout.layout(this);

            } else {

                this.layoutChildren();
            }

            this.dispatchLayoutEvent();
        }

        protected layoutChildren() {

            if (this._layoutChildren) {

                for (const child of this._children) {
                    child.layout();
                }
            }
        }

        dispatchLayoutEvent() {

            this.eventControlLayout.fire();
        }

        add(control: Control): void {

            control._container = this;

            this._children.push(control);

            this._element.appendChild(control.getElement());
            
            control.onControlAdded();
        }

        remove(control: Control) {

            control.getElement().remove();

            this._children = this._children.filter(c => c !== control);

            control.onControlRemoved();
        }

        protected onControlAdded() {
            // nothing
        }

        protected onControlRemoved() {
            // nothing
        }

        getChildren() {
            return this._children;
        }
    }
}