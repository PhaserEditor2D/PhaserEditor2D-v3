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

            if (this.acceptDropDataArray(dataArray)) {

                e.preventDefault();

                this._editor.getUndoManager().add(new undo.CreateObjectWithAssetOperation(this._editor, e, dataArray));

                await this._editor.refreshDependenciesHash();

                ide.Workbench.getWorkbench().setActivePart(this._editor);
            }
        }

        async createWithDropEvent(e: DragEvent, dropAssetArray: any[]) {

            const scene = this._editor.getScene();

            const sceneMaker = scene.getMaker();

            const exts = ScenePlugin.getInstance().getObjectExtensions();

            const nameMaker = new ide.utils.NameMaker(obj => {
                return (obj as sceneobjects.ISceneObject).getEditorSupport().getLabel();
            });

            scene.visit(obj => nameMaker.update([obj]));

            const worldPoint = scene.getCamera().getWorldPoint(e.offsetX, e.offsetY);
            const x = Math.floor(worldPoint.x);
            const y = Math.floor(worldPoint.y);

            const sceneFinder = ScenePlugin.getInstance().getSceneFinder();

            for (const data of dropAssetArray) {

                if (data instanceof io.FilePath) {

                    const file = data;

                    if (sceneMaker.isPrefabFile(file)) {

                        const sceneData = sceneFinder.getSceneData(file);

                        if (sceneData) {

                            await sceneMaker.updateSceneLoader(sceneData);
                        }
                    }
                }
            }

            for (const data of dropAssetArray) {

                const ext = ScenePlugin.getInstance().getLoaderUpdaterForAsset(data);

                if (ext) {

                    await ext.updateLoader(scene, data);
                }
            }

            const sprites: sceneobjects.ISceneObject[] = [];

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

                        break;
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

            if (this.acceptDropDataArray(controls.Controls.getApplicationDragData())) {
                e.preventDefault();
            }
        }

        private acceptDropData(data: any): boolean {

            if (data instanceof io.FilePath) {

                return SceneMaker.acceptDropFile(data, this._editor.getInput());
            }

            for (const ext of ScenePlugin.getInstance().getObjectExtensions()) {

                if (ext.acceptsDropData(data)) {
                    return true;
                }
            }

            return false;
        }

        private acceptDropDataArray(dataArray: any[]) {

            if (!dataArray) {
                return false;
            }

            for (const item of dataArray) {

                if (!this.acceptDropData(item)) {
                    return false;
                }
            }

            return true;
        }
    }
}