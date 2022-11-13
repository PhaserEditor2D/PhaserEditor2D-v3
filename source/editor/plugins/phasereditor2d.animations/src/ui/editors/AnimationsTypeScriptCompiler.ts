namespace phasereditor2d.animations.ui.editors {

    import BaseCodeGenerator = ide.core.code.BaseCodeGenerator;
    import io = colibri.core.io;

    export class AnimationsTypeScriptCompiler extends BaseCodeGenerator {

        private _anims: Phaser.Types.Animations.JSONAnimations;
        private _typeName: string;

        constructor(anims: Phaser.Types.Animations.JSONAnimations) {
            super();

            this._anims = anims;
        }

        async compileFile(animsFile: io.FilePath, tsFile: io.FilePath) {

            this._typeName = animsFile.getNameWithoutExtension();
            this._typeName = "T" + this._typeName[0].toUpperCase() + this._typeName.substring(1);

            const replace = await colibri.ui.ide.FileUtils.preloadAndGetFileString(tsFile);

            const newContent = this.generate(replace);

            await colibri.ui.ide.FileUtils.setFileString_async(tsFile, newContent);
        }

        protected internalGenerate(): void {

            const keys = this._anims.anims.map(a => a.key);

            this.line(`declare type ${this._typeName} =${keys.map(k => `"${k}"`).join("|")};`);
            this.line();

            this.openIndent("declare namespace Phaser.GameObjects {");

            this.line();

            this.openIndent("export interface Sprite {");

            this.line();

            this.line(`play(key: ${this._typeName}, ignoreIfPlaying?: boolean): this;`);
            this.line(`playReverse(key: ${this._typeName}, ignoreIfPlaying?: boolean): this;`);
            this.line(`playAfterDelay(key: ${this._typeName}, delay: number): this;`);
            this.line(`playAfterRepeat(key: ${this._typeName}, repeatCount?: number): this;`);
            this.line(`chain(key: ${this._typeName}|${this._typeName}[]): this;`);

            this.closeIndent("}"); // close interface
            this.closeIndent("}"); // close namespace

            this.line();

            this.openIndent("declare namespace Phaser.Animations {");

            this.line();

            this.openIndent("export interface AnimationState {");

            this.line();

            this.line(`startAnimation(key: ${this._typeName}): Phaser.GameObjects.GameObject;`);
            this.line(`play(key: ${this._typeName}, ignoreIfPlaying?: boolean): Phaser.GameObjects.GameObject;`);
            this.line(`playReverse(key: ${this._typeName}, ignoreIfPlaying?: boolean): Phaser.GameObjects.GameObject;`);
            this.line(`playAfterDelay(key: ${this._typeName}, delay: number): Phaser.GameObjects.GameObject;`);
            this.line(`playAfterRepeat(key: ${this._typeName}, repeatCount?: number): Phaser.GameObjects.GameObject;`);
            this.line(`chain(key: ${this._typeName}|${this._typeName}[]): Phaser.GameObjects.GameObject;`);

            this.closeIndent("}"); // close interface
            this.closeIndent("}"); // close namespace
        }
    }
}