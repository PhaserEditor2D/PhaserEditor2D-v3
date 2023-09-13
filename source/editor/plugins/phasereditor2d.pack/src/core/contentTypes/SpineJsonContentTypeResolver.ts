namespace phasereditor2d.pack.core.contentTypes {

    import io = colibri.core.io;
    import ide = colibri.ui.ide;

    export const CONTENT_TYPE_SPINE_JSON = "phasereditor2d.pack.core.spineJson";

    export class SpineJsonContentTypeResolver implements colibri.core.IContentTypeResolver {

        getId(): string {

            return "phasereditor2d.pack.core.spineJson";
        }

        async computeContentType(file: io.FilePath): Promise<string> {

            if (file.getExtension() === "json") {

                const content = await ide.FileUtils.preloadAndGetFileString(file);

                try {

                    const data = JSON.parse(content);

                    if (data.hasOwnProperty("skeleton")) {

                        const skeletonData = data["skeleton"];

                        if (typeof (skeletonData) === "object") {

                            const version = skeletonData["spine"];

                            if (typeof version  === "string" && version.startsWith("4")) {

                                return CONTENT_TYPE_SPINE_JSON;
                            }
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