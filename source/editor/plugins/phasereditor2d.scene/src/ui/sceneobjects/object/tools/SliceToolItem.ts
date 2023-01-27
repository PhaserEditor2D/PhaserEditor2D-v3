namespace phasereditor2d.scene.ui.sceneobjects {

    type ISliceID = "leftWidth" | "rightWidth" | "topHeight" | "bottomHeight";

    export interface ISliceData {
        leftWidth: number;
        rightWidth: number;
        topHeight: number;
        bottomHeight: number;
    }

    const HANDLER_ANGLE = {
        "leftWidth": 90,
        "rightWidth": -90,
        "topHeight": 0,
        "bottomHeight": -180
    };

    const HANDLER_OFFSET = 12;
    const HANDLER_OFFSET_DIR = {
        "leftWidth": { x: 0, y: -1 },
        "rightWidth": { x: 0, y: 1 },
        "topHeight": { x: -1, y: 0 },
        "bottomHeight": { x: 1, y: 0 }
    };

    const HANDLER_COLOR = "skyblue";


    export class SliceToolItem
        extends editor.tools.SceneToolItem implements editor.tools.ISceneToolItemXY {

        private _slice: ISliceID;
        private _dragging: boolean;

        constructor(slice: ISliceID) {
            super();

            this._slice = slice;
        }

        isValidFor(objects: ISceneGameObject[]): boolean {

            for (const obj of objects) {

                if (obj instanceof ThreeSlice) {

                    if (this._slice === "topHeight" || this._slice == "bottomHeight") {

                        return false;
                    }
                }

                if (!(obj instanceof ThreeSlice) && !(obj instanceof NineSlice)) {

                    return false;
                }
            }

            return true;
        }

        getPoint(args: editor.tools.ISceneToolContextArgs): { x: number; y: number; } {

            return this.getAvgScreenPointOfObjects(args,

                (sprite: sceneobjects.NineSlice) => {

                    const ox = sprite.getEditorSupport().computeOrigin().originX;

                    switch (this._slice) {

                        case "leftWidth":

                            return sprite.leftWidth / sprite.width - ox;

                        case "rightWidth":

                            return 1 - sprite.rightWidth / sprite.width - ox;

                        case "topHeight":

                            return -ox;

                        case "bottomHeight":

                            return 1 - ox;
                    }
                },

                (sprite: sceneobjects.NineSlice) => {

                    const oy = sprite.getEditorSupport().computeOrigin().originY;

                    switch (this._slice) {

                        case "leftWidth":

                            return -oy;

                        case "rightWidth":

                            return 1 - oy;

                        case "topHeight":

                            return sprite.topHeight / sprite.height - oy;

                        case "bottomHeight":

                            return 1 - sprite.bottomHeight / sprite.height - oy;
                    }
                },
            );
        }

        render(args: editor.tools.ISceneToolRenderArgs) {

            const point = this.getPoint(args);

            const ctx = args.canvasContext;

            ctx.save();

            ctx.translate(point.x, point.y);

            let angle = this.globalAngle(args.objects[0] as any);

            ctx.rotate(Phaser.Math.DegToRad(angle));

            ctx.save();

            const obj = args.objects[0] as NineSlice;
            const scale = this.getScreenToObjectScale(args, obj);

            scale.x *= obj.scaleX;
            scale.y *= obj.scaleY;

            ctx.strokeStyle = "#fff";

            switch (this._slice) {

                case "leftWidth":

                    this.drawLinePath(ctx, HANDLER_COLOR, 0, 0, 0, obj.height * scale.y, true);
                    break;

                case "rightWidth":

                    this.drawLinePath(ctx, HANDLER_COLOR, 0, 0, 0, -obj.height * scale.y, true);
                    break;

                case "topHeight":

                    this.drawLinePath(ctx, HANDLER_COLOR, 0, 0, obj.width * scale.x, 0, true);
                    break;

                case "bottomHeight":

                    this.drawLinePath(ctx, HANDLER_COLOR, 0, 0, -obj.width * scale.x, 0, true);
                    break;
            }

            ctx.restore();

            ctx.translate(
                HANDLER_OFFSET_DIR[this._slice].x * HANDLER_OFFSET,
                HANDLER_OFFSET_DIR[this._slice].y * HANDLER_OFFSET);

            ctx.rotate(Phaser.Math.DegToRad(HANDLER_ANGLE[this._slice]));

            this.drawArrowPath(ctx, args.canEdit ? HANDLER_COLOR : editor.tools.SceneTool.COLOR_CANNOT_EDIT);

            ctx.restore();
        }

        containsPoint(args: editor.tools.ISceneToolDragEventArgs): boolean {

            const point = this.getPoint(args);

            return Phaser.Math.Distance.Between(args.x, args.y, point.x, point.y) < 20;
        }

        onStartDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this.containsPoint(args)) {
                return;
            }

            this._dragging = true;

            const point = this.getPoint(args);

            for (const obj of args.objects) {

                const sprite = obj as unknown as NineSlice;

                const worldTx = new Phaser.GameObjects.Components.TransformMatrix();

                const initLocalPos = new Phaser.Math.Vector2();

                sprite.getWorldTransformMatrix(worldTx);

                worldTx.applyInverse(point.x, point.y, initLocalPos);

                sprite.setData("SliceTool", {
                    initLeftWidth: sprite.leftWidth,
                    initRightWidth: sprite.rightWidth,
                    initTopHeight: sprite.topHeight,
                    initBottomHeight: sprite.bottomHeight,
                    initLocalPos: initLocalPos,
                    initWorldTx: worldTx
                });
            }
        }

        onDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (!this._dragging) {
                return;
            }

            const mirror = args.event.shiftKey;

            const camera = args.camera;

            for (const obj of args.objects) {

                const sprite = obj as NineSlice;
                const data = sprite.data.get("SliceTool");
                const initLocalPos: Phaser.Math.Vector2 = data.initLocalPos;
                const worldTx: Phaser.GameObjects.Components.TransformMatrix = data.initWorldTx;
                const { initLeftWidth, initRightWidth, initTopHeight, initBottomHeight } = data;

                const localPos = new Phaser.Math.Vector2();

                worldTx.applyInverse(args.x, args.y, localPos);

                const dx = Math.floor((localPos.x - initLocalPos.x) / camera.zoom);
                const dy = Math.floor((localPos.y - initLocalPos.y) / camera.zoom);

                const comp = obj instanceof NineSlice ? NineSliceComponent : ThreeSliceComponent;

                let value: number;

                switch (this._slice) {

                    case "leftWidth":

                        value = initLeftWidth + dx;

                        comp.leftWidth.setValue(obj, value);

                        if (mirror) {

                            comp.rightWidth.setValue(obj, value);
                        }

                        break;

                    case "rightWidth":

                        value = initRightWidth - dx;

                        comp.rightWidth.setValue(obj, value);

                        if (mirror) {

                            comp.leftWidth.setValue(obj, value);
                        }

                        break;

                    case "topHeight":

                        value = initTopHeight + dy;

                        NineSliceComponent.topHeight.setValue(obj, value);

                        if (mirror) {

                            NineSliceComponent.bottomHeight.setValue(obj, value);
                        }

                        break;

                    case "bottomHeight":

                        value = initBottomHeight - dy;

                        NineSliceComponent.bottomHeight.setValue(obj, value);

                        if (mirror) {

                            NineSliceComponent.topHeight.setValue(obj, value);
                        }

                        break;
                }
            }

            for (const obj of args.objects) {

                if (obj instanceof NineSlice) {

                    args.editor.updateInspectorViewSection(NineSliceSection.SECTION_ID);
                    break;
                }
            }

            for (const obj of args.objects) {

                if (obj instanceof ThreeSlice) {

                    args.editor.updateInspectorViewSection(ThreeSliceSection.SECTION_ID);
                    break;
                }
            }
        }

        onStopDrag(args: editor.tools.ISceneToolDragEventArgs): void {

            if (this._dragging) {

                args.editor.getUndoManager().add(new SliceOperation(args));

                this._dragging = false;
            }
        }

        static getInitialData(obj: any): ISliceData {

            const data = obj.getData("SliceTool");

            return {
                leftWidth: data.initLeftWidth,
                rightWidth: data.initRightWidth,
                topHeight: data.initTopHeight,
                bottomHeight: data.initBottomHeight
            };
        }
    }
}