/// <reference path="./BaseHitAreaComponent.ts" />
/// <reference path="./HitAreaProperty.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export class PixelPerfectHitAreaComponent extends BaseHitAreaComponent {

        static alphaTolerance = HitAreaProperty(PixelPerfectHitAreaComponent, "alphaTolerance", "Alpha Tolerance", "phaser:Phaser.Input.InputPlugin.makePixelPerfect(alphaTolerance)", 1);

        public alphaTolerance = 1;

        constructor(obj: ISceneGameObject) {
            super(obj, HitAreaShape.PIXEL_PERFECT, [
                PixelPerfectHitAreaComponent.alphaTolerance
            ]);
        }

        static getPixelPerfectComponent(obj: ISceneGameObject) {

            const objES = obj.getEditorSupport();

            const comp = objES.getComponent(PixelPerfectHitAreaComponent) as PixelPerfectHitAreaComponent;

            return comp;
        }

        protected _setDefaultValues(x:number, y: number, width: number, height: number): void {
            // nothing
        }

        protected buildSetInteractiveCodeCOM(
            args: ISetObjectPropertiesCodeDOMArgs,
            obj: ISceneGameObject,
            code: core.code.MethodCallCodeDOM): void {

            const objES = this.getEditorSupport();

            const scene = objES.getScene();

            const sceneVar = scene.isPrefabSceneType() ?
                "this.scene" : "this";

            const alpha = this.alphaTolerance === 1 ? "" : this.alphaTolerance;

            code.arg(`${sceneVar}.input.makePixelPerfect(${alpha})`);
        }
    }
}