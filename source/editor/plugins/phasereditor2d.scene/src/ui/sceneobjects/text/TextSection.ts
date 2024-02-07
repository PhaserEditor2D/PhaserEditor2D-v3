namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TextSection extends SceneGameObjectSection<Text> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor.scene.ui.sceneobjects.TextSection", "Text");
        }

        getSectionHelpPath() {

            return "scene-editor/text-object.html#text-type-properties";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesXY(parent);

            // fontFamily
            this.createPropertyStringRow(comp, TextComponent.fontFamily).text.style.gridColumn = "3 / span 4";

            // fontSize
            {
                const row = this.createPropertyStringRow(comp, TextComponent.fontSize, true, false, true);
                row.text.style.gridColumn = "3 / span 4";
            }

            // fontStyle
            this.createPropertyEnumRow(comp, TextComponent.fontStyle).style.gridColumn = "3 / span 4";

            // align
            this.createPropertyEnumRow(comp, TextComponent.align).style.gridColumn = "3 / span 4";

            // color
            this.createPropertyColorRow(comp, TextComponent.color).element.style.gridColumn = "3 / span 4";

            // stroke
            this.createPropertyColorRow(comp, TextComponent.stroke).element.style.gridColumn = "3 / span 4";

            // strokeThickness
            this.createPropertyFloatRow(comp, TextComponent.strokeThickness).style.gridColumn = "3 / span 4";

            // backgroundColor
            this.createPropertyColorRow(comp, TextComponent.backgroundColor).element.style.gridColumn = "3 / span 4";

            // shadow
            this.createPropertyBoolXYRow(comp, TextComponent.shadow);

            // shadowOffset
            this.createPropertyXYRow(comp, TextComponent.shadowOffset);

            // shadowColor
            this.createPropertyColorRow(comp, TextComponent.shadowColor).element.style.gridColumn = "3 / span 4";

            // shadowBlur
            this.createPropertyFloatRow(comp, TextComponent.shadowBlur).style.gridColumn = "3 / span 4";

            // fixedSize
            this.createPropertyXYRow(comp, TextComponent.fixedSize);

            {
                // padding

                const comp2 = this.createGridElement(comp);
                comp2.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
                comp2.style.gridColumn = "3 / span 4";
                comp2.style.paddingBottom = "0px";
                comp.appendChild(comp2);

                this.createLabel(comp2, "Left").style.justifySelf = "center";
                this.createLabel(comp2, "Top").style.justifySelf = "center";
                this.createLabel(comp2, "Right").style.justifySelf = "center";
                this.createLabel(comp2, "Bottom").style.justifySelf = "center";

                this.createLock(comp,
                    TextComponent.paddingLeft,
                    TextComponent.paddingTop,
                    TextComponent.paddingRight,
                    TextComponent.paddingBottom,
                );

                this.createLabel(comp, "Padding", PhaserHelp("phaser:Phaser.GameObjects.Text.setPadding"));

                const comp3 = this.createGridElement(comp);
                comp3.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
                comp3.style.gridColumn = "3 / span 4";
                comp.appendChild(comp3);

                this.createFloatField(comp3, TextComponent.paddingLeft);
                this.createFloatField(comp3, TextComponent.paddingTop);
                this.createFloatField(comp3, TextComponent.paddingRight);
                this.createFloatField(comp3, TextComponent.paddingBottom);
            }

            // baseline
            this.createPropertyXYRow(comp, TextComponent.baseline);

            // lineSpacing
            this.createPropertyFloatRow(comp, TextComponent.lineSpacing).style.gridColumn = "3 / span 4";

            // maxLines
            this.createPropertyFloatRow(comp, TextComponent.maxLines).style.gridColumn = "3 / span 4";

            // wordWrapWidth
            this.createPropertyFloatRow(comp, TextComponent.wordWrapWidth).style.gridColumn = "3 / span 4";

            // useAdvancedWrap
            this.createPropertyBoolean(comp, TextComponent.useAdvancedWrap)
                .checkElement.style.gridColumn = "3 / span 4";
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Text;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }

    }
}