namespace colibri.ui.controls {

    export const EVENT_CONTROL_LAYOUT = "controlLayout";

    export class Control extends EventTarget {
        private _bounds: Bounds = { x: 0, y: 0, width: 0, height: 0 };
        private _element: HTMLElement;
        private _children: Control[];
        private _layout: ILayout;
        private _container: Control;
        private _scrollY: number;
        private _layoutChildren: boolean;
        private _handlePosition = true;

        constructor(tagName: string = "div", ...classList: string[]) {
            super();
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

        containsClass(className : string) {
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

        setBounds(bounds: Bounds): void {
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
            this._element.style.left = x + "px";
            this._element.style.top = y + "px";
            this._bounds.x = x;
            this._bounds.y = y;
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

                if (this._layoutChildren) {

                    for (let child of this._children) {
                        child.layout();
                    }
                }
            }

            this.dispatchLayoutEvent();
        }

        dispatchLayoutEvent() {
            this.dispatchEvent(new CustomEvent(EVENT_CONTROL_LAYOUT));
        }

        add(control: Control): void {
            control._container = this;
            this._children.push(control);
            this._element.appendChild(control.getElement());
            control.onControlAdded();
        }

        protected onControlAdded() {

        }

        getChildren() {
            return this._children;
        }
    }
}