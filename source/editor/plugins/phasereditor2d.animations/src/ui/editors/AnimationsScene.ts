namespace phasereditor2d.animations.ui.editors {

    const padding = 10;

    export class AnimationsScene extends scene.ui.BaseScene {

        private _editor: AnimationsEditor;
        private _resetCallback: () => void;

        constructor(editor: AnimationsEditor) {
            super("AnimationsScene");

            this._editor = editor;
        }

        removeAll() {

            for (const sprite of this.getSprites()) {

                sprite.destroy();
            }

            this.sys.displayList.removeAll();
            this.sys.updateList.removeAll();
        }

        createSceneMaker(): scene.ui.BaseSceneMaker {

            return new AnimationsSceneMaker(this);
        }

        getMaker() {

            return super.getMaker() as AnimationsSceneMaker;
        }

        setReset(callback: () => void) {

            this._resetCallback = callback;
        }

        private computeLayout(selection: Set<any>) {

            const list = this.sys.displayList.list;

            const width = this.scale.width;
            const height = this.scale.height;

            let size = 256;
            let maxY: number;
            let maxX: number;

            while (true) {

                let x = padding;
                let y = padding;
                maxY = 0;
                maxX = 0;

                for (const obj of list) {

                    const sprite = obj as Phaser.GameObjects.Sprite;

                    const selected = selection.size === 0 || selection.has(sprite.anims.currentAnim);

                    if (selected) {

                        // paint
                        maxY = y;
                        maxX = Math.max(x, maxX);

                        x += size + 5;

                        if (x + size > width) {

                            x = padding;
                            y += size + 5;
                        }
                    }
                }

                if (maxY + size + 5 <= height) {

                    return {
                        size,
                        marginX: Math.max(padding, Math.floor((width - maxX - size - 5) / 2)),
                        marginY: Math.max(padding, Math.floor((height - maxY - size - 5) / 2)),
                    };

                } else {

                    size = size - 4;
                }
            }
        }

        create() {

            this.input.on(Phaser.Input.Events.POINTER_UP, e => {

                let sel = [];

                const pointer = e as Phaser.Input.Pointer;

                for (const obj of this.sys.displayList.list) {

                    const sprite = obj as Phaser.GameObjects.Sprite;

                    if (sprite.getData("selected")) {

                        const cell = sprite.getData("cell");

                        if (pointer.x >= cell.x
                            && pointer.x <= cell.x + cell.size
                            && pointer.y >= cell.y
                            && pointer.y <= cell.y + cell.size) {

                            sel = [sprite.anims.currentAnim];
                            break;
                        }
                    }
                }

                this._editor.setSelection(sel);
                this.game.canvas.focus();
            });
        }

        update() {

            if (this._resetCallback) {

                this._resetCallback();

                this._resetCallback = null;

                return;
            }

            const list = this.sys.displayList.list;

            const selectionSet = new Set(this._editor.getSelectedAnimations());

            const layout = this.computeLayout(selectionSet);
            const size = layout.size;

            const width = this.scale.width;

            let x = layout.marginX;
            let y = layout.marginY;

            for (const obj of list) {

                const sprite = obj as Phaser.GameObjects.Sprite;

                const selected = selectionSet.size === 0 || selectionSet.has(sprite.anims.currentAnim);

                sprite.setData("selected", selected);

                if (selected) {

                    if (sprite.anims.isPlaying) {

                        sprite.visible = true;

                    } else {

                        if (sprite.data.has("wait")) {

                            if (sprite.data.get("wait") === 0) {

                                sprite.data.remove("wait");

                                sprite.visible = true;

                                try {
                                    // TODO: Phaser 3.50
                                    sprite.play(sprite.anims.currentAnim.key);

                                } catch (e) {
                                    // nothing
                                }

                            } else {

                                sprite.data.set("wait", sprite.data.get("wait") - 1);
                            }

                        } else {

                            sprite.data.set("wait", 60);
                        }
                    }

                    sprite.setOrigin(0, 0);

                    let scale = 1;

                    if (sprite.width > sprite.height) {

                        scale = size / sprite.width;

                    } else {

                        scale = size / sprite.height;
                    }

                    sprite.setScale(scale, scale);

                    const marginX = size / 2 - sprite.width * scale / 2;
                    const marginY = size / 2 - sprite.height * scale / 2;

                    sprite.setData("cell", { x, y, size });

                    sprite.x = x + marginX;
                    sprite.y = y + marginY;

                    x += size + 5;

                    if (x + size > width) {

                        x = layout.marginX;
                        y += size + 5;
                    }

                } else {

                    sprite.visible = false;
                    sprite.data.set("wait", 0);
                }
            }

            this._editor.repaint();
        }

        getSprites() {

            if (this.sys.displayList) {

                return this.sys.displayList.list as Phaser.GameObjects.Sprite[];
            }

            return [];
        }
    }
}