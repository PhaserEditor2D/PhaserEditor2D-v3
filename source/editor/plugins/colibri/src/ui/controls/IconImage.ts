namespace colibri.ui.controls {

    export class IconImage implements IImage {

        private _plugin: colibri.Plugin;
        private _name: string;
        private _darkImage: IImage;
        private _lightImage: IImage;

        constructor(plugin: colibri.Plugin, name: string, common: boolean) {

            this._plugin = plugin;
            this._name = name;

            if (common) {

                this._darkImage = plugin.getThemeIcon(name, "common");
                this._lightImage = this._darkImage;

            } else {

                this._darkImage = plugin.getThemeIcon(name, "dark");
                this._lightImage = plugin.getThemeIcon(name, "light");
            }
        }

        getPlugin() {

            return this._plugin;
        }

        getName() {

            return this._name;
        }

        getNegativeThemeImage() {

            const img = this.getThemeImage();

            if (img === this._lightImage) {

                return this._darkImage;
            }

            return this._lightImage;
        }

        getThemeImage() {

            if (controls.Controls.getTheme().dark) {

                return this._darkImage;
            }

            return this._lightImage;
        }

        paint(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, center: boolean): void {

            this.getThemeImage().paint(context, x, y, w, h, center);
        }

        paintFrame(context: CanvasRenderingContext2D, srcX: number, srcY: number, scrW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void {

            this.getThemeImage().paintFrame(context, srcX, srcY, scrW, srcH, dstX, dstY, dstW, dstH);
        }

        async preload(): Promise<PreloadResult> {

            await this._darkImage.preload();

            return await this._lightImage.preload();
        }

        getWidth(): number {

            return this.getThemeImage().getWidth();
        }

        getHeight(): number {

            return this.getThemeImage().getHeight();
        }

        async preloadSize(): Promise<PreloadResult> {

            await this._darkImage.preloadSize();

            return await this._lightImage.preloadSize();
        }
    }
}