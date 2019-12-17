/// <reference path="./Control.ts"/>

namespace colibri.ui.controls {

    export const EVENT_SELECTION_CHANGED = "selectionChanged";
    export const EVENT_THEME_CHANGED = "themeChanged";

    export enum PreloadResult {
        NOTHING_LOADED,
        RESOURCES_LOADED
    }

    export const ICON_CONTROL_TREE_COLLAPSE = "tree-collapse";
    export const ICON_CONTROL_TREE_EXPAND = "tree-expand";
    export const ICON_CONTROL_CLOSE = "close";
    export const ICON_CONTROL_DIRTY = "dirty";
    export const ICON_SIZE = 16;

    const ICONS = [
        ICON_CONTROL_TREE_COLLAPSE,
        ICON_CONTROL_TREE_EXPAND,
        ICON_CONTROL_CLOSE,
        ICON_CONTROL_DIRTY
    ];

    export class Controls {

        private static _images: Map<String, IImage> = new Map();
        private static _applicationDragData: any[] = null;

        static setDragEventImage(e: DragEvent, render: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
            let canvas = <HTMLCanvasElement>document.getElementById("__drag__canvas");
            if (!canvas) {
                canvas = document.createElement("canvas");
                canvas.setAttribute("id", "__drag__canvas");
                canvas.style.imageRendering = "crisp-edges";
                canvas.width = 64;
                canvas.height = 64;
                canvas.style.width = canvas.width + "px";
                canvas.style.height = canvas.height + "px";
                canvas.style.position = "fixed";
                canvas.style.left = -100 + "px";
                document.body.appendChild(canvas);
            }

            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            render(ctx, canvas.width, canvas.height);

            e.dataTransfer.setDragImage(canvas, 10, 10);
        }

        static getApplicationDragData() {
            return this._applicationDragData;
        }

        static getApplicationDragDataAndClean() {
            const data = this._applicationDragData;
            this._applicationDragData = null;
            return data;
        }

        static setApplicationDragData(data: any[]) {
            this._applicationDragData = data;
        }


        static async resolveAll(list: Promise<PreloadResult>[]): Promise<PreloadResult> {

            let result = PreloadResult.NOTHING_LOADED;

            for (const promise of list) {

                const result2 = await promise;

                if (result2 === PreloadResult.RESOURCES_LOADED) {
                    result = PreloadResult.RESOURCES_LOADED;
                }
            }

            return Promise.resolve(result);
        }

        static resolveResourceLoaded() {
            return Promise.resolve(PreloadResult.RESOURCES_LOADED);
        }

        static resolveNothingLoaded() {
            return Promise.resolve(PreloadResult.NOTHING_LOADED);
        }

        static async preload() {
            return Promise.all(ICONS.map(icon => this.getIcon(icon).preload()));
        }

        private static getImage(url: string, id: string): IImage {
            if (Controls._images.has(id)) {
                return Controls._images.get(id);
            }

            const img = new DefaultImage(new Image(), url);

            Controls._images.set(id, img);

            return img;
        }

        static openUrlInNewPage(url: string) {

            const element = document.createElement("a");

            element.href = url;
            element.target = "blank";

            document.body.append(element);

            element.click();

            element.remove();
        }

        static getIcon(name: string, baseUrl: string = "plugins/colibri/ui/controls/images"): IImage {

            const url = `static/${baseUrl}/${ICON_SIZE}/${name}.png`;

            return Controls.getImage(url, name);
        }

        static createIconElement(icon?: IImage, size: number = ICON_SIZE) {

            const canvas = document.createElement("canvas");

            canvas.width = canvas.height = size;
            canvas.style.width = canvas.style.height = size + "px";

            const context = canvas.getContext("2d");

            context.imageSmoothingEnabled = false;

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (icon) {
                icon.paint(context, 0, 0, canvas.width, canvas.height, true);
            }

            return canvas;
        }

        static LIGHT_THEME: Theme = {
            id: "light",
            displayName: "Light",
            classList: ["light"],
            dark: false,
            viewerSelectionBackground: "#4242ff",
            //treeItemSelectionBackground: "#525252",
            viewerSelectionForeground: "#f0f0f0",
            viewerForeground: "#000000",
        };

        static DARK_THEME: Theme = {
            id: "dark",
            displayName: "Dark",
            classList: ["dark"],
            dark: true,
            viewerSelectionBackground: "#f0a050", //"#101ea2",//"#8f8f8f",
            viewerSelectionForeground: "#0e0e0e",
            viewerForeground: "#f0f0f0",
        };

        static _theme: Theme = Controls.DARK_THEME;

        static switchTheme(): Theme {

            const newTheme = this._theme === this.LIGHT_THEME ? this.DARK_THEME : this.LIGHT_THEME;

            this.setTheme(newTheme);

            return newTheme;
        }

        static setTheme(theme: Theme) {

            const classList = document.getElementsByTagName("html")[0].classList;

            classList.remove(...this._theme.classList);
            classList.add(...theme.classList);

            this._theme = theme;

            window.dispatchEvent(new CustomEvent(EVENT_THEME_CHANGED, { detail: this._theme }));
        }

        static getTheme() {
            return this._theme;
        }

        static drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, topLeft = 5, topRight = 5, bottomRight = 5, bottomLeft = 5) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x + topLeft, y);
            ctx.lineTo(x + w - topRight, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + topRight);
            ctx.lineTo(x + w, y + h - bottomRight);
            ctx.quadraticCurveTo(x + w, y + h, x + w - bottomRight, y + h);
            ctx.lineTo(x + bottomLeft, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - bottomLeft);
            ctx.lineTo(x, y + topLeft);
            ctx.quadraticCurveTo(x, y, x + topLeft, y);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

    }
}