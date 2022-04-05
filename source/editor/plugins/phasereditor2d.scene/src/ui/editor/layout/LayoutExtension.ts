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

    export interface ILayoutExtensionConfig {
        name: string;
        group: string;
        action?: (args: IAlignActionArgs) => void;
        params?: IAlignActionParam[];
        icon: controls.IconImage
    }

    export class LayoutExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.scene.ui.editor.layout.LayoutExtension"

        private _config: ILayoutExtensionConfig;

        constructor(config: ILayoutExtensionConfig) {
            super(LayoutExtension.POINT_ID);

            this._config = config;
        }

        getConfig() {

            return this._config;
        }

        async performLayout(editor: SceneEditor) {

            const params = await editor.getLayoutToolsManager().showParametersPane(this);

            const transform = sceneobjects.TransformComponent;

            const sprites: sceneobjects.ISceneGameObject[] = editor.getSelectedGameObjects()

                .filter(obj => obj.getEditorSupport().hasComponent(transform)) as any[];

            const unlocked = await editor.confirmUnlockProperty([
                transform.x,
                transform.y,
            ], "position", sceneobjects.TransformSection.SECTION_ID);

            if (!unlocked) {

                return;
            }

            const positions = sprites.map(obj => {

                if (obj instanceof sceneobjects.Container) {

                    const b = obj.getBounds();

                    const originX = (obj.x - b.x) / b.width;
                    const originY = (obj.y - b.y) / b.height;

                    return {
                        x: obj.x - originX * b.width,
                        y: obj.y - originY * b.height,
                        size: {
                            x: b.width,
                            y: b.height
                        }
                    }
                }

                const sprite = obj as sceneobjects.Sprite;

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

                for (const obj of sprites) {

                    const pos = spritePosMap.get(obj);

                    if (obj instanceof sceneobjects.Container) {

                        const b = obj.getBounds();

                        const originX = (obj.x - b.x) / b.width;
                        const originY = (obj.y - b.y) / b.height;
                        obj.x = pos.x + originX * b.width;
                        obj.y = pos.y + originY * b.height;

                    } else {

                        const sprite = obj as sceneobjects.Sprite;

                        sprite.x = pos.x + sprite.originX * sprite.displayWidth;
                        sprite.y = pos.y + sprite.originY * sprite.displayHeight;
                    }
                }
            });

            editor.getUndoManager().add(op);
        }
    }
}