namespace phasereditor2d.pack.ui.importers {

    import io = colibri.core.io;

    export class SpineImporter extends SingleFileImporter {

        protected computeItemFromKey(file: io.FilePath): string {

            let key = file.getNameWithoutExtension();

            return SpineImporter.removeSuffix(key, "-pro", "-ess");
        }

        static removeSuffix(key: string, ...suffixes: string[]) {

            for (const suffix of suffixes) {

                if (key.endsWith(suffix)) {

                    return key.substring(0, key.length - suffix.length);
                }
            }

            return key;
        }
    }
}