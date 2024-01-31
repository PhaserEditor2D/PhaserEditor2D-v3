/// <reference path="./Control.ts"/>

namespace colibri.ui.controls {

    export enum PreloadResult {
        NOTHING_LOADED,
        RESOURCES_LOADED
    }

    export const DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;
    export const DEVICE_PIXEL_RATIO_x2 = DEVICE_PIXEL_RATIO > 1;
    export const ICON_SIZE = DEVICE_PIXEL_RATIO_x2 ? 32 : 16;
    export const RENDER_ICON_SIZE = 16;

    export type IImageOrCanvas = HTMLImageElement|HTMLCanvasElement;

    export class Controls {

        private static _images: Map<string, IImage> = new Map();
        private static _applicationDragData: any[] = null;
        private static _mouseDownElement: HTMLElement;
        private static _dragCanvas: HTMLCanvasElement;

        static init() {

            window.addEventListener("mousedown", e => {

                this._mouseDownElement = e.target as any;
            });

            this.initDragCanvas();
        }

        static addTabStop() {

            // this prevents Safari to include the address bar in the tab order.

            const tabStop = document.createElement("input");
            tabStop.style.position = "fixed";
            tabStop.style.left = "-1000px";
            tabStop.onfocus = () => {

                console.log("catch last tabIndex, focus first element");
                (document.getElementsByTagName("input")[0] as HTMLElement).focus();
            };

            document.body.appendChild(tabStop);
        }

        static getMouseDownElement() {

            return this._mouseDownElement;
        }

        static adjustCanvasDPI(canvas: HTMLCanvasElement, widthHint = 1, heightHint = 1) {

            const dpr = window.devicePixelRatio || 1;

            if (dpr === 1) {

                return;
            }

            const rect = canvas.getBoundingClientRect();

            const width = rect.width === 0 ? widthHint : rect.width;
            const height = rect.height === 0 ? heightHint : rect.height;

            canvas.width = width * dpr;
            canvas.height = height * dpr;

            const ctx = canvas.getContext("2d");

            ctx.scale(dpr, dpr);

            return ctx;
        }

        private static _charWidthMap: Map<string, number> = new Map();
        private static _textWidthMap: Map<string, number> = new Map();

        static measureTextWidth(context: CanvasRenderingContext2D, label: string) {

            const font = FONT_FAMILY + controls.getCanvasFontHeight();

            const textKey = font + "@" + label;

            let width = 0;

            if (this._textWidthMap.has(textKey)) {

                width = this._textWidthMap.get(textKey);

            } else {

                for (const c of label) {

                    const key = font + "@" + c;

                    let charWidth = 0;

                    if (this._charWidthMap.has(key)) {

                        charWidth = this._charWidthMap.get(key);

                    } else {

                        charWidth = context.measureText(c).width;
                        this._charWidthMap.set(key, charWidth);
                    }

                    width += charWidth;
                }

                this._textWidthMap.set(textKey, width);
            }

            return width;
        }

        static setDragEventImage(e: DragEvent, render: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {

            const canvas = this._dragCanvas;

            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            render(ctx, canvas.width, canvas.height);

            e.dataTransfer.setDragImage(canvas, 10, 10);
        }

        private static initDragCanvas() {

            const canvas = document.createElement("canvas");
            canvas.setAttribute("id", "__drag__canvas");
            canvas.style.imageRendering = "crisp-edges";
            canvas.width = 64;
            canvas.height = 64;
            canvas.style.width = canvas.width + "px";
            canvas.style.height = canvas.height + "px";
            canvas.style.position = "fixed";
            canvas.style.left = "0px";
            document.body.appendChild(canvas);

            this._dragCanvas = canvas;
        }

        private static _isSafari = navigator.vendor.toLowerCase().indexOf("apple") >= 0;

        static isSafariBrowser() {

            return this._isSafari;
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

        static async resolveAll(list: Array<Promise<PreloadResult>>): Promise<PreloadResult> {

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

        static getImage(url: string, id: string, appendVersion = true): IImage {

            if (Controls._images.has(id)) {

                return Controls._images.get(id);
            }

            if (appendVersion) {

                url += "?v=" + PRODUCT_VERSION;
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

        static LIGHT_THEME: ITheme = {
            id: "light",
            displayName: "Light",
            classList: ["light"],
            dark: false,
            sceneBackground: "#8e8e8e",
            viewerSelectionBackground: "#4242ff",
            viewerSelectionForeground: "#f0f0f0",
            viewerForeground: "#2f2f2f",
        };

        static DARK_THEME: ITheme = {
            id: "dark",
            displayName: "Dark",
            classList: ["dark"],
            dark: true,
            sceneBackground: "#3f3f3f",
            viewerSelectionBackground: "#f0a050", // "#101ea2",//"#8f8f8f",
            viewerSelectionForeground: "#0e0e0e",
            viewerForeground: "#f0f0f0",
        };

        static DEFAULT_THEME = Controls.DARK_THEME;

        static _theme: ITheme = Controls.DEFAULT_THEME;

        static setTheme(theme: ITheme) {

            const classList = document.getElementsByTagName("html")[0].classList;

            classList.remove(...this._theme.classList);
            classList.add(...theme.classList);

            this._theme = theme;

            Platform.getWorkbench().eventThemeChanged.fire(this._theme);

            localStorage.setItem("colibri.theme.id", theme.id);
            localStorage.setItem("colibri.theme.classList", theme.classList.join(","));
        }

        static preloadTheme() {

            let id = localStorage.getItem("colibri.theme.id");

            if (!id) {

                id = Controls.DEFAULT_THEME.id;
            }

            let tokens = [id];

            const str = localStorage.getItem("colibri.theme.classList");

            if (str) {

                tokens = str.split(",");
            }

            const documentClassList = document.getElementsByTagName("html")[0].classList;

            documentClassList.add(...tokens);
        }

        static restoreTheme() {

            const id = localStorage.getItem("colibri.theme.id");

            let theme = null;

            if (id) {

                theme = colibri.Platform
                    .getExtensions<colibri.ui.ide.themes.ThemeExtension>(colibri.ui.ide.themes.ThemeExtension.POINT_ID)
                    .map(e => e.getTheme())
                    .find(t => t.id === id);
            }

            controls.Controls.setTheme(theme ?? controls.Controls.DEFAULT_THEME);
        }

        static getTheme() {
            return this._theme;
        }

        static drawRoundedRect(
            ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number,
            stroke = false, topLeft = 5, topRight = 5, bottomRight = 5, bottomLeft = 5) {

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
            ctx.fill();

            if (stroke) {

                ctx.stroke();
            }

            ctx.restore();
        }

        static createBlobFromImage(img: controls.IImageOrCanvas): Promise<Blob> {

            return new Promise((resolve, reject) => {
    
                let canvas: HTMLCanvasElement;
    
                if (img instanceof HTMLCanvasElement) {
    
                    canvas = img;
    
                } else {
    
                    canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    canvas.style.width = img.width + "px";
                    canvas.style.height = img.height + "px";
    
                    const ctx = canvas.getContext("2d");
                    ctx.imageSmoothingEnabled = false;
    
                    ctx.drawImage(img, 0, 0);
                }
    
                canvas.toBlob((blob) => {
    
                    resolve(blob);
    
                }, 'image/png');
            });
        }
    
        static createImageFromBlob(blob: Blob) {
    
            const img = document.createElement("img");
    
            img.src = URL.createObjectURL(blob);
    
            return img;
        }
    }
}