namespace phasereditor2d.scene.ui.sceneobjects {

    export function HitAreaProperty(
        component: Function,
        name: string,
        label: string,
        tooltip: string,
        defValue: any,
    ): IProperty<ISceneGameObject> {

        return {
            name: `hitArea.${name}`,
            label,
            tooltip,
            defValue,
            getValue: (obj:ISceneGameObject) => {

                const objES = obj.getEditorSupport();

                const comp = objES.getComponent(component);

                if (comp) {

                    return comp[name];
                }

                return undefined;
            },
            setValue: (obj:ISceneGameObject, value: any) => {

                const objES = obj.getEditorSupport();

                const comp = objES.getComponent(component);

                if (comp) {

                    comp[name] = value;
                }
            },
        };
    }
}