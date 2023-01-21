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

            const obj = this.getObject();
            const support = obj.getEditorSupport();
            const prop = TextureComponent.texture;

            if (support.isNestedPrefabInstance()
                && support.isUnlockedProperty(prop)) {

                    const dom = new core.code.MethodCallCodeDOM("setTexture", args.objectVarName);
                    const keys = prop.getValue(obj) as ITextureKeys;
                    dom.argLiteral(keys.key);
                    dom.argStringOrFloat(keys.frame);
                    args.statements.push(dom);
            }
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

            const objES = obj.getEditorSupport();

            if (objES.hasComponent(OriginComponent)) {
                
                obj.setOrigin(ox, oy);
            }

            objES.onUpdateAfterSetTexture();
        }

        removeTexture() {

            this.setTextureKeys({});
        }
    }
}