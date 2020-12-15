
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

        getChildren(): ISceneGameObject[] {

            return super.getChildren() as any;
        }

        // polyfill GameObject methods

        parentContainer: Phaser.GameObjects.Container;
        tabIndex: number;
        input: Phaser.Types.Input.InteractiveObject;
        body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | MatterJS.BodyType;

        setInteractive(hitArea?: any, callback?: Phaser.Types.Input.HitAreaCallback, dropZone?: boolean): this {
            throw new Error("Method not implemented.");
        }

        disableInteractive(): this {
            throw new Error("Method not implemented.");
        }

        removeInteractive(): this {
            throw new Error("Method not implemented.");
        }

        getIndexList(): number[] {
            throw new Error("Method not implemented.");
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
    }
}