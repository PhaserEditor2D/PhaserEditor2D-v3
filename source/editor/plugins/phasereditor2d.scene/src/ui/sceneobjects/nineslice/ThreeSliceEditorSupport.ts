namespace phasereditor2d.scene.ui.sceneobjects {

    export class ThreeSliceEditorSupport extends BaseImageEditorSupport<ThreeSlice> {

        constructor(obj: ThreeSlice, scene: Scene) {
            super(ThreeSliceExtension.getInstance(), obj, scene, true, false, false, false);

            this.addComponent(
                new AlphaSingleComponent(obj),
                new TintSingleComponent(obj),
                new SizeComponent(obj),
                new ThreeSliceComponent(obj));
        }

        setInteractive() {

            this.getObject().setInteractive(interactive_getAlpha_RenderTexture);
        }

        isCustom_SizeComponent_buildSetObjectPropertiesCodeDOM(): boolean {
            
            return true;
        }

        getSizeComponentGeneratesUpdateDisplayOrigin(): boolean {
            
            return false;
        }

        onUpdateAfterSetTexture(): void {
            
            const obj = this.getObject();
            obj.updateVertices();
            (obj as any).updateUVs();
        }
    }
}