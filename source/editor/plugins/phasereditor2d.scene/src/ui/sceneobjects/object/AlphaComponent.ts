namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IAlphaLikeObject extends ISceneGameObject {

        alpha: number;
        alphaTopLeft: number;
        alphaTopRight: number;
        alphaBottomLeft: number;
        alphaBottomRight: number;
    }

    export class AlphaComponent extends Component<IAlphaLikeObject> {

        static alpha: IProperty<IAlphaLikeObject> = {
            name: "alpha",
            label: "Alpha",
            tooltip: "phaser:Phaser.GameObjects.Components.Alpha.alpha",
            defValue: 1,
            increment: 0.01,
            incrementMin: 0,
            incrementMax: 1,
            getValue: obj => obj.alpha,
            setValue: (obj, value) => obj.alpha = Phaser.Math.Clamp(value, 0, 1)
        };

        static alphaTopLeft: IProperty<IAlphaLikeObject> = {
            name: "alphaTopLeft",
            label: "Left",
            tooltip: "phaser:Phaser.GameObjects.Components.Alpha.alphaTopLeft",
            defValue: 1,
            increment: 0.01,
            incrementMin: 0,
            incrementMax: 1,
            getValue: obj => obj.alphaTopLeft,
            setValue: (obj, value) => obj.alphaTopLeft = Phaser.Math.Clamp(value, 0, 1)
        };

        static alphaTopRight: IProperty<IAlphaLikeObject> = {
            name: "alphaTopRight",
            label: "Right",
            tooltip: "phaser:Phaser.GameObjects.Components.Alpha.alphaTopRight",
            defValue: 1,
            increment: 0.01,
            incrementMin: 0,
            incrementMax: 1,
            getValue: obj => obj.alphaTopRight,
            setValue: (obj, value) => obj.alphaTopRight = Phaser.Math.Clamp(value, 0, 1)
        };

        static alphaBottomLeft: IProperty<IAlphaLikeObject> = {
            name: "alphaBottomLeft",
            label: "Left",
            tooltip: "phaser:Phaser.GameObjects.Components.Alpha.alphaBottomLeft",
            defValue: 1,
            increment: 0.01,
            incrementMin: 0,
            incrementMax: 1,
            getValue: obj => obj.alphaBottomLeft,
            setValue: (obj, value) => obj.alphaBottomLeft = Phaser.Math.Clamp(value, 0, 1)
        };

        static alphaBottomRight: IProperty<IAlphaLikeObject> = {
            name: "alphaBottomRight",
            label: "Right",
            tooltip: "phaser:Phaser.GameObjects.Components.Alpha.alphaBottomRight",
            defValue: 1,
            increment: 0.01,
            incrementMin: 0,
            incrementMax: 1,
            getValue: obj => obj.alphaBottomRight,
            setValue: (obj, value) => obj.alphaBottomRight = Phaser.Math.Clamp(value, 0, 1)
        };

        static alphaTop: IPropertyXY = {
            label: "Alpha Top",
            x: AlphaComponent.alphaTopLeft,
            y: AlphaComponent.alphaTopRight
        };

        static alphaBottom: IPropertyXY = {
            label: "Alpha Bottom",
            x: AlphaComponent.alphaBottomLeft,
            y: AlphaComponent.alphaBottomRight
        };

        constructor(obj: IAlphaLikeObject) {
            super(obj, [
                AlphaComponent.alpha,
                AlphaComponent.alphaTopLeft,
                AlphaComponent.alphaTopRight,
                AlphaComponent.alphaBottomLeft,
                AlphaComponent.alphaBottomRight
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, ...this.getProperties());
        }
    }
}