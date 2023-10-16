namespace phasereditor2d.animations.ui.editors {

    import io = colibri.core.io;
    import FileUtils = colibri.ui.ide.FileUtils;
    import SourceLang = phasereditor2d.ide.core.code.SourceLang;

    export interface IAnimationsData extends Phaser.Types.Animations.JSONAnimations {

        settings?: {
            sourceLang: string,
            generateCode: boolean,
            esModule: boolean;
            outputFolder: string;
        },
        meta: {
            app: string,
            contentType: string
        }
    }

    export class AnimationsModel {

        private _animationsData: IAnimationsData;

        public sourceLang = ide.core.code.SourceLang.JAVA_SCRIPT;
        public generateCode = false;
        public esModule = false;
        public outputFolder: string;

        constructor() {

            this._animationsData = {
                anims: [],
                globalTimeScale: 1,
                meta: this.createMeta()
            };
        }

        async readFile(file: io.FilePath) {

            await FileUtils.preloadFileString(file);

            const content = FileUtils.getFileString(file);

            this._animationsData = JSON.parse(content);

            const settings = this._animationsData.settings || {} as any;

            this.sourceLang = (settings.sourceLang || SourceLang.JAVA_SCRIPT);
            this.esModule = settings.esModule ? true : false;
            this.generateCode = settings.generateCode ? true : false;
            this.outputFolder = settings.outputFolder;
        }

        toJSON(finder: pack.core.PackFinder) {

            const animsData = JSON.parse(JSON.stringify(this._animationsData)) as IAnimationsData;

            animsData.settings = {
                sourceLang: this.sourceLang,
                esModule: this.esModule,
                generateCode: this.generateCode,
                outputFolder: this.outputFolder,
            };

            for (const a of animsData.anims) {

                if (a.delay === 0) delete a.delay;

                if (a.repeat === 0) delete a.repeat;

                if (a.repeatDelay === 0) delete a.repeatDelay;

                if (!a.yoyo) delete a.yoyo;

                if (!a.showBeforeDelay) delete a.showBeforeDelay;

                if (!a.showOnStart) delete a.showOnStart;

                if (!a.hideOnComplete) delete a.hideOnComplete;

                if (!a.skipMissedFrames) delete a.skipMissedFrames;

                delete a.duration;

                for (const frame of a.frames) {

                    try {
                        const item = finder.findAssetPackItem(frame.key);

                        if (item instanceof pack.core.ImageAssetPackItem) {

                            delete frame.frame;
                        }

                    } catch (e) {
                        // nothing
                    }
                }
            }

            animsData.meta = this.createMeta();

            return animsData;
        }

        private createMeta() {

            return {
                "app": "Phaser Editor 2D v3",
                "contentType": pack.core.contentTypes.CONTENT_TYPE_ANIMATIONS
            };
        }

        async writeFile(file: io.FilePath, finder: pack.core.PackFinder) {

            const animsData = this.toJSON(finder);

            const content = JSON.stringify(animsData, null, 4);

            await FileUtils.setFileString_async(file, content);
        }

        getModelData() {

            return this._animationsData;
        }

        setJSONAnimations(animsData: Phaser.Types.Animations.JSONAnimations) {

            this._animationsData.anims = animsData.anims;
        }
    }
}