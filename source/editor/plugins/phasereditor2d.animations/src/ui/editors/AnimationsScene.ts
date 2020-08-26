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

        update() {

            const list = this.sys.displayList.list;

            const size = 128;

            let x = 5;
            let y = 5;

            for (const obj of list) {

                const sprite = obj as Phaser.GameObjects.Sprite;

                if (!sprite.anims.isPlaying) {

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

                if (x + size > this.scale.width - 5) {

                    x = 5;
                    y += size + 5;
                }
            }
        }
    }
}