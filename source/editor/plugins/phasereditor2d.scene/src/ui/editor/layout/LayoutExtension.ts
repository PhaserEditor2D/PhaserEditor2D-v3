namespace phasereditor2d.scene.ui.editor.layout {

    import controls = colibri.ui.controls;

    export interface IAlignActionArgs {
        positions: Array<{ x: number, y: number, size: { x: number, y: number } }>,
        border: { x: number, y: number, size: { x: number, y: number } },
        params: any;
    }

    export interface IAlignActionParam {
        label: string;
        name: string;
        defaultValue: number;
    }

    export interface IAlignExtensionConfig {
        name: string;
        group: string;
        action?: (args: IAlignActionArgs) => void;
        params?: IAlignActionParam[];
    }

    export class LayoutExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.scene.ui.editor.layout.LayoutExtension"

        private _config: IAlignExtensionConfig;

        constructor(config: IAlignExtensionConfig) {
            super(LayoutExtension.POINT_ID);

            this._config = config;
        }

        getConfig() {

            return this._config;
        }

        protected async requestParameters() {

            if (!this._config.params || this._config.params.length === 0) {

                return;
            }

            const dlg = new controls.dialogs.FormDialog();

            dlg.create();

            dlg.setTitle(this._config.group + " - " + this._config.name);

            const form = dlg.getBuilder();

            const elementMap: Map<string, HTMLInputElement> = new Map();

            for (const param of this._config.params) {

                form.createLabel(param.label);

                const text = form.createText();

                text.value = param.defaultValue.toString();

                elementMap.set(param.name, text);
            }

            return new Promise((resolve, reject) => {

                dlg.addButton("Apply", () => {

                    const result = {};

                    for (const key of elementMap.keys()) {

                        const text = elementMap.get(key);
                        const val = Number.parseFloat(text.value);

                        result[key] = val;
                    }

                    resolve(result);

                    dlg.close();
                });

                dlg.addCancelButton(() => {

                    resolve(null);
                });
            });

        }

        async performAlign(editor: SceneEditor) {

            const params = await this.requestParameters();

            const transform = sceneobjects.TransformComponent;

            const sprites: Phaser.GameObjects.Sprite[] = editor.getSelectedGameObjects()

                .filter(obj => obj.getEditorSupport().hasComponent(transform)) as any[]

            const positions = sprites.map(sprite => {

                if (sprite instanceof sceneobjects.Container) {

                    const b = sprite.getBounds();

                    return {
                        x: sprite.x,
                        y: sprite.y,
                        size: {
                            x: b.width,
                            y: b.height
                        }
                    }
                }

                return {
                    x: sprite.x - sprite.originX * sprite.displayWidth,
                    y: sprite.y - sprite.originY * sprite.displayHeight,
                    size: {
                        x: sprite.displayWidth,
                        y: sprite.displayHeight
                    }
                }
            });

            const settings = editor.getScene().getSettings();

            const border = {
                x: settings.borderX,
                y: settings.borderY,
                size: {
                    x: settings.borderWidth,
                    y: settings.borderHeight
                }
            };

            const op = new undo.SimpleSceneSnapshotOperation(editor, () => {

                this._config.action({ border, positions, params });

                for (let i = 0; i < sprites.length; i++) {

                    const sprite = sprites[i];
                    const pos = positions[i];
                    sprite.x = pos.x + sprite.originX * sprite.displayWidth;
                    sprite.y = pos.y + sprite.originY * sprite.displayHeight;
                }
            });

            editor.getUndoManager().add(op);
        }
    }
}