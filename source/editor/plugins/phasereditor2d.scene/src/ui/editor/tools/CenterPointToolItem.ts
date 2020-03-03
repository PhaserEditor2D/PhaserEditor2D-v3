/// <reference path="./PointToolItem.ts"/>

namespace phasereditor2d.scene.ui.editor.tools {

    export class CenterPointToolItem extends PointToolItem {

        constructor(color: string) {
            super(color);
        }

        getPoint(args: ISceneToolContextArgs): { x: number; y: number; } {

            return this.getAvgScreenPointOfObjects(args);
        }
    }
}