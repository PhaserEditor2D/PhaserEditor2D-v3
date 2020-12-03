namespace colibri.ui.controls.viewers {

    export class PaintItem extends controls.Rect {
        constructor(
            public index: number,
            public data: any,
            public parent: PaintItem = null,
            public visible: boolean
        ) {
            super();
        }
    }
}