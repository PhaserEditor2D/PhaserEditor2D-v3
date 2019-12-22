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

    "Phaser.Loader.LoaderPlugin.tilemapCSV(url)",
    "Phaser.Loader.LoaderPlugin.tilemapImpact(url)",
    "Phaser.Loader.LoaderPlugin.tilemapTiledJSON(url)",

    "Phaser.Loader.LoaderPlugin.unityAtlas(atlasURL)",
    "Phaser.Loader.LoaderPlugin.unityAtlas(textureURL)",
    "Phaser.Types.Loader.FileTypes.UnityAtlasFileConfig.normalMap",

    "Phaser.Loader.LoaderPlugin.video(urls)",

], "../source/client/plugins/phasereditor2d.pack/data/phaser-docs.json");

console.log("DONE!");