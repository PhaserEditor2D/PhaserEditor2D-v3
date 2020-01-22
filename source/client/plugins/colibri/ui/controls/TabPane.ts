namespace colibri.ui.controls {

    export const EVENT_TAB_CLOSED = "tabClosed";
    export const EVENT_TAB_SELECTED = "tabSelected";
    export const EVENT_TAB_LABEL_RESIZED = "tabResized";

    class CloseIconManager {

        private _element: HTMLCanvasElement;
        private _context: CanvasRenderingContext2D;
        private _icon: IImage;
        private _overIcon: IImage;

        constructor() {

            this._element = document.createElement("canvas");
            this._element.classList.add("TabPaneLabelCloseIcon");
            this._element.width = ICON_SIZE;
            this._element.height = ICON_SIZE;
            this._element.style.width = ICON_SIZE + "px";
            this._element.style.height = ICON_SIZE + "px";

            this._context = this._element.getContext("2d");

            this._element.addEventListener("mouseenter", e => {
                this.paint(this._overIcon);
            });

            this._element.addEventListener("mouseleave", e => {
                this.paint(this._icon);
            });
        }

        static setManager(element: HTMLElement, manager: CloseIconManager) {
            element["__CloseIconManager"] = manager;
        }

        static getManager(element: HTMLElement): CloseIconManager {
            return element["__CloseIconManager"];
        }

        setIcon(icon: IImage) {
            this._icon = icon;
        }

        setOverIcon(icon: IImage) {
            this._overIcon = icon;
        }

        getElement() {
            return this._element;
        }

        repaint() {
            this.paint(this._icon);
        }

        paint(icon: IImage) {

            if (icon) {

                this._context.clearRect(0, 0, ICON_SIZE, ICON_SIZE);
                icon.paint(this._context, 0, 0, ICON_SIZE, ICON_SIZE, true);

            }
        }
    }

    class TabIconManager {

        private _icon: IImage;
        private _canvas: HTMLCanvasElement;

        private constructor(canvas: HTMLCanvasElement, icon: IImage) {

            this._canvas = canvas;

            this._icon = icon;
        }

        static createElement(icon: IImage, size: number) {

            const canvas = document.createElement("canvas");
            canvas.classList.add("TabCloseIcon");

            const manager = new TabIconManager(canvas, icon);

            canvas["__TabIconManager"] = manager;

            manager.resize(size);

            return canvas;
        }

        resize(size: number) {

            size = Math.max(size, ICON_SIZE);

            if (this._icon && this._icon.getWidth() === ICON_SIZE && this._icon.getHeight() === ICON_SIZE) {
                size = ICON_SIZE;
            }

            this._canvas.width = this._canvas.height = size;
            this._canvas.style.width = this._canvas.style.height = size + "px";

            this.repaint();
        }

        static getManager(canvas: HTMLCanvasElement): TabIconManager {
            return canvas["__TabIconManager"];
        }

        setIcon(icon: IImage) {

            this._icon = icon;

            this.repaint();
        }

        repaint() {

            const ctx = this._canvas.getContext("2d");

            ctx.imageSmoothingEnabled = false;

            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

            if (!this._icon) {
                return;
            }

            const w = this._icon.getWidth();
            const h = this._icon.getHeight();

            if (w === ICON_SIZE && h === ICON_SIZE) {

                this._icon.paint(ctx,
                    (this._canvas.width - w) / 2, (this._canvas.height - h) / 2,
                    w, h, false);

            } else {

                this._icon.paint(ctx, 0, 0, this._canvas.width, this._canvas.height, true);
            }
        }
    }

    export class TabPane extends Control {

        private _selectionHistoryLabelElement: HTMLElement[];
        private _titleBarElement: HTMLElement;
        private _contentAreaElement: HTMLElement;
        private _iconSize: number;

        constructor(...classList: string[]) {
            super("div", "TabPane", ...classList);

            this._selectionHistoryLabelElement = [];

            this._titleBarElement = document.createElement("div");
            this._titleBarElement.classList.add("TabPaneTitleBar");
            this.getElement().appendChild(this._titleBarElement);

            this._contentAreaElement = document.createElement("div");
            this._contentAreaElement.classList.add("TabPaneContentArea");
            this.getElement().appendChild(this._contentAreaElement);

            this._iconSize = ICON_SIZE;
        }

        addTab(label: string, icon: IImage, content: Control, closeable = false, selectIt = true): void {

            const labelElement = this.makeLabel(label, icon, closeable);
            this._titleBarElement.appendChild(labelElement);
            labelElement.addEventListener("mousedown", e => {

                if (e.button !== 0) {

                    e.preventDefault();
                    e.stopImmediatePropagation();

                    return;
                }

                if (TabPane.isTabCloseIcon(e.target as HTMLElement)) {
                    return;
                }

                this.selectTab(labelElement);
            });

            const contentArea = new Control("div", "ContentArea");
            contentArea.add(content);
            this._contentAreaElement.appendChild(contentArea.getElement());

            labelElement["__contentArea"] = contentArea.getElement();

            if (selectIt) {

                if (this._titleBarElement.childElementCount === 1) {
                    this.selectTab(labelElement);
                }
            }
        }

        getTabIconSize() {
            return this._iconSize;
        }

        setTabIconSize(size: number) {

            this._iconSize = Math.max(ICON_SIZE, size);

            for (let i = 0; i < this._titleBarElement.children.length; i++) {

                const label = this._titleBarElement.children.item(i);

                const iconCanvas = label.firstChild as HTMLCanvasElement;

                TabIconManager.getManager(iconCanvas).resize(this._iconSize);

                this.layout();
            }

            this.dispatchEvent(new CustomEvent(EVENT_TAB_LABEL_RESIZED, {}));
        }

        incrementTabIconSize(amount: number) {
            this.setTabIconSize(this._iconSize + amount);
        }

        private makeLabel(label: string, icon: IImage, closeable: boolean): HTMLElement {

            const labelElement = document.createElement("div");
            labelElement.classList.add("TabPaneLabel");

            const tabIconElement = TabIconManager.createElement(icon, this._iconSize);
            labelElement.appendChild(tabIconElement);

            const textElement = document.createElement("span");
            textElement.innerHTML = label;
            labelElement.appendChild(textElement);

            if (closeable) {

                const manager = new CloseIconManager();

                manager.setIcon(Controls.getIcon(ICON_CONTROL_CLOSE));
                manager.repaint();
                manager.getElement().addEventListener("click", e => {
                    e.stopImmediatePropagation();
                    this.closeTabLabel(labelElement);
                });

                labelElement.appendChild(manager.getElement());
                labelElement.classList.add("closeable");
                CloseIconManager.setManager(labelElement, manager);
            }

            labelElement.addEventListener("contextmenu", e => this.showTabLabelMenu(e, labelElement));

            return labelElement;
        }

        private showTabLabelMenu(e: MouseEvent, labelElement: HTMLElement) {

            e.preventDefault();

            const menu = new Menu();

            this.fillTabMenu(menu, labelElement);

            menu.create(e);
        }

        protected fillTabMenu(menu: Menu, labelElement: HTMLElement) {
            // nothing
        }

        setTabCloseIcons(labelElement: HTMLElement, icon: IImage, overIcon: IImage) {

            const manager = CloseIconManager.getManager(labelElement);

            if (manager) {

                manager.setIcon(icon);
                manager.setOverIcon(overIcon);
                manager.repaint();
            }
        }

        closeTab(content: controls.Control) {

            const label = this.getLabelFromContent(content);

            if (label) {

                this.closeTabLabel(label);
            }
        }

        closeAll() {

            this._titleBarElement.innerHTML = "";
            this._contentAreaElement.innerHTML = "";
            this._selectionHistoryLabelElement = [];
        }

        protected closeTabLabel(labelElement: HTMLElement): void {

            {
                const content = TabPane.getContentFromLabel(labelElement);

                const event = new CustomEvent(EVENT_TAB_CLOSED, {
                    detail: content,
                    cancelable: true
                });

                if (!this.dispatchEvent(event)) {
                    return;
                }
            }

            const i = this._selectionHistoryLabelElement.indexOf(labelElement);

            if (i >= 0) {

                this._selectionHistoryLabelElement.splice(i, 1);
            }

            this._titleBarElement.removeChild(labelElement);
            const contentArea = labelElement["__contentArea"] as HTMLElement;
            this._contentAreaElement.removeChild(contentArea);

            let toSelectLabel: HTMLElement = null;

            const selectedLabel = this.getSelectedLabelElement();

            if (selectedLabel === labelElement) {

                this._selectionHistoryLabelElement.pop();
                const nextInHistory = this._selectionHistoryLabelElement.pop();

                if (nextInHistory) {

                    toSelectLabel = nextInHistory;
                }
            }

            if (!toSelectLabel) {

                if (this._titleBarElement.childElementCount > 0) {

                    toSelectLabel = (this._titleBarElement.firstChild as HTMLElement);
                }
            }

            if (toSelectLabel) {

                this.selectTab(toSelectLabel);
            }
        }

        setTabTitle(content: Control, title: string, icon?: IImage) {

            for (let i = 0; i < this._titleBarElement.childElementCount; i++) {

                const label = this._titleBarElement.children.item(i) as HTMLElement;

                const content2 = TabPane.getContentFromLabel(label);

                if (content2 === content) {

                    const iconElement: HTMLCanvasElement = label.firstChild as HTMLCanvasElement;
                    const textElement = iconElement.nextSibling as HTMLElement;

                    const manager = TabIconManager.getManager(iconElement);
                    manager.setIcon(icon);
                    manager.repaint();

                    textElement.innerHTML = title;
                }
            }
        }

        static isTabCloseIcon(element: HTMLElement) {
            return element.classList.contains("TabPaneLabelCloseIcon");
        }

        static isTabLabel(element: HTMLElement) {
            return element.classList.contains("TabPaneLabel");
        }

        getLabelFromContent(content: Control) {

            for (let i = 0; i < this._titleBarElement.childElementCount; i++) {

                const label = this._titleBarElement.children.item(i) as HTMLElement;

                const content2 = TabPane.getContentFromLabel(label);

                if (content2 === content) {
                    return label;
                }
            }

            return null;
        }

        private static getContentAreaFromLabel(labelElement: HTMLElement): HTMLElement {
            return labelElement["__contentArea"];
        }

        static getContentFromLabel(labelElement: HTMLElement) {
            return Control.getControlOf(this.getContentAreaFromLabel(labelElement).firstChild as HTMLElement);
        }

        selectTabWithContent(content: Control) {

            const label = this.getLabelFromContent(content);

            if (label) {
                this.selectTab(label);
            }
        }

        protected selectTab(toSelectLabel: HTMLElement): void {

            const selectedLabel = this._selectionHistoryLabelElement.pop();

            if (selectedLabel) {

                if (selectedLabel === toSelectLabel) {

                    this._selectionHistoryLabelElement.push(selectedLabel);

                    return;
                }

                selectedLabel.classList.remove("selected");
                const selectedContentArea = TabPane.getContentAreaFromLabel(selectedLabel);
                selectedContentArea.classList.remove("selected");
            }

            toSelectLabel.classList.add("selected");
            const toSelectContentArea = TabPane.getContentAreaFromLabel(toSelectLabel);
            toSelectContentArea.classList.add("selected");
            this._selectionHistoryLabelElement.push(toSelectLabel);

            this.dispatchEvent(new CustomEvent(EVENT_TAB_SELECTED, {
                detail: TabPane.getContentFromLabel(toSelectLabel)
            }));

            this.dispatchLayoutEvent();
        }

        getSelectedTabContent(): Control {

            const label = this.getSelectedLabelElement();

            if (label) {

                const area = TabPane.getContentAreaFromLabel(label);

                return Control.getControlOf(area.firstChild as HTMLElement);
            }

            return null;
        }

        isSelectedLabel(labelElement: HTMLElement) {
            return labelElement === this.getSelectedLabelElement();
        }

        getContentList(): controls.Control[] {

            const list: controls.Control[] = [];

            for (let i = 0; i < this._titleBarElement.children.length; i++) {

                const label = this._titleBarElement.children.item(i) as HTMLElement;

                const content = TabPane.getContentFromLabel(label);

                list.push(content);
            }

            return list;
        }

        private getSelectedLabelElement(): HTMLElement {

            return this._selectionHistoryLabelElement.length > 0 ?
                this._selectionHistoryLabelElement[this._selectionHistoryLabelElement.length - 1]
                : null;
        }
    }

}