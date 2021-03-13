namespace phasereditor2d.pack.core {

    export interface IBitmapFontData {
        chars: Map<number, {
            x: number,
            y: number,
            width: number,
            height: number
        }>;
    }
}