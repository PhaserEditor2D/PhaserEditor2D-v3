namespace colibri.ui.controls {

    export class FrameData {

        constructor(
            public index: number,
            public src: controls.Rect,
            public dst: controls.Rect,
            public srcSize: controls.Point,
        ) {

        }

        static fromRect(index: number, rect: Rect) {
            return new FrameData(0, rect.clone(), new Rect(0, 0, rect.w, rect.h), new Point(rect.w, rect.h));
        }
    }
}