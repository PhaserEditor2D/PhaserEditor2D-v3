/// <reference path="./EditorSupport.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    export class ContainerSupport extends EditorSupport {

        constructor(extension: ContainerExtension, obj: Container) {
            super(extension, obj);

            this.addSerializer(new TransformSupport(obj));
        }
    }
}