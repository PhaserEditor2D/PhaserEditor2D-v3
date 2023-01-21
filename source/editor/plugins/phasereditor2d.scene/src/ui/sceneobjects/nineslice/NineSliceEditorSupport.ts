namespace phasereditor2d.scene.ui.sceneobjects {

    export class NineSliceEditorSupport extends BaseImageEditorSupport<NineSlice> {

        constructor(obj: NineSlice, scene: Scene) {
            super(NineSliceExtension.getInstance(), obj, scene, true, false, false, false);

            this.addComponent(new SizeComponent(obj));
            this.addComponent(new NineSliceComponent(obj));
        }

        setInteractive() {

            this.getObject().setInteractive(interactive_getAlpha_RenderTexture);
        }

        getSizeComponentGeneratesUpdateDisplayOrigin(): boolean {
            
            return false;
        }

        isCustom_SizeComponent_buildSetObjectPropertiesCodeDOM(): boolean {
            
            return true;
        }

        onUpdateAfterSetTexture(): void {
            
            const obj = this.getObject();
            obj.updateVertices();
            (obj as any).updateUVs();
        }
    }
}