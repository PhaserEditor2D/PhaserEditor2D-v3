
namespace phasereditor2d.scene.ui.sceneobjects {

    export class Layer extends Phaser.GameObjects.Layer implements ISceneGameObject {

        private _editorSupport: LayerEditorSupport;

        constructor(scene: Scene, list: Phaser.GameObjects.GameObject[]) {
            super(scene, list);

            this._editorSupport = new LayerEditorSupport(this, scene);
        }

        getEditorSupport(): LayerEditorSupport {

            return this._editorSupport;
        }

        // polyfill GameObject methods

        setData(key: string | any, data?: any): this {

            return super.setData(key, data);
        }

        incData(key: string | any, data?: any): this {

            return super.incData(key, data);
        }

        toggleData(key: string | any): this {

            return super.toggleData(key);
        }

        replace(oldChild: Phaser.GameObjects.GameObject, newChild: Phaser.GameObjects.GameObject) {

            newChild.displayList = this;

            return super.replace(oldChild, newChild);
        }

        setInteractive(hitArea?: any, callback?: Phaser.Types.Input.HitAreaCallback, dropZone?: boolean): this {

            return this;
        }

        disableInteractive(): this {

            return this;
        }

        removeInteractive(): this {

            return this
        }

        getIndexList(): number[] {

            return [];
        }

        eventNames(): Array<string | symbol> {

            return super["evenNames"]();
        }

        // tslint:disable-next-line:ban-types
        listeners(event: string | symbol): Function[] {

            return super["listeners"](event);
        }

        listenerCount(event: string | symbol): number {

            return super["listenerCount"](event);
        }

        emit(event: string | symbol, ...args: any[]): boolean {

            return super["emit"](event, ...args);
        }

        // tslint:disable-next-line:ban-types
        on(event: string | symbol, fn: Function, context?: any): this {

            return super["on"](event, fn, context);
        }

        // tslint:disable-next-line:ban-types
        addListener(event: string | symbol, fn: Function, context?: any): this {

            return super["addListener"](event, fn, context);
        }

        // tslint:disable-next-line:ban-types
        once(event: string | symbol, fn: Function, context?: any): this {

            return super["once"](event, fn, context);
        }

        // tslint:disable-next-line:ban-types
        removeListener(event: string | symbol, fn?: Function, context?: any, once?: boolean): this {

            return super["removeListener"](event, fn, context, once);
        }

        // tslint:disable-next-line:ban-types
        off(event: string | symbol, fn?: Function, context?: any, once?: boolean): this {

            return super["off"](event, fn, context, once);
        }

        // tslint:disable-next-line:ban-types
        removeAllListeners(event?: string | symbol): this {

            return super["removeAllListeners"](event);
        }

        // tslint:disable-next-line:ban-types
        addToDisplayList(displayList?: Phaser.GameObjects.Layer | Phaser.GameObjects.DisplayList): this {

            return super["addToDisplayList"](displayList);
        }

        // tslint:disable-next-line:ban-types
        addToUpdateList(): this {

            return super["addToUpdateList"]();
        }

        // tslint:disable-next-line:ban-types
        removeFromDisplayList(): this {

            return Phaser.GameObjects.GameObject.prototype.removeFromDisplayList.call(this);
        }

        // tslint:disable-next-line:ban-types
        removeFromUpdateList(): this {

            return Phaser.GameObjects.GameObject.prototype.removeFromUpdateList.call(this);
        }
    }
}