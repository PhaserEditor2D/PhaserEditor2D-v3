#!/usr/bin/node

const utils = require("./help-file");

utils.makeHelpFile([

    "Phaser.Loader.LoaderPlugin.atlas(atlasURL)",
    "Phaser.Loader.LoaderPlugin.atlas(textureURL)",
    "Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig.normalMap",

    "Phaser.Loader.LoaderPlugin.atlasXML(atlasURL)",
    "Phaser.Loader.LoaderPlugin.atlasXML(textureURL)",
    "Phaser.Types.Loader.FileTypes.AtlasXMLFileConfig.normalMap",

    "Phaser.Loader.LoaderPlugin.audio(urls)",

    "Phaser.Loader.LoaderPlugin.audioSprite(jsonURL)",
    "Phaser.Loader.LoaderPlugin.audioSprite(audioURL)",

    "Phaser.Loader.LoaderPlugin.bitmapFont(fontDataURL)",
    "Phaser.Loader.LoaderPlugin.bitmapFont(textureURL)",
    "Phaser.Types.Loader.FileTypes.BitmapFontFileConfig.normalMap",

    "Phaser.Loader.LoaderPlugin.htmlTexture(url)",
    "Phaser.Loader.LoaderPlugin.htmlTexture(width)",
    "Phaser.Loader.LoaderPlugin.htmlTexture(height)",

    "Phaser.Loader.LoaderPlugin.image(url)",
    "Phaser.Types.Loader.FileTypes.ImageFileConfig.normalMap",

    "Phaser.Loader.LoaderPlugin.multiatlas(atlasURL)",
    "Phaser.Loader.LoaderPlugin.multiatlas(path)",

    "Phaser.Loader.LoaderPlugin.plugin(url)",
    "Phaser.Loader.LoaderPlugin.plugin(start)",
    "Phaser.Loader.LoaderPlugin.plugin(mapping)",

    "Phaser.Loader.LoaderPlugin.scenePlugin(url)",
    "Phaser.Loader.LoaderPlugin.scenePlugin(systemKey)",
    "Phaser.Loader.LoaderPlugin.scenePlugin(sceneKey)",

    "Phaser.Loader.LoaderPlugin.animation(url)",
    "Phaser.Loader.LoaderPlugin.sceneFile(url)",
    "Phaser.Loader.LoaderPlugin.script(url)",
    "Phaser.Loader.LoaderPlugin.text(url)",
    "Phaser.Loader.LoaderPlugin.glsl(url)",
    "Phaser.Loader.LoaderPlugin.html(url)",
    "Phaser.Loader.LoaderPlugin.json(url)",
    "Phaser.Loader.LoaderPlugin.xml(url)",

    "Phaser.Types.Textures.SpriteSheetConfig.frameWidth",
    "Phaser.Types.Textures.SpriteSheetConfig.frameHeight",
    "Phaser.Types.Textures.SpriteSheetConfig.startFrame",
    "Phaser.Types.Textures.SpriteSheetConfig.endFrame",
    "Phaser.Types.Textures.SpriteSheetConfig.margin",
    "Phaser.Types.Textures.SpriteSheetConfig.spacing",

    "Phaser.Loader.LoaderPlugin.spritesheet(url)",

    "Phaser.Loader.LoaderPlugin.svg(url)",
    "Phaser.Types.Loader.FileTypes.SVGSizeConfig.width",
    "Phaser.Types.Loader.FileTypes.SVGSizeConfig.height",
    "Phaser.Types.Loader.FileTypes.SVGSizeConfig.scale",

    "Phaser.Loader.LoaderPlugin.tilemapCSV(url)",
    "Phaser.Loader.LoaderPlugin.tilemapImpact(url)",
    "Phaser.Loader.LoaderPlugin.tilemapTiledJSON(url)",

    "Phaser.Loader.LoaderPlugin.unityAtlas(atlasURL)",
    "Phaser.Loader.LoaderPlugin.unityAtlas(textureURL)",
    "Phaser.Types.Loader.FileTypes.UnityAtlasFileConfig.normalMap",

    "Phaser.Loader.LoaderPlugin.video(urls)",

], "../source/editor/plugins/phasereditor2d.pack/data/phaser-docs.json");

utils.makeHelpFile([

    "Phaser.GameObjects.Image",
    "Phaser.GameObjects.Sprite",
    "Phaser.GameObjects.Container",

    "Phaser.GameObjects.Components.Transform.x",
    "Phaser.GameObjects.Components.Transform.y",
    "Phaser.GameObjects.Components.Transform.setPosition",
    "Phaser.GameObjects.Components.Transform.scaleX",
    "Phaser.GameObjects.Components.Transform.scaleY",
    "Phaser.GameObjects.Components.Transform.angle",

    "Phaser.GameObjects.Components.Origin.originX",
    "Phaser.GameObjects.Components.Origin.originY",
    "Phaser.GameObjects.Components.Origin.setOrigin",

    "Phaser.GameObjects.Components.Alpha.alpha",
    "Phaser.GameObjects.Components.Alpha.alphaTopLeft",
    "Phaser.GameObjects.Components.Alpha.alphaTopRight",
    "Phaser.GameObjects.Components.Alpha.alphaBottomLeft",
    "Phaser.GameObjects.Components.Alpha.alphaBottomRight",

    "Phaser.GameObjects.Components.Flip.flipX",
    "Phaser.GameObjects.Components.Flip.flipY",

    "Phaser.GameObjects.Components.Visible.visible",

    "Phaser.GameObjects.Components.Tint.tint",
    "Phaser.GameObjects.Components.Tint.tintFill",
    "Phaser.GameObjects.Components.Tint.tintTopLeft",
    "Phaser.GameObjects.Components.Tint.tintTopRight",
    "Phaser.GameObjects.Components.Tint.tintBottomLeft",
    "Phaser.GameObjects.Components.Tint.tintBottomRight",

    "Phaser.GameObjects.TileSprite",
    "Phaser.GameObjects.Components.ComputedSize.width",
    "Phaser.GameObjects.Components.ComputedSize.height",
    "Phaser.GameObjects.Components.ComputedSize.setSize",
    "Phaser.GameObjects.TileSprite.tilePositionX",
    "Phaser.GameObjects.TileSprite.tilePositionY",
    "Phaser.GameObjects.TileSprite.setTilePosition",
    "Phaser.GameObjects.TileSprite.tileScaleX",
    "Phaser.GameObjects.TileSprite.tileScaleY",
    "Phaser.GameObjects.TileSprite.setTileScale",

    "Phaser.GameObjects.GameObject.parentContainer",

    "Phaser.GameObjects.Text",
    "Phaser.Types.GameObjects.Text.TextStyle.fixedWidth",
    "Phaser.Types.GameObjects.Text.TextStyle.fixedHeight",
    "Phaser.GameObjects.TextStyle.setFixedSize",
    "Phaser.GameObjects.Text.setPadding",
    "Phaser.Types.GameObjects.Text.TextPadding.left",
    "Phaser.Types.GameObjects.Text.TextPadding.top",
    "Phaser.Types.GameObjects.Text.TextPadding.right",
    "Phaser.Types.GameObjects.Text.TextPadding.bottom",
    "Phaser.GameObjects.Text.lineSpacing",
    "Phaser.GameObjects.Text.setAlign",
    "Phaser.GameObjects.Text.setFontFamily",
    "Phaser.GameObjects.Text.setFontSize",
    "Phaser.GameObjects.Text.setFontStyle",
    "Phaser.GameObjects.Text.setColor",
    "Phaser.GameObjects.Text.setStroke(color)",
    "Phaser.GameObjects.Text.setStroke(thickness)",
    "Phaser.GameObjects.Text.setBackgroundColor",
    "Phaser.GameObjects.Text.setShadowOffset",
    "Phaser.GameObjects.Text.setShadowOffset(x)",
    "Phaser.GameObjects.Text.setShadowOffset(y)",
    "Phaser.GameObjects.Text.setShadowStroke",
    "Phaser.GameObjects.Text.setShadowFill",
    "Phaser.GameObjects.Text.setShadowColor",
    "Phaser.GameObjects.Text.setShadowBlur",
    "Phaser.GameObjects.TextStyle.baselineX",
    "Phaser.GameObjects.TextStyle.baselineY",
    "Phaser.GameObjects.Text.setMaxLines",

    "Phaser.GameObjects.BitmapText",
    "Phaser.GameObjects.BitmapText.setFont",
    "Phaser.GameObjects.BitmapText.align",
    "Phaser.GameObjects.BitmapText.setFontSize",
    "Phaser.GameObjects.BitmapText.setLetterSpacing",
    "Phaser.GameObjects.BitmapText.dropShadowX",
    "Phaser.GameObjects.BitmapText.dropShadowY",
    "Phaser.GameObjects.BitmapText.dropShadowColor",
    "Phaser.GameObjects.BitmapText.dropShadowAlpha",


    "Phaser.Tilemaps.Tilemap",
    "Phaser.Tilemaps.Tilemap.tileWidth",
    "Phaser.Tilemaps.Tilemap.tileHeight",
    "Phaser.GameObjects.GameObjectFactory.tilemap(key)",

    "Phaser.Tilemaps.Tileset",
    "Phaser.Tilemaps.Tileset.name",
    "Phaser.Tilemaps.Tileset.image",
    "Phaser.Tilemaps.Tileset.tileWidth",
    "Phaser.Tilemaps.Tileset.tileHeight",
    "Phaser.Tilemaps.Tileset.tileMargin",
    "Phaser.Tilemaps.Tileset.tileSpacing",

    "Phaser.Tilemaps.TilemapLayer",
    "Phaser.Tilemaps.TilemapLayer",

    "Phaser.Tilemaps.LayerData",
    "Phaser.Tilemaps.LayerData.name",
    "Phaser.Tilemaps.LayerData.width",
    "Phaser.Tilemaps.LayerData.height",
    "Phaser.Tilemaps.LayerData.tileWidth",
    "Phaser.Tilemaps.LayerData.tileHeight",
    "Phaser.Tilemaps.LayerData.widthInPixels",
    "Phaser.Tilemaps.LayerData.heightInPixels",

    "Phaser.GameObjects.Shape",
    "Phaser.GameObjects.Shape.isFilled",
    "Phaser.GameObjects.Shape.fillColor",
    "Phaser.GameObjects.Shape.fillAlpha",
    "Phaser.GameObjects.Shape.isStroked",
    "Phaser.GameObjects.Shape.strokeColor",
    "Phaser.GameObjects.Shape.strokeAlpha",
    "Phaser.GameObjects.Shape.lineWidth",

    "Phaser.GameObjects.Rectangle",

    "Phaser.GameObjects.Ellipse",
    "Phaser.GameObjects.Ellipse.smoothness",

    "Phaser.GameObjects.Triangle",

    "Phaser.Geom.Triangle.x1",
    "Phaser.Geom.Triangle.y1",
    "Phaser.Geom.Triangle.x2",
    "Phaser.Geom.Triangle.y2",
    "Phaser.Geom.Triangle.x3",
    "Phaser.Geom.Triangle.y3",

    "Phaser.GameObjects.Layer",
    
], "../source/editor/plugins/phasereditor2d.scene/data/phaser-docs.json");

utils.makeHelpFile([

    "Phaser.Types.Animations.Animation.key",
    "Phaser.Types.Animations.Animation.frameRate",
    "Phaser.Types.Animations.Animation.delay",
    "Phaser.Types.Animations.Animation.repeat",
    "Phaser.Types.Animations.Animation.repeatDelay",
    "Phaser.Types.Animations.Animation.yoyo",
    "Phaser.Types.Animations.Animation.showOnStart",
    "Phaser.Types.Animations.Animation.hideOnComplete",
    "Phaser.Types.Animations.Animation.skipMissedFrames",

], "../source/editor/plugins/phasereditor2d.animations/data/phaser-docs.json");

console.log("DONE!");