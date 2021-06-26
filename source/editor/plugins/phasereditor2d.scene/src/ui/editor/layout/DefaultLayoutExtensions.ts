/// <reference path="./LayoutExtension.ts" />
namespace phasereditor2d.scene.ui.editor.layout {

    export function minValue(values: number[]) {

        let min = Number.MAX_VALUE;

        for (const v of values) {

            min = Math.min(v, min);
        }

        return min;
    }

    export function maxValue(values: number[]) {

        let max = Number.MIN_VALUE;

        for (const v of values) {

            max = Math.max(v, max);
        }

        return max;
    }

    export function avgValue(values: number[]) {

        let total = 0;

        for (const v of values) {

            total += v;
        }

        return total / values.length;
    }

    export function makeSimpleAxisAction(reduceFunc: (values: number[]) => number, axis: "x" | "y") {

        return (args: IAlignActionArgs) => {

            const value = reduceFunc(args.positions.map(p => p[axis]));

            for (const pos of args.positions) {

                pos[axis] = value;
            }
        };
    }

    export function makeBorderAction(axis: "x" | "y", factor: 0 | 0.5 | 1) {

        return (args: IAlignActionArgs) => {

            for (const pos of args.positions) {

                pos[axis] = args.border[axis] + args.border.size[axis] * factor;
            }
        };
    }

    export function makeAlignAction(axis: "x" | "y", reduceFunc: (values: number[]) => number, origin: number) {

        return (args: IAlignActionArgs) => {

            const value = reduceFunc(args.positions.map(p => p[axis] + p.size[axis] * origin));

            args.positions.forEach(pos => (pos[axis] = value - pos.size[axis] * origin));
        }
    }

    export function makeShiftAction(axis: "x" | "y", origin: number) {

        return (args: IAlignActionArgs) => {

            const value = args.border[axis] + args.border.size[axis] * origin;

            args.positions.forEach(pos => (pos[axis] = value - pos.size[axis] * origin));
        }
    }

    export class DefaultLayoutExtensions {

        // align

        static ALIGN_LEFT = new LayoutExtension({
            name: "Left",
            group: "Align",
            action: makeAlignAction("x", minValue, 0)
        });

        static ALIGN_CENTER = new LayoutExtension({
            name: "Center",
            group: "Align",
            action: makeAlignAction("x", avgValue, 0.5)
        });

        static ALIGN_RIGHT = new LayoutExtension({
            name: "Right",
            group: "Align",
            action: makeAlignAction("x", maxValue, 1)
        });

        static ALIGN_TOP = new LayoutExtension({
            name: "Top",
            group: "Align",
            action: makeAlignAction("y", minValue, 0)
        });

        static ALIGN_MIDDLE = new LayoutExtension({
            name: "Middle",
            group: "Align",
            action: makeAlignAction("y", avgValue, 0.5)
        });

        static ALIGN_BOTTOM = new LayoutExtension({
            name: "Bottom",
            group: "Align",
            action: makeAlignAction("y", maxValue, 1)
        });

        // Shift To

        static SHIFT_LEFT = new LayoutExtension({
            name: "Border Left",
            group: "Shift To Border",
            action: makeShiftAction("x", 0)
        });

        static SHIFT_CENTER = new LayoutExtension({
            name: "Border Center",
            group: "Shift To Border",
            action: makeShiftAction("x", 0.5)
        });

        static SHIFT_RIGHT = new LayoutExtension({
            name: "Border Right",
            group: "Shift To Border",
            action: makeShiftAction("x", 1)
        });

        static SHIFT_TOP = new LayoutExtension({
            name: "Border Top",
            group: "Shift To Border",
            action: makeShiftAction("y", 0)
        });

        static SHIFT_MIDDLE = new LayoutExtension({
            name: "Border Middle",
            group: "Shift To Border",
            action: makeShiftAction("y", 0.5)
        });

        static SHIFT_BOTTOM = new LayoutExtension({
            name: "Border Bottom",
            group: "Shift To Border",
            action: makeShiftAction("y", 1)
        });

        // grid

        static STACK_HORIZONTAL = new LayoutExtension({
            name: "Row",
            group: "Grid",
            params: [{
                name: "padding",
                label: "Padding",
                defaultValue: 0
            }],
            action: args => {

                const padding = args.params.padding;
                const minX = minValue(args.positions.map(p => p.x));
                const avgY = avgValue(args.positions.map(p => p.y));

                let x = minX;

                for (const pos of args.positions) {

                    pos.x = x;
                    pos.y = avgY;

                    x += pos.size.x + padding;
                }
            }
        });

        static STACK_VERTICAL = new LayoutExtension({
            name: "Column",
            group: "Grid",
            params: [{
                name: "padding",
                label: "Padding",
                defaultValue: 0
            }],
            action: args => {

                const padding = args.params.padding;
                const avgX = avgValue(args.positions.map(p => p.x));
                const minY = minValue(args.positions.map(p => p.y));

                let y = minY;

                for (const pos of args.positions) {

                    pos.x = avgX;
                    pos.y = y;

                    y += pos.size.y + padding;
                }
            }
        });

        static ROWS_AND_COLUMNS = new LayoutExtension({
            name: "Rows & Columns",
            group: "Grid",
            params: [{
                name: "rows",
                label: "Rows",
                defaultValue: 3
            }, {
                name: "cols",
                label: "Columns",
                defaultValue: 3
            }, {
                name: "padding",
                label: "Padding",
                defaultValue: 0
            },{
                name: "cellWidth",
                label: "Cell Width",
                defaultValue: 0
            }, {
                name: "cellHeight",
                label: "Cell Height",
                defaultValue: 0
            }],
            action: args => {

                const minX = minValue(args.positions.map(p => p.x));
                const minY = minValue(args.positions.map(p => p.y));

                let cols = args.params.cols as number;
                let rows = args.params.rows as number;
                let cellWidth = args.params.cellWidth;
                let cellHeight = args.params.cellHeight;
                let padding = args.params.padding;

                if (cellWidth === 0) {

                    cellWidth = maxValue(args.positions.map(p => p.size.x));
                }

                if (cellHeight === 0) {

                    cellHeight = maxValue(args.positions.map(p => p.size.y));
                }

                cellWidth += padding;
                cellHeight += padding;

                const len = args.positions.length;

                if (rows === 0) {

                    rows = Math.max(Math.floor(len / cols), 1);

                } else if (cols === 0) {

                    cols = Math.max(Math.floor(len / rows), 1);
                }

                let x = minX;
                let y = minY;

                let i = 0;

                for (const pos of args.positions) {

                    pos.x = x + cellWidth / 2 - pos.size.x / 2;
                    pos.y = y + cellHeight / 2 - pos.size.y / 2;

                    x += cellWidth;
                    i++;

                    if (i === cols) {

                        i = 0;
                        x = minX;
                        y += cellHeight;
                    }
                }
            }
        });

        static ALL = [
            DefaultLayoutExtensions.ALIGN_LEFT,
            DefaultLayoutExtensions.ALIGN_CENTER,
            DefaultLayoutExtensions.ALIGN_RIGHT,
            DefaultLayoutExtensions.ALIGN_TOP,
            DefaultLayoutExtensions.ALIGN_MIDDLE,
            DefaultLayoutExtensions.ALIGN_BOTTOM,
            DefaultLayoutExtensions.SHIFT_LEFT,
            DefaultLayoutExtensions.SHIFT_CENTER,
            DefaultLayoutExtensions.SHIFT_RIGHT,
            DefaultLayoutExtensions.SHIFT_TOP,
            DefaultLayoutExtensions.SHIFT_MIDDLE,
            DefaultLayoutExtensions.SHIFT_BOTTOM,
            DefaultLayoutExtensions.STACK_HORIZONTAL,
            DefaultLayoutExtensions.STACK_VERTICAL,
            DefaultLayoutExtensions.ROWS_AND_COLUMNS
        ];
    }
}