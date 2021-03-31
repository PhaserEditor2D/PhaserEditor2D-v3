
// You can write more code here

/* START OF COMPILED CODE */

class FoodItem extends Phaser.GameObjects.Image {
	
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture || "volcano", frame !== undefined && frame !== null ? frame : "Volcano Level Set_Collectable Object - Meat.png");
		
		/* START-USER-CTR-CODE */

		this.scene.physics.add.existing(this);		

		this.idleTween = this.scene.tweens.add({
			targets: this,
			scaleX: 0.8,
			scaleY: 0.8,
			angle: "-= 30",
			yoyo: true,
			repeat: -1,
			duration: 1000 + Math.random() * 1000
		});

		/* END-USER-CTR-CODE */
	}
	
	/* START-USER-CODE */

	/** @returns {Phaser.Physics.Arcade.Body} */
	getBody() {
		return this.body;
	}

	taken() {
		
		this.getBody().setEnable(false);

		this.idleTween.remove();

		this.scene.add.tween({
			targets: this,
			duration: 500,
			scaleX: 0.6,
			scaleY: 0.6,
			angle: 360,
			alpha: 0,
			y: "-=50",
			ease: Phaser.Math.Easing.Linear,
			onComplete: () => {
				this.destroy();
			},
			onCompleteScope: this
		});
	}	

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
