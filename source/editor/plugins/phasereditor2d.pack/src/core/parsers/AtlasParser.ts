/// <reference path="./BaseAtlasParser.ts" />

namespace phasereditor2d.pack.core.parsers {

    import controls = colibri.ui.controls;

    export class AtlasParser extends BaseAtlasParser {

        constructor(packItem: AssetPackItem) {
            super(packItem, false);
        }

        protected parseFrames2(imageFrames: AssetPackImageFrame[], image: controls.DefaultImage, atlas: string) {
            try {

                const data = JSON.parse(atlas);

                if (data) {

                    if (Array.isArray(data.frames)) {

                        for (const frame of data.frames) {

                            const frameData = AtlasParser.buildFrameData(
                                this.getPackItem(), image, frame, imageFrames.length);

                            imageFrames.push(frameData);
                        }
                    } else {

                        for (const name in data.frames) {

                            if (data.frames.hasOwnProperty(name)) {

                                const frame = data.frames[name];

                                frame.filename = name;

                                const frameData = AtlasParser.buildFrameData(
                                    this.getPackItem(), image, frame, imageFrames.length);

                                imageFrames.push(frameData);
                            }
                        }
                    }
                }

            } catch (e) {
                console.error(e);
            }
        }

        static buildFrameData(
            packItem: AssetPackItem, image: controls.DefaultImage, frame: FrameDataType, index: number): AssetPackImageFrame {

            const src = new controls.Rect(frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h);

            const dst = new controls.Rect(
                frame.spriteSourceSize.x, frame.spriteSourceSize.y, frame.spriteSourceSize.w, frame.spriteSourceSize.h);

            const srcSize = new controls.Point(frame.sourceSize.w, frame.sourceSize.h);

            const frameData = new controls.FrameData(index, src, dst, srcSize);

            return new AssetPackImageFrame(
                packItem as ImageFrameContainerAssetPackItem, frame.filename, image, frameData);
        }
    }
}