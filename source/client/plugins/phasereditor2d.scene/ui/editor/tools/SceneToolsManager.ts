namespace phasereditor2d.scene.ui.editor.tools {

    export class SceneToolsManager {

        private _editor: SceneEditor;
        private _activeTool: SceneTool;
        private _tools: SceneTool[];

        constructor(editor: SceneEditor) {
            this._editor = editor;

            const exts = colibri.Platform.getExtensions<SceneToolExtension>(SceneToolExtension.POINT_ID);

            this._tools = exts.flatMap(ext => ext.getTools());

            console.log(this._tools);
        }

        findTool(toolId: string) {

            return this._tools.find(tool => tool.getId() === toolId);
        }

        getActiveTool() {
            return this._activeTool;
        }

        setActiveTool(tool: SceneTool) {

            console.log("Set tool: " + (tool ? tool.getId() : "null"));

            this._activeTool = tool;

            this._editor.repaint();
        }

        swapTool(toolId: string) {

            const tool = this.findTool(toolId);

            this.setActiveTool(tool === this._activeTool ? null : tool);
        }
    }
}