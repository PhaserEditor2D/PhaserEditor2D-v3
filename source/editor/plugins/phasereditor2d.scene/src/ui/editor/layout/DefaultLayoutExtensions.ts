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
            icon: ScenePlugin.getInstance().getIcon(ICON_ALIGN_LEFT),
            action: makeAlignAction("x", minValue, 0)
        });

        static ALIGN_CENTER = new LayoutExtension({
            name: "Center",
            group: "Align",
            icon: ScenePlugin.getInstance().getIcon(ICON_ALIGN_CENTER),
            action: makeAlignAction("x", avgValue, 0.5)
        });

        static ALIGN_RIGHT = new LayoutExtension({
            name: "Right",
            group: "Align",
            icon: ScenePlugin.getInstance().getIcon(ICON_ALIGN_RIGHT),
            action: makeAlignAction("x", maxValue, 1)
        });

        static ALIGN_TOP = new LayoutExtension({
            name: "Top",
            group: "Align",
            icon: ScenePlugin.getInstance().getIcon(ICON_ALIGN_TOP),
            action: makeAlignAction("y", minValue, 0)
        });

        static ALIGN_MIDDLE = new LayoutExtension({
            name: "Middle",
            group: "Align",
            icon: ScenePlugin.getInstance().getIcon(ICON_ALIGN_MIDDLE),
            action: makeAlignAction("y", avgValue, 0.5)
        });

        static ALIGN_BOTTOM = new LayoutExtension({
            name: "Bottom",
            group: "Align",
            icon: ScenePlugin.getInstance().getIcon(ICON_ALIGN_BOTTOM),
            action: makeAlignAction("y", maxValue, 1)
        });

        // Shift To

        static ALIGN_BORDER_LEFT = new LayoutExtension({
            name: "Border Left",
            group: "Align To Border",
            icon: ScenePlugin.getInstance().getIcon(ICON_BORDER_LEFT),
            action: makeShiftAction("x", 0)
        });

        static ALIGN_BORDER_CENTER = new LayoutExtension({
            name: "Border Center",
            group: "Align To Border",
            icon: ScenePlugin.getInstance().getIcon(ICON_BORDER_CENTER),
            action: makeShiftAction("x", 0.5)
        });

        static ALIGN_BORDER_RIGHT = new LayoutExtension({
            name: "Border Right",
            group: "Align To Border",
            icon: ScenePlugin.getInstance().getIcon(ICON_BORDER_RIGHT),
            action: makeShiftAction("x", 1)
        });

        static ALIGN_BORDER_TOP = new LayoutExtension({
            name: "Border Top",
            group: "Align To Border",
            icon: ScenePlugin.getInstance().getIcon(ICON_BORDER_TOP),
            action: makeShiftAction("y", 0)
        });

        static ALIGN_BORDER_MIDDLE = new LayoutExtension({
            name: "Border Middle",
            group: "Align To Border",
            icon: ScenePlugin.getInstance().getIcon(ICON_BORDER_MIDDLE),
            action: makeShiftAction("y", 0.5)
        });

        static ALIGN_BORDER_BOTTOM = new LayoutExtension({
            name: "Border Bottom",
            group: "Align To Border",
            icon: ScenePlugin.getInstance().getIcon(ICON_BORDER_BOTTOM),
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
            icon: ScenePlugin.getInstance().getIcon(ICON_ROW),
            action: args => {

                args.positions.sort((a, b) => a.x - b.x);

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
            icon: ScenePlugin.getInstance().getIcon(ICON_COLUMN),
            action: args => {

                args.positions.sort((a, b) => a.y - b.y);

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
            name: "Grid",
            group: "Grid",
            params: [{
                name: "cols",
                label: "Columns",
                defaultValue: 3
            }, {
                name: "padding",
                label: "Padding",
                defaultValue: 0
            }, {
                name: "cellWidth",
                label: "Cell Width",
                defaultValue: 0
            }, {
                name: "cellHeight",
                label: "Cell Height",
                defaultValue: 0
            }],
            icon: ScenePlugin.getInstance().getIcon(ICON_GRID),
            action: args => {

                const minX = minValue(args.positions.map(p => p.x));
                const minY = minValue(args.positions.map(p => p.y));

                let cols = args.params.cols as number;
                let cellWidth = args.params.cellWidth;
                let cellHeight = args.params.cellHeight;
                const padding = args.params.padding;

                if (cellWidth === 0) {

                    cellWidth = maxValue(args.positions.map(p => p.size.x));
                }

                if (cellHeight === 0) {

                    cellHeight = maxValue(args.positions.map(p => p.size.y));
                }

                cellWidth += padding;
                cellHeight += padding;

                let x = minX;
                let y = minY;

                let currentCol = 0;

                const processed = new Set();

                const findCloserPosition = (x: number, y: number) => {

                    let result: ILayoutIPosition;
                    let min = Number.MAX_VALUE;

                    for (const pos of args.positions) {

                        if (processed.has(pos)) {

                            continue;
                        }

                        const d = Phaser.Math.Distance.Between(x, y, pos.x + pos.size.x / 2, pos.y + pos.size.y / 2);

                        if (d < min) {

                            result = pos;
                            min = d;
                        }
                    }

                    return result;
                }

                while (processed.size < args.positions.length) {

                    const pos = findCloserPosition(x + cellWidth / 2, y + cellHeight / 2);

                    processed.add(pos);

                    pos.x = x + cellWidth / 2 - pos.size.x / 2;
                    pos.y = y + cellHeight / 2 - pos.size.y / 2;

                    x += cellWidth;
                    currentCol++;

                    if (currentCol === cols) {

                        currentCol = 0;
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
            DefaultLayoutExtensions.ALIGN_BORDER_LEFT,
            DefaultLayoutExtensions.ALIGN_BORDER_CENTER,
            DefaultLayoutExtensions.ALIGN_BORDER_RIGHT,
            DefaultLayoutExtensions.ALIGN_BORDER_TOP,
            DefaultLayoutExtensions.ALIGN_BORDER_MIDDLE,
            DefaultLayoutExtensions.ALIGN_BORDER_BOTTOM,
            DefaultLayoutExtensions.STACK_HORIZONTAL,
            DefaultLayoutExtensions.STACK_VERTICAL,
            DefaultLayoutExtensions.ROWS_AND_COLUMNS
        ];
    }
}