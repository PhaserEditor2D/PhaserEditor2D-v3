namespace colibri.ui.controls {
    export class Rect {
        constructor(
            public x: number = 0,
            public y: number = 0,
            public w: number = 0,
            public h: number = 0,
        ) {
        }

        set(x: number, y: number, w: number, h: number) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }

        contains(x: number, y: number): boolean {
            return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
        }

        clone() {
            return new Rect(this.x, this.y, this.w, this.h);
        }
    }
}