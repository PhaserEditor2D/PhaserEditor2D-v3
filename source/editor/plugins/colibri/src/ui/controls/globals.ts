namespace colibri.ui.controls {

    export const CONTROL_PADDING = 3;
    export const ROW_HEIGHT = 20;
    export const FONT_HEIGHT = 14;
    export const FONT_WITH = 12;
    export const FONT_OFFSET = 2;
    export const FONT_FAMILY = "Arial, Helvetica, sans-serif";
    export const ACTION_WIDTH = 20;
    export const PANEL_BORDER_SIZE = 5;
    export const PANEL_TITLE_HEIGHT = 22;
    export const FILTERED_VIEWER_FILTER_HEIGHT = 30;
    export const SPLIT_OVER_ZONE_WIDTH = 6;

    export function setElementBounds(elem: HTMLElement, bounds: IBounds) {
        if (bounds.x !== undefined) {
            elem.style.left = bounds.x + "px";
        }

        if (bounds.y !== undefined) {
            elem.style.top = bounds.y + "px";
        }

        if (bounds.width !== undefined) {
            elem.style.width = bounds.width + "px";
        }

        if (bounds.height !== undefined) {
            elem.style.height = bounds.height + "px";
        }
    }

    export function getElementBounds(elem: HTMLElement): IBounds {
        return {
            x: elem.clientLeft,
            y: elem.clientTop,
            width: elem.clientWidth,
            height: elem.clientHeight
        };
    }
}