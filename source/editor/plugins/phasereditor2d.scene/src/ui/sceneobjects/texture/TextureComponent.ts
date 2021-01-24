/// <reference path="../Component.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import json = core.json;

    export interface ITextureLikeObject extends ISceneGameObject {

        setTexture(key: string, frame?: string | number): void;
    }

    export interface ITextureKeys {

        key?: string;
        frame?: string | number;
    }

    export interface ITextureData
        extends json.IObjectData {

        texture: ITextureKeys;
    }

    export class TextureComponent extends Component<ITextureLikeObject> {

        static texture: IProperty<ITextureLikeObject> = {
            name: "texture",
            defValue: {},
            getValue: obj => {

                const textureComponent = obj.getEditorSupport().getComponent(TextureComponent) as TextureComponent;

                return textureComponent.getTextureKeys();
            },
            setValue: (obj, value) => {

                const textureComponent = obj.getEditorSupport().getComponent(TextureComponent) as TextureComponent;

                textureComponent.setTextureKeys(value);
            }
        };

        private _textureKeys: ITextureKeys;

        constructor(obj: ITextureLikeObject) {
            super(obj, [
                TextureComponent.texture
            ]);
            this._textureKeys = {};
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
            // nothing, the properties are set when the object is created.
        }

        getTextureKeys(): ITextureKeys {
            return this._textureKeys;
        }

        setTextureKeys(keys: ITextureKeys) {

            this._textureKeys = keys;

            if (this._textureKeys.frame === null) {

                this._textureKeys.frame = undefined;
            }

            const obj = this.getObject() as ITextureLikeObject & IOriginLikeObject;

            const ox = obj.originX;
            const oy = obj.originY;

            obj.setTexture(keys.key || null, keys.frame);

            obj.setOrigin(ox, oy);
        }

        removeTexture() {

            this.setTextureKeys({});
        }
    }
}