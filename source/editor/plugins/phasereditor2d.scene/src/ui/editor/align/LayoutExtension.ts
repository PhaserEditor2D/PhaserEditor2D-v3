namespace phasereditor2d.scene.ui.editor.layout {

    export interface IAlignActionArgs {
        positions: Array<{ x: number, y: number, size: { x: number, y: number } }>,
        border: { x: number, y: number, size: { x: number, y: number } }
    }

    export interface IAlignExtensionConfig {
        name: string;
        group: string;
        action?: (args: IAlignActionArgs) => void;
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

        performAlign(editor: SceneEditor) {

            const transform = sceneobjects.TransformComponent;

            const sprites: Phaser.GameObjects.Sprite[] = editor.getSelectedGameObjects()

                .filter(obj => obj.getEditorSupport().hasComponent(transform)) as any[]

            const positions = sprites.map(sprite => ({
                x: sprite.x - sprite.originX * sprite.displayWidth,
                y: sprite.y - sprite.originY * sprite.displayHeight,
                size: {
                    x: sprite.displayWidth,
                    y: sprite.displayHeight
                }
            }));

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

                this._config.action({ border, positions });

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