
// You can write more code here

/* START OF COMPILED CODE */

class NestedPrefabInContainerPrefab extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 223, y ?? 114);

		// multicolor
		const multicolor = new AnotherPrefabPrefab(scene, 282, 188);
		this.add(multicolor);

		// nestedText
		const nestedText = scene.add.text(0, 0, "", {});
		nestedText.text = "nested text 1";
		nestedText.setStyle({ "fontFamily": "courier", "fontSize": "40px" });
		this.add(nestedText);

		// containerOfNested
		const containerOfNested = scene.add.container(0, 98);
		this.add(containerOfNested);

		// nestedTextInsideContainer
		const nestedTextInsideContainer = scene.add.text(0, 0, "", {});
		nestedTextInsideContainer.text = "nested text inside container";
		nestedTextInsideContainer.setStyle({ "fontFamily": "courier", "fontSize": "40px" });
		containerOfNested.add(nestedTextInsideContainer);

		this.multicolor = multicolor;
		this.nestedText = nestedText;
		this.containerOfNested = containerOfNested;
		this.nestedTextInsideContainer = nestedTextInsideContainer;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	public multicolor: AnotherPrefabPrefab;
	public nestedText: Phaser.GameObjects.Text;
	public containerOfNested: Phaser.GameObjects.Container;
	public nestedTextInsideContainer: Phaser.GameObjects.Text;

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
