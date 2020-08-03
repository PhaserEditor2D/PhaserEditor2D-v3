/// <reference path="./BaseSection.ts" />

namespace phasereditor2d.pack.ui.editor.properties {

    import controls = colibri.ui.controls;
    import json = colibri.core.json;

    export class SpritesheetFrameSection extends BaseSection {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.editor.properties.SpritesheetFrameSection", "Spritesheet Frame", core.SPRITESHEET_TYPE);
        }

        canEdit(obj: any, n: number) {
            return obj instanceof core.SpritesheetAssetPackItem;
        }

        canEditNumber(n: number) {
            return n > 0;
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            comp.style.gridTemplateColumns = "auto 1fr auto";

            this.createSimpleIntegerField(comp, "Frame Width", "frameConfig.frameWidth",
                "Phaser.Types.Textures.SpriteSheetConfig.frameWidth");

            this.createSimpleIntegerField(comp, "Frame Height", "frameConfig.frameHeight",
                "Phaser.Types.Textures.SpriteSheetConfig.frameHeight");

            this.createSimpleIntegerField(comp, "Start Frame", "frameConfig.startFrame",
                "Phaser.Types.Textures.SpriteSheetConfig.startFrame");

            this.createSimpleIntegerField(comp, "End Frame", "frameConfig.endFrame",
                "Phaser.Types.Textures.SpriteSheetConfig.endFrame");

            this.createSimpleIntegerField(comp, "Margin", "frameConfig.margin",
                "Phaser.Types.Textures.SpriteSheetConfig.margin");

            this.createSimpleIntegerField(comp, "Spacing", "frameConfig.spacing",
                "Phaser.Types.Textures.SpriteSheetConfig.spacing");
        }
    }
}