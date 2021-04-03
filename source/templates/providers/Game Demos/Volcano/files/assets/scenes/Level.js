
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {
	
	constructor() {
		super("Level");
		
		/** @type {Phaser.GameObjects.Image} */
		this.background;
		/** @type {Phaser.GameObjects.Image} */
		this.blava2;
		/** @type {Phaser.GameObjects.Image} */
		this.blava3;
		/** @type {Phaser.GameObjects.Image} */
		this.blava1;
		/** @type {MovingPlatform1} */
		this.movingPlatform2;
		/** @type {MovingPlatform2} */
		this.movingPlatform1;
		/** @type {MovingPlatform1} */
		this.movingPlatform3;
		/** @type {Phaser.GameObjects.Layer} */
		this.playerLayer;
		/** @type {Player} */
		this.player;
		/** @type {Phaser.GameObjects.Text} */
		this.debugText;
		/** @type {Array<Phaser.GameObjects.Image|MovingPlatform2|MovingPlatform1|Ladder>} */
		this.platforms;
		/** @type {FoodItem[]} */
		this.foodItems;
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	_create() {
		
		// backgroundLayer
		const backgroundLayer = this.add.layer();
		
		// background
		const background = this.add.image(0, 1, "Volcano Level Set_Background - Layer 00");
		background.scaleX = 1.1;
		background.scaleY = 1.1;
		background.setOrigin(0, 0);
		background.tintTopRight = 10494241;
		background.tintBottomLeft = 7220011;
		background.tintBottomRight = 2433506;
		backgroundLayer.add(background);
		
		// blava2
		const blava2 = this.add.image(1334, 0, "Volcano Level Set_Background - Layer 01");
		blava2.setOrigin(0, 0);
		backgroundLayer.add(blava2);
		
		// blava3
		const blava3 = this.add.image(2668, 0, "Volcano Level Set_Background - Layer 01");
		blava3.setOrigin(0, 0);
		backgroundLayer.add(blava3);
		
		// blava1
		const blava1 = this.add.image(0, -1, "Volcano Level Set_Background - Layer 01");
		blava1.setOrigin(0, 0);
		backgroundLayer.add(blava1);
		
		// platformBottomItemsLayer
		const platformBottomItemsLayer = this.add.layer();
		
		// signpost1
		const signpost1 = this.add.image(1536, -344, "volcano", "Volcano Level Set_Environment - Signpost 01.png");
		platformBottomItemsLayer.add(signpost1);
		
		// platformsLayer
		const platformsLayer = this.add.layer();
		
		// movingPlatform2
		const movingPlatform2 = new MovingPlatform1(this, 890, 256);
		platformsLayer.add(movingPlatform2);
		
		// movingPlatform1
		const movingPlatform1 = new MovingPlatform2(this, 311, 577);
		platformsLayer.add(movingPlatform1);
		
		// p4
		const p4 = this.add.image(128, 768, "volcano", "Volcano Level Set_Platformer - Ground Additional 01.png");
		platformsLayer.add(p4);
		
		// p3
		const p3 = this.add.image(256, 640, "volcano", "Volcano Level Set_Platformer - Ground 12.png");
		platformsLayer.add(p3);
		
		// p2
		const p2 = this.add.image(128, 640, "volcano", "Volcano Level Set_Platformer - Ground 11.png");
		platformsLayer.add(p2);
		
		// p1
		const p1 = this.add.image(0, 640, "volcano", "Volcano Level Set_Platformer - Ground 11.png");
		platformsLayer.add(p1);
		
		// movingPlatform3
		const movingPlatform3 = new MovingPlatform1(this, 1920, 0);
		platformsLayer.add(movingPlatform3);
		
		// container_2_1
		const container_2_1 = new MovingPlatform2(this, 1882, 590);
		platformsLayer.add(container_2_1);
		
		// p9
		const p9 = this.add.image(2880, 640, "volcano", "Volcano Level Set_Platformer - Ground Additional 02.png");
		p9.setOrigin(0, 0);
		platformsLayer.add(p9);
		
		// p8
		const p8 = this.add.image(2816, 640, "volcano", "Volcano Level Set_Platformer - Ground 10.png");
		platformsLayer.add(p8);
		
		// p7
		const p7 = this.add.image(2944, 640, "volcano", "Volcano Level Set_Platformer - Ground 11.png");
		platformsLayer.add(p7);
		
		// p6
		const p6 = this.add.image(3073, 640, "volcano", "Volcano Level Set_Platformer - Ground 11.png");
		platformsLayer.add(p6);
		
		// p5
		const p5 = this.add.image(3200, 640, "volcano", "Volcano Level Set_Platformer - Ground 11.png");
		platformsLayer.add(p5);
		
		// p12
		const p12 = this.add.image(1536, 384, "volcano", "Volcano Level Set_Platformer - Stone.png");
		platformsLayer.add(p12);
		
		// p11
		const p11 = this.add.image(1536, -256, "volcano", "Volcano Level Set_Platformer - Stone.png");
		platformsLayer.add(p11);
		
		// p10
		const p10 = this.add.image(1664, -256, "volcano", "Volcano Level Set_Platformer - Stone.png");
		platformsLayer.add(p10);
		
		// volcano_Level_Set_Environment___Crack_07_png
		const volcano_Level_Set_Environment___Crack_07_png = this.add.image(117, 866, "volcano", "Volcano Level Set_Environment - Crack 07.png");
		platformsLayer.add(volcano_Level_Set_Environment___Crack_07_png);
		
		// volcano_Level_Set_Environment___Crack_06_png
		const volcano_Level_Set_Environment___Crack_06_png = this.add.image(212, 664, "volcano", "Volcano Level Set_Environment - Crack 06.png");
		platformsLayer.add(volcano_Level_Set_Environment___Crack_06_png);
		
		// volcano_Level_Set_Environment___Crack_06_png_1
		const volcano_Level_Set_Environment___Crack_06_png_1 = this.add.image(3098, 903, "volcano", "Volcano Level Set_Environment - Crack 06.png");
		platformsLayer.add(volcano_Level_Set_Environment___Crack_06_png_1);
		
		// volcano_Level_Set_Environment___Crack_05_png
		const volcano_Level_Set_Environment___Crack_05_png = this.add.image(2999, 698, "volcano", "Volcano Level Set_Environment - Crack 05.png");
		platformsLayer.add(volcano_Level_Set_Environment___Crack_05_png);
		
		// volcano_Level_Set_Platformer___Brick_02_png_2_1
		const volcano_Level_Set_Platformer___Brick_02_png_2_1 = this.add.image(1792, -256, "volcano", "Volcano Level Set_Platformer - Stone.png");
		platformsLayer.add(volcano_Level_Set_Platformer___Brick_02_png_2_1);
		
		// platformTopItemsLayer
		const platformTopItemsLayer = this.add.layer();
		
		// endFlag
		const endFlag = this.add.image(2944, 526, "volcano", "Volcano Level Set_Environment - White Flag.png");
		platformTopItemsLayer.add(endFlag);
		
		// signpost
		const signpost = this.add.image(131, 519, "volcano", "Volcano Level Set_Environment - Signpost 01.png");
		platformTopItemsLayer.add(signpost);
		
		// skull1
		const skull1 = this.add.image(2093, -28, "volcano", "Volcano Level Set_Environment - Skull.png");
		platformTopItemsLayer.add(skull1);
		
		// lava2
		const lava2 = this.add.image(1059, 250, "volcano", "Volcano Level Set_Environment - Lava 03.png");
		platformTopItemsLayer.add(lava2);
		
		// lava1
		const lava1 = this.add.image(599, 576, "volcano", "Volcano Level Set_Environment - Lava 03.png");
		platformTopItemsLayer.add(lava1);
		
		// lava3
		const lava3 = this.add.image(233, 571, "volcano", "Volcano Level Set_Environment - Lava 02.png");
		platformTopItemsLayer.add(lava3);
		
		// laddersLayer
		const laddersLayer = this.add.layer();
		
		// ladder5
		const ladder5 = new Ladder(this, 1468, -150, "volcano", "Volcano Level Set_Platformer - Ladder.png");
		laddersLayer.add(ladder5);
		
		// ladder4
		const ladder4 = new Ladder(this, 1472, -272, "volcano", "Volcano Level Set_Platformer - Ladder.png");
		laddersLayer.add(ladder4);
		
		// ladder3
		const ladder3 = new Ladder(this, 1475, -22, "volcano", "Volcano Level Set_Platformer - Ladder.png");
		laddersLayer.add(ladder3);
		
		// ladder2
		const ladder2 = new Ladder(this, 1467, 106, "volcano", "Volcano Level Set_Platformer - Ladder.png");
		laddersLayer.add(ladder2);
		
		// ladder1
		const ladder1 = new Ladder(this, 1475, 208);
		laddersLayer.add(ladder1);
		
		// ladder6
		const ladder6 = new Ladder(this, 952, 321);
		laddersLayer.add(ladder6);
		
		// playerLayer
		const playerLayer = this.add.layer();
		
		// player
		const player = new Player(this, 94, 395);
		playerLayer.add(player);
		
		// pickItemsLayer
		const pickItemsLayer = this.add.layer();
		
		// meet3
		const meet3 = new FoodItem(this, 1232, 33, "volcano", "Volcano Level Set_Collectable Object - Meat.png");
		pickItemsLayer.add(meet3);
		
		// meet2
		const meet2 = new FoodItem(this, 2250, 278, "volcano", "Volcano Level Set_Collectable Object - Meat.png");
		pickItemsLayer.add(meet2);
		
		// banana
		const banana = new FoodItem(this, 480, 680, "volcano", "Tiny Caveman_Game Object - Banana.png");
		pickItemsLayer.add(banana);
		
		// apple
		const apple = new FoodItem(this, 600, 160, "volcano", "Tiny Caveman_Game Object - Apple.png");
		pickItemsLayer.add(apple);
		
		// cherry
		const cherry = new FoodItem(this, 1200, 680, "volcano", "Tiny Caveman_Game Object - Cherry.png");
		pickItemsLayer.add(cherry);
		
		// apple2
		const apple2 = new FoodItem(this, 2480, 680, "volcano", "Tiny Caveman_Game Object - Apple.png");
		pickItemsLayer.add(apple2);
		
		// banana1
		const banana1 = new FoodItem(this, 1760, 680, "volcano", "Tiny Caveman_Game Object - Banana.png");
		pickItemsLayer.add(banana1);
		
		// meet1
		const meet1 = new FoodItem(this, 747, 386);
		pickItemsLayer.add(meet1);
		
		// controlsLayer
		const controlsLayer = this.add.layer();
		
		// btn_left
		const btn_left = new PlayerButton(this, 880, 640, "ui", "btn-left");
		controlsLayer.add(btn_left);
		
		// btn_right
		const btn_right = new PlayerButton(this, 1080, 640, "ui", "btn-right");
		controlsLayer.add(btn_right);
		
		// btn_up
		const btn_up = new PlayerButton(this, 126, 640);
		controlsLayer.add(btn_up);
		
		// debugLayer
		const debugLayer = this.add.layer();
		
		// debugText
		const debugText = this.add.text(224, -106, "", {});
		debugText.text = "Debug text.";
		debugText.setStyle({"fontSize":"42px"});
		debugLayer.add(debugText);
		
		// lists
		const platforms = [p1, p2, movingPlatform1, movingPlatform2, movingPlatform3, container_2_1, p8, p6, p5, p9, p7, p12, volcano_Level_Set_Platformer___Brick_02_png_2_1, p10, p11, p3, ladder1, ladder2, ladder3, ladder5, ladder4, ladder6]
		const foodItems = [meet1, banana1, apple2, cherry, banana, meet3, meet2, apple]
		
		// background (components)
		const backgroundScrollFactor = new ScrollFactor(background);
		backgroundScrollFactor.x = 0.1;
		
		// blava2 (components)
		const blava2ScrollFactor = new ScrollFactor(blava2);
		blava2ScrollFactor.x = 1.2;
		blava2ScrollFactor.y = 1;
		
		// blava3 (components)
		const blava3ScrollFactor = new ScrollFactor(blava3);
		blava3ScrollFactor.x = 1.2;
		blava3ScrollFactor.y = 1;
		
		// blava1 (components)
		const blava1ScrollFactor = new ScrollFactor(blava1);
		blava1ScrollFactor.x = 1.2;
		blava1ScrollFactor.y = 1;
		
		// movingPlatform2 (components)
		const movingPlatform2HorizontalMove = HorizontalMove.getComponent(movingPlatform2);
		movingPlatform2HorizontalMove.horizVelocity = -50;
		movingPlatform2HorizontalMove.minX = 540;
		movingPlatform2HorizontalMove.maxX = 1170;
		
		// movingPlatform1 (components)
		const movingPlatform1HorizontalMove = HorizontalMove.getComponent(movingPlatform1);
		movingPlatform1HorizontalMove.minX = 310;
		movingPlatform1HorizontalMove.maxX = 924;
		
		// p3 (components)
		new PlatformPhysics(p3);
		
		// p2 (components)
		new PlatformPhysics(p2);
		
		// p1 (components)
		new PlatformPhysics(p1);
		
		// movingPlatform3 (components)
		const movingPlatform3HorizontalMove = HorizontalMove.getComponent(movingPlatform3);
		movingPlatform3HorizontalMove.horizVelocity = -50;
		movingPlatform3HorizontalMove.minX = 1900;
		movingPlatform3HorizontalMove.maxX = 2224;
		
		// container_2_1 (components)
		const container_2_1HorizontalMove = HorizontalMove.getComponent(container_2_1);
		container_2_1HorizontalMove.minX = 1720;
		container_2_1HorizontalMove.maxX = 2360;
		
		// p8 (components)
		new PlatformPhysics(p8);
		
		// p7 (components)
		new PlatformPhysics(p7);
		
		// p6 (components)
		new PlatformPhysics(p6);
		
		// p5 (components)
		new PlatformPhysics(p5);
		
		// p12 (components)
		new PlatformPhysics(p12);
		
		// p11 (components)
		new PlatformPhysics(p11);
		
		// p10 (components)
		new PlatformPhysics(p10);
		
		// volcano_Level_Set_Platformer___Brick_02_png_2_1 (components)
		new PlatformPhysics(volcano_Level_Set_Platformer___Brick_02_png_2_1);
		
		// skull1 (components)
		const skull1FollowObject = new FollowObject(skull1);
		skull1FollowObject.target = movingPlatform3;
		
		// lava2 (components)
		const lava2FollowObject = new FollowObject(lava2);
		lava2FollowObject.target = movingPlatform2;
		
		// lava1 (components)
		const lava1FollowObject = new FollowObject(lava1);
		lava1FollowObject.target = movingPlatform1;
		
		// ladder6 (components)
		const ladder6FollowObject = new FollowObject(ladder6);
		ladder6FollowObject.target = movingPlatform2;
		
		// player (prefab fields)
		player.platforms = platforms;
		player.foodItems = foodItems;
		
		// btn_left (components)
		const btn_leftPlayerController = PlayerController.getComponent(btn_left);
		btn_leftPlayerController.player = player;
		
		// btn_right (components)
		const btn_rightPlayerController = PlayerController.getComponent(btn_right);
		btn_rightPlayerController.player = player;
		btn_rightPlayerController.direction = "right";
		
		// btn_up (components)
		const btn_upPlayerController = PlayerController.getComponent(btn_up);
		btn_upPlayerController.player = player;
		btn_upPlayerController.direction = "up";
		
		// debugText (components)
		new ScrollFactor(debugText);
		
		this.background = background;
		this.blava2 = blava2;
		this.blava3 = blava3;
		this.blava1 = blava1;
		this.movingPlatform2 = movingPlatform2;
		this.movingPlatform1 = movingPlatform1;
		this.movingPlatform3 = movingPlatform3;
		this.playerLayer = playerLayer;
		this.player = player;
		this.debugText = debugText;
		this.platforms = platforms;
		this.foodItems = foodItems;
	}
	
	/* START-USER-CODE */

	create() {

		this._create();		

		this.cameras.main.setBounds(0, -800, 3000, 750 + 800);
		this.cameras.main.startFollow(this.player);		
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
