namespace phasereditor2d.animations.ui.editors {

    export class AnimationsScene extends scene.ui.BaseScene {

        private _editor: AnimationsEditor;

        constructor(editor: AnimationsEditor) {
            super("AnimationsScene");

            this._editor = editor;
        }

        createSceneMaker(): scene.ui.BaseSceneMaker {

            return new AnimationsSceneMaker(this);
        }

        private computeLayout(selection: Set<any>) {

            const list = this.sys.displayList.list;

            const width = this.scale.width;
            const height = this.scale.height;

            let size = 256;
            let maxY: number;
            let maxX: number;

            while (true) {

                let x = 0;
                let y = 0;
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

                            x = 5;
                            y += size + 5;
                        }
                    }
                }

                if (maxY + size + 5 <= height) {

                    return {
                        size,
                        marginX: Math.floor((width - maxX - size - 5) / 2),
                        marginY: Math.floor((height - maxY - size - 5) / 2),
                    };

                } else {

                    size = size - 4;
                }
            }
        }

        create() {

            this.input.on(Phaser.Input.Events.POINTER_UP, e => {

                const pointer = e as Phaser.Input.Pointer;

                for (const obj of this.sys.displayList.list) {

                    const sprite = obj as Phaser.GameObjects.Sprite;

                    if (sprite.getData("selected")) {

                        const cell = sprite.getData("cell");

                        if (pointer.x >= cell.x
                            && pointer.x <= cell.x + cell.size
                            && pointer.y >= cell.y
                            && pointer.y <= cell.y + cell.size) {

                            this._editor.setSelection([sprite.anims.currentAnim]);
                            this.events.once(Phaser.Scenes.Events.POST_UPDATE, () => this._editor.repaint());
                        }
                    }
                }
            });
        }

        update() {

            const list = this.sys.displayList.list;

            const selection = this.getSelectedAnimations();

            const layout = this.computeLayout(selection);
            const size = layout.size;

            const width = this.scale.width;

            let x = layout.marginX;
            let y = layout.marginY;

            for (const obj of list) {

                const sprite = obj as Phaser.GameObjects.Sprite;

                const selected = selection.size === 0 || selection.has(sprite.anims.currentAnim);

                sprite.setData("selected", selected);

                if (selected) {

                    if (sprite.anims.isPlaying) {

                        sprite.visible = true;

                    } else {

                        if (sprite.data.has("wait")) {

                            if (sprite.data.get("wait") === 0) {

                                sprite.data.remove("wait");

                                sprite.visible = true;
                                sprite.play(sprite.anims.getCurrentKey());

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

                    const marginX = size - sprite.width * scale;
                    const marginY = size - sprite.height * scale;

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
        }

        private getSelectedAnimations() {

            const list = new Set<Phaser.Animations.Animation>();

            const map = new Map<Phaser.Animations.AnimationFrame, Phaser.Animations.Animation>();

            for (const anim of this.anims["anims"].getArray()) {

                for (const frame of anim.frames) {

                    map.set(frame, anim);
                }
            }

            for (const obj of this._editor.getSelection()) {

                if (obj instanceof Phaser.Animations.Animation) {

                    list.add(obj);

                } else {

                    const frame = obj as Phaser.Animations.AnimationFrame;

                    list.add(map.get(frame));
                }
            }

            return list;
        }
    }
}