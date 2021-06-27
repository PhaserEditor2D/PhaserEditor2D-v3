namespace phasereditor2d.scene.ui.editor.layout {

    import controls = colibri.ui.controls;

    export interface ILayoutIPosition {
        x: number;
        y: number;
        size: { x: number, y: number };
    }

    export interface IAlignActionArgs {
        positions: ILayoutIPosition[],
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
        icon: controls.IconImage
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

        async performLayout(editor: SceneEditor) {

            const params = await editor.getLayoutToolsManager().showParametersPane(this);

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

            const spritePosMap = new Map<any, ILayoutIPosition>();

            for (let i = 0; i < sprites.length; i++) {

                spritePosMap.set(sprites[i], positions[i]);
            }

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

                for (const sprite of sprites) {

                    const pos = spritePosMap.get(sprite);
                    sprite.x = pos.x + sprite.originX * sprite.displayWidth;
                    sprite.y = pos.y + sprite.originY * sprite.displayHeight;
                }
            });

            editor.getUndoManager().add(op);
        }
    }
}