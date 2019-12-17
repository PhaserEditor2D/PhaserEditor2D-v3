namespace phasereditor2d.pack.core.contentTypes {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export const CONTENT_TYPE_AUDIO_SPRITE = "phasereditor2d.pack.core.audioSprite";

    export class AudioSpriteContentTypeResolver implements colibri.core.IContentTypeResolver {

        getId(): string {
            return "phasereditor2d.pack.core.contentTypes.AudioSpriteContentTypeResolver";
        }

        async computeContentType(file: io.FilePath): Promise<string> {

            if (file.getExtension() === "json") {

                const content = await ide.FileUtils.preloadAndGetFileString(file);

                try {

                    const data = JSON.parse(content);

                    if (Array.isArray(data.resources) && typeof (data.spritemap) === "object") {
                        return CONTENT_TYPE_AUDIO_SPRITE;
                    }

                } catch (e) {
                    // nothing
                }
            }

            return colibri.core.CONTENT_TYPE_ANY;
        }

    }

}