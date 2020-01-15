/// <reference path="../Component.ts"/>

namespace phasereditor2d.scene.ui.sceneobjects {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;
    import json = core.json;

    export interface ITextureLikeObject extends SceneObject {

        setTexture(key: string, frame?: string | number): void;
    }

    export interface TextureKeys {

        key?: string;
        frame?: string | number;
    }

    export interface TextureData
        extends json.ObjectData {

        texture: TextureKeys;
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

        private _textureKeys: TextureKeys = {};

        buildSetObjectPropertiesCodeDOM(args: SetObjectPropertiesCodeDOMArgs): void {
            // nothing, the properties are set when the object is created.
        }

        writeJSON(ser: json.Serializer): void {

            if (this._textureKeys.key) {

                if (this._textureKeys.frame === null) {
                    this._textureKeys.frame = undefined;
                }

                ser.write("texture", this._textureKeys);
            }
        }

        readJSON(ser: json.Serializer): void {

            const keys = ser.read("texture", {});

            this.setTextureKeys(keys);
        }

        getTextureKeys(): TextureKeys {
            return this._textureKeys;
        }

        setTextureKeys(keys: TextureKeys) {

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