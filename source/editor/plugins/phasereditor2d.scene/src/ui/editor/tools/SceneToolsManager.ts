namespace phasereditor2d.scene.ui.editor.tools {

    export interface ISceneToolsState {

        selectedId: string;
        localCoords: boolean;
    }

    export class SceneToolsManager {

        private _editor: SceneEditor;
        private _activeTool: SceneTool;
        private _tools: SceneTool[];

        constructor(editor: SceneEditor) {
            this._editor = editor;

            this._tools = ScenePlugin.getInstance().getTools();

            this.setActiveTool(this.findTool(sceneobjects.TranslateTool.ID));
        }

        setState(state: ISceneToolsState) {

            if (state) {

                const id = state.selectedId;

                const tool = this.findTool(id);

                if (tool) {

                    this.setActiveTool(tool);
                }

                this._editor.setLocalCoords(state.localCoords || state.localCoords === undefined, false);
            }
        }

        getState(): ISceneToolsState {

            return {
                selectedId: this._activeTool ? this._activeTool.getId() : undefined,
                localCoords: this._editor.isLocalCoords()
            };
        }

        findTool(toolId: string) {

            return this._tools.find(tool => tool.getId() === toolId);
        }

        getActiveTool() {

            return this._activeTool;
        }

        activateTool(toolId: string) {

            const tool = this.findTool(toolId);

            if (tool) {

                this.setActiveTool(tool);

            } else {

                console.error(`Tool not found ${toolId}`);
            }
        }

        setActiveTool(tool: SceneTool) {

            const args = this.createToolArgs();

            if (this._activeTool) {

                this._activeTool.onDeactivated(args);
            }

            this.updateAction(this._activeTool, false);
            this.updateAction(tool, true);

            this._activeTool = tool;

            if (this._activeTool) {

                this._activeTool.onActivated(args);
            }

            this._editor.repaint();
        }

        handleDoubleClick() {

            if (this._activeTool) {

                return this._activeTool.handleDoubleClick(this.createToolArgs());
            }

            return false;
        }

        handleDeleteCommand() {

            if (this._activeTool) {

                return this._activeTool.handleDeleteCommand(this.createToolArgs());
            }

            return false;
        }

        private createToolArgs(): ISceneToolContextArgs {
            
            return {
                camera: null,
                editor: this._editor,
                localCoords: this._editor.isLocalCoords(),
                objects: this._editor.getSelection()
            };
        }

        private updateAction(tool: tools.SceneTool, selected: boolean) {

            if (tool) {

                const action = this._editor.getToolbarActionMap().get(tool.getId());

                if (action) {

                    action.setSelected(selected);
                }
            }
        }

        swapTool(toolId: string) {

            const tool = this.findTool(toolId);

            this.setActiveTool(tool === this._activeTool ? null : tool);
        }
    }
}