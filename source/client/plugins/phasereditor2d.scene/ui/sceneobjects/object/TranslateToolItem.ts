namespace phasereditor2d.scene.ui.sceneobjects {

    export class TranslateToolItem
        extends editor.tools.SceneToolItem implements editor.tools.ISceneToolItemXY {

        private _axis: "x" | "y" | "xy";

        constructor(axis: "x" | "y" | "xy") {
            super();

            this._axis = axis;
        }

        getPoint(args: editor.tools.ISceneToolRenderArgs) {

            const { x, y } = this.getAvgScreenPointOfObjects(args, obj => 0, obj => 0);

            return {
                x: this._axis === "x" ? x + 100 : x,
                y: this._axis === "y" ? y + 100 : y
            };
        }

        render(args: editor.tools.ISceneToolRenderArgs) {

            const { x, y } = this.getPoint(args);

            const ctx = args.context;

            ctx.strokeStyle = "#000";

            if (this._axis === "xy") {

                ctx.fillStyle = "#ffff00";
                ctx.fillRect(x - 5, y - 5, 10, 10);
                ctx.strokeRect(x - 5, y - 5, 10, 10);

            } else {

                ctx.fillStyle = this._axis === "x" ? "#f00" : "#0f0";

                ctx.save();

                ctx.translate(x, y);

                ctx.rotate(this._axis === "x" ? 0 : Math.PI / 2);

                this.drawArrowPath(ctx);

                ctx.restore();
            }
        }
    }
}