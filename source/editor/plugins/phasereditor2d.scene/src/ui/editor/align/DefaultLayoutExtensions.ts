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
            group: "Shift To",
            action: makeShiftAction("x", 0)
        });

        static SHIFT_CENTER = new LayoutExtension({
            name: "Border Center",
            group: "Shift To",
            action: makeShiftAction("x", 0.5)
        });

        static SHIFT_RIGHT = new LayoutExtension({
            name: "Border Right",
            group: "Shift To",
            action: makeShiftAction("x", 1)
        });

        static SHIFT_TOP = new LayoutExtension({
            name: "Border Top",
            group: "Shift To",
            action: makeShiftAction("y", 0)
        });

        static SHIFT_MIDDLE = new LayoutExtension({
            name: "Border Middle",
            group: "Shift To",
            action: makeShiftAction("y", 0.5)
        });

        static SHIFT_BOTTOM = new LayoutExtension({
            name: "Border Bottom",
            group: "Shift To",
            action: makeShiftAction("y", 1)
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
            DefaultLayoutExtensions.SHIFT_BOTTOM
        ];
    }
}