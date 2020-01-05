namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;
    import ide = colibri.ui.ide;
    import io = colibri.core.io;

    export class DropManager {

        private _editor: SceneEditor;

        constructor(editor: SceneEditor) {

            this._editor = editor;

            const canvas = this._editor.getOverlayLayer().getCanvas();
            canvas.addEventListener("dragover", e => this.onDragOver(e));
            canvas.addEventListener("drop", e => this.onDragDrop_async(e));
        }

        async onDragDrop_async(e: DragEvent) {

            const dataArray = controls.Controls.getApplicationDragDataAndClean();

            if (this.acceptsDropDataArray(dataArray)) {

                e.preventDefault();

                const sprites = await this.createWithDropEvent(e, dataArray);

                this._editor.getUndoManager().add(new undo.AddObjectsOperation(this._editor, sprites));

                this._editor.setSelection(sprites);

                this._editor.refreshOutline();

                this._editor.setDirty(true);

                this._editor.repaint();

                ide.Workbench.getWorkbench().setActivePart(this._editor);
            }
        }

        private async createWithDropEvent(e: DragEvent, dropAssetArray: any[]) {

            const scene = this._editor.getGameScene();

            const sceneMaker = scene.getMaker();

            const exts = ScenePlugin.getInstance().getObjectExtensions();

            const nameMaker = new ide.utils.NameMaker(obj => {
                return (obj as sceneobjects.SceneObject).getEditorSupport().getLabel();
            });

            scene.visit(obj => nameMaker.update([obj]));

            const worldPoint = scene.getCamera().getWorldPoint(e.offsetX, e.offsetY);
            const x = Math.floor(worldPoint.x);
            const y = Math.floor(worldPoint.y);

            for (const data of dropAssetArray) {

                const ext = ScenePlugin.getInstance().getLoaderUpdaterForAsset(data);

                if (ext) {

                    await ext.updateLoader(scene, data);
                }
            }

            const sprites: sceneobjects.SceneObject[] = [];

            for (const data of dropAssetArray) {

                if (data instanceof io.FilePath) {

                    if (sceneMaker.isPrefabFile(data)) {

                        const sprite = await sceneMaker.createPrefabInstanceWithFile(data);

                        const transformComp = sprite.getEditorSupport()
                            .getComponent(sceneobjects.TransformComponent) as sceneobjects.TransformComponent;

                        if (transformComp) {

                            const obj = transformComp.getObject();
                            obj.x = x;
                            obj.y = y;
                        }

                        if (sprite) {

                            sprites.push(sprite);
                        }

                        continue;
                    }
                }

                for (const ext of exts) {

                    if (ext.acceptsDropData(data)) {

                        const sprite = ext.createSceneObjectWithAsset({
                            x: x,
                            y: y,
                            asset: data,
                            scene: scene
                        });

                        sprites.push(sprite);
                    }
                }
            }

            for (const sprite of sprites) {

                const support = sprite.getEditorSupport();

                let label = support.isPrefabInstance() ? support.getPrefabName() : support.getLabel();

                label = core.code.formatToValidVarName(label);

                label = nameMaker.makeName(label);

                support.setLabel(label);
            }

            return sprites;
        }

        private onDragOver(e: DragEvent) {

            if (this.acceptsDropDataArray(controls.Controls.getApplicationDragData())) {
                e.preventDefault();
            }
        }

        private acceptsDropData(data: any): boolean {

            if (data instanceof io.FilePath) {

                if (this._editor.getSceneMaker().isPrefabFile(data)) {
                    return true;
                }
            }

            for (const ext of ScenePlugin.getInstance().getObjectExtensions()) {

                if (ext.acceptsDropData(data)) {
                    return true;
                }
            }

            return false;
        }

        private acceptsDropDataArray(dataArray: any[]) {

            if (!dataArray) {
                return false;
            }

            for (const item of dataArray) {

                if (!this.acceptsDropData(item)) {
                    return false;
                }
            }

            return true;
        }
    }
}