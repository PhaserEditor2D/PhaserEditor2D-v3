namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class SpriteAnimationConfigSection extends SceneGameObjectSection<Sprite> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.SpriteAnimationConfigSection", "Animation Configuration");
        }

        protected getSectionHelpPath() {

            return "scene-editor/animations-properties.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            this.createNumberPropertyRow(comp, SpriteComponent.animationFrameRate);

            this.createNumberPropertyRow(comp, SpriteComponent.animationDelay);

            this.createNumberPropertyRow(comp, SpriteComponent.animationRepeat);

            this.createNumberPropertyRow(comp, SpriteComponent.animationRepeatDelay);

            this.createPropertyBoolean(comp, SpriteComponent.animationYoyo)
                .labelElement.style.gridColumn = "2 / span 2";

            this.createPropertyBoolean(comp, SpriteComponent.animationShowBeforeDelay)
                .labelElement.style.gridColumn = "2 / span 2";

            this.createPropertyBoolean(comp, SpriteComponent.animationShowOnStart)
                .labelElement.style.gridColumn = "2 / span 2";

            this.createPropertyBoolean(comp, SpriteComponent.animationHideOnComplete)
                .labelElement.style.gridColumn = "2 / span 2"

            this.createNumberPropertyRow(comp, SpriteComponent.animationStartFrame);

            this.createNumberPropertyRow(comp, SpriteComponent.animationTimeScale);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Sprite && obj.animationCustomConfig;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}