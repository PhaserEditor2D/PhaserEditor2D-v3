namespace phasereditor2d.scene.ui.editor.tools {

    export class SceneToolExtension extends colibri.Extension {

        static POINT_ID = "phasereditor2d.scene.ui.editor.tools.SceneToolExtension";

        private _tools: SceneTool[];

        constructor(...tools: SceneTool[]) {
            super(SceneToolExtension.POINT_ID);

            this._tools = tools;
        }

        getTools() {
            return this._tools;
        }
    }
}