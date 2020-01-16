namespace colibri.ui.controls {

    export interface IMenuExtensionConfig {
        command?: string;
        separator?: boolean;
    }

    export class MenuExtension extends Extension {

        static POINT_ID = "colibri.ui.controls.menus";

        private _menuId: string;
        private _configList: IMenuExtensionConfig[];

        constructor(menuId: string, ...configs: IMenuExtensionConfig[]) {
            super(MenuExtension.POINT_ID);

            this._menuId = menuId;
            this._configList = configs;
        }

        getMenuId() {
            return this._menuId;
        }

        fillMenu(menu: controls.Menu) {

            for (const config of this._configList) {

                if (config.separator) {

                    menu.addSeparator();

                } else if (config.command) {

                    menu.addCommand(config.command);
                }
            }
        }
    }
}