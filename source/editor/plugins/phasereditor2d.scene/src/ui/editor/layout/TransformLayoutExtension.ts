namespace phasereditor2d.scene.ui.editor.layout {

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

    export interface ITransformLayoutExtensionConfig extends ILayoutExtensionConfig {
        action?: (args: IAlignActionArgs) => void;
        params?: IAlignActionParam[];
    }


    export class TransformLayoutExtension extends LayoutExtension<ITransformLayoutExtensionConfig> {

        constructor(config: ITransformLayoutExtensionConfig) {
            super(config);
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

                const { displayOriginX, displayOriginY } = obj.getEditorSupport().computeDisplayOrigin();
                const {scaleX, scaleY} = sprite;

                return {
                    x: sprite.x - displayOriginX * scaleX,
                    y: sprite.y - displayOriginY * scaleY,
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

                this.getConfig().action({ border, positions, params });

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

                        const { displayOriginX, displayOriginY } = sprite.getEditorSupport().computeDisplayOrigin();
                        const { scaleX, scaleY } = sprite;

                        sprite.x = pos.x + displayOriginX * scaleX;
                        sprite.y = pos.y + displayOriginY * scaleY;
                    }
                }
            });

            editor.getUndoManager().add(op);
        }
    }
}