/// <reference path="../Component.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;
    import json = core.json;

    export interface ITextureLikeObject extends ISceneObject {

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

        private _textureKeys: ITextureKeys = {};

        constructor(obj: ITextureLikeObject) {
            super(obj, [
                TextureComponent.texture
            ]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
            // nothing, the properties are set when the object is created.
        }

        writeJSON(ser: json.Serializer): void {

            this.write(ser, TextureComponent.texture);
        }

        readJSON(ser: json.Serializer): void {

            this.read(ser, TextureComponent.texture);
        }

        getTextureKeys(): ITextureKeys {
            return this._textureKeys;
        }

        setTextureKeys(keys: ITextureKeys) {

            this._textureKeys = keys;

            if (this._textureKeys.frame === null) {

                this._textureKeys.frame = undefined;
            }

            const obj = this.getObject();

            obj.setTexture(keys.key || null, keys.frame);

            // this should be called each time the texture is changed
            obj.setInteractive();
        }

        removeTexture() {

            this.setTextureKeys({});
        }
    }
}