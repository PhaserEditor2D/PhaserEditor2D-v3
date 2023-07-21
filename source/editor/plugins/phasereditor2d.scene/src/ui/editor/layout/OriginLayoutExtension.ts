/// <reference path="./LayoutExtension.ts" />

namespace phasereditor2d.scene.ui.editor.layout {

    type Origin = 0 | 0.5 | 1;

    function getXName(origin: Origin) {

        switch (origin) {
            case 0:
                return "Left";
            case 0.5:
                return "Center";
            case 1:
                return "Right";
        }
    }

    function getYName(origin: Origin) {

        switch (origin) {
            case 0:
                return "Top";
            case 0.5:
                return "Middle";
            case 1:
                return "Bottom";
        }
    }

    export class OriginLayoutExtension extends LayoutExtension<ILayoutExtensionConfig> {

        private _originX: Origin;
        private _originY: Origin;

        constructor(originX: Origin, originY: Origin) {
            super({
                name: `Origin ${getYName(originY)}/${getXName(originX)}`,
                group: "Origin",
                icon: resources.getIcon(("origin-" + getYName(originY) + getXName(originX)).toLowerCase()),
            });

            this._originX = originX;
            this._originY = originY;
        }

        async performLayout(editor: SceneEditor) {

            const name = getYName(this._originY) + "/" + getXName(this._originX);

            colibri.Platform.getWorkbench().getCommandManager()
                .executeCommand(`phasereditor2d.scene.ui.editor.commands.SetOrigin_${name}_ToObject`);
        }
    }
}