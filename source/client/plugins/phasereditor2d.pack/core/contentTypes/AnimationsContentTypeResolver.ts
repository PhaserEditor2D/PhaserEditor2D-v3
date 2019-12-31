namespace phasereditor2d.pack.core.contentTypes {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export const CONTENT_TYPE_ANIMATIONS = "Phaser v3 Animations";

    export class AnimationsContentTypeResolver implements colibri.core.IContentTypeResolver {

        getId(): string {
            return "phasereditor2d.pack.core.AnimationsContentTypeResolver";
        }

        async computeContentType(file: io.FilePath): Promise<string> {

            if (file.getExtension() === "json") {

                const content = await ide.FileUtils.preloadAndGetFileString(file);

                try {

                    const data = JSON.parse(content);

                    if (data.meta) {

                        if (data.meta.contentType === CONTENT_TYPE_ANIMATIONS) {
                            return CONTENT_TYPE_ANIMATIONS;
                        }
                    }

                } catch (e) {
                    // nothing
                }
            }

            return colibri.core.CONTENT_TYPE_ANY;
        }

    }

}