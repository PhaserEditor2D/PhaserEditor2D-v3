/// <reference path="UserPropertiesManager.ts" />
namespace phasereditor2d.scene.ui.sceneobjects {

    export function PrefabUserPropertyBuilder(prop: UserProperty) {

        if (prop.getType() instanceof OptionPropertyType) {

            return new PrefabOptionUserPropertyWrapper(prop);

        }

        return new PrefabUserPropertyWrapper(prop);
    }

    export class PrefabUserProperties extends UserPropertiesManager {

        constructor() {
            super(PrefabUserPropertyBuilder);
        }
    }
}