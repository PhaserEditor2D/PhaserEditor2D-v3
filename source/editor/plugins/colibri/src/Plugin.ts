namespace colibri {

    export abstract class Plugin {

        private _id: string;
        private _iconCache: Map<string, ui.controls.IconImage>;
        private _loadIconsFromAtlas: boolean;
        private _atlasImage: ui.controls.IImage;
        private _atlasData: ui.controls.IAtlasData;

        constructor(id: string, loadIconsFromAtlas = false) {

            this._id = id;
            this._loadIconsFromAtlas = loadIconsFromAtlas;

            this._iconCache = new Map();
        }

        getId() {
            return this._id;
        }

        starting(): Promise<void> {

            return Promise.resolve();
        }

        started(): Promise<void> {

            return Promise.resolve();
        }

        async preloadAtlasIcons() {

            if (!this._loadIconsFromAtlas) {

                return;
            }

            const imgUrl = this.getPluginURL("icons/atlas.png");

            this._atlasImage = ui.controls.Controls
                .getImage(imgUrl, this.getId() + ".atlas");

            await this._atlasImage.preload();

            this._atlasData = await this.getJSON("icons/atlas.json");
        }

        registerExtensions(registry: ExtensionRegistry): void {

            // nothing
        }

        getIconDescriptor(name: string) {

            return new ui.controls.IconDescriptor(this, name);
        }

        getIcon(name: string, common: boolean = false) {

            if (this._iconCache.has(name)) {

                return this._iconCache.get(name);
            }

            let lightImage: ui.controls.IImage;
            let darkImage: ui.controls.IImage;

            if (this._loadIconsFromAtlas) {

                if (common) {

                    darkImage = new ui.controls.AtlasImage(this,
                        this.getIconsAtlasFrameName(name, "common"));

                    lightImage = darkImage;

                } else {

                    darkImage = new ui.controls.AtlasImage(this,
                        this.getIconsAtlasFrameName(name, "dark"));

                    lightImage = new ui.controls.AtlasImage(this,
                        this.getIconsAtlasFrameName(name, "light"));
                }

            } else {

                if (common) {

                    darkImage = this.getThemeIcon(name, "common");
                    lightImage = darkImage;

                } else {

                    darkImage = this.getThemeIcon(name, "dark");
                    lightImage = this.getThemeIcon(name, "light");
                }
            }

            const image = new ui.controls.IconImage(lightImage, darkImage);

            this._iconCache.set(name, image);

            return image;
        }

        getIconsAtlasImage() {

            return this._atlasImage;
        }

        getFrameDataFromIconsAtlas(frame: string) {

            const frameData = this._atlasData.frames[frame];

            if (!frameData) {

                throw new Error(`Atlas frame "${frame}" not found.`);
            }

            return frameData;
        }

        private getThemeIcon(name: string, theme: "dark" | "light" | "common") {

            const iconPath = this.getIconsAtlasFrameName(name, theme);

            const url = this.getPluginURL(`icons/${iconPath}`);

            const id = theme + "." + name;

            return ui.controls.Controls.getImage(url, id);
        }

        private getIconsAtlasFrameName(name: string, theme: "dark" | "light" | "common") {

            const x2 = ui.controls.ICON_SIZE === 32;

            return `${theme}/${name}${x2 ? "@2x" : ""}.png`;
        }

        getPluginURL(pathInPlugin: string) {

            return `/editor/app/plugins/${this.getId()}/${pathInPlugin}`;
        }

        getResourceURL(pathInPlugin: string) {

            return `${this.getPluginURL(pathInPlugin)}?v=${colibri.CACHE_VERSION}`;
        }

        // getResourceURL(pathInPlugin: string, version?: string) {

        //     if (version === undefined) {

        //         version = Date.now().toString();
        //     }

        //     return `${this.getPluginURL(pathInPlugin)}?v=${version}`;
        // }

        async getJSON(pathInPlugin: string) {

            const url = this.getResourceURL(pathInPlugin);

            const result = await fetch(url, {
                method: "GET",
                cache: "force-cache"
            });

            const data = await result.json();

            return data;
        }

        async getString(pathInPlugin: string) {

            const result = await fetch(this.getResourceURL(pathInPlugin), {
                method: "GET",
                cache: "force-cache"
            });

            const data = await result.text();

            return data;
        }
    }
}