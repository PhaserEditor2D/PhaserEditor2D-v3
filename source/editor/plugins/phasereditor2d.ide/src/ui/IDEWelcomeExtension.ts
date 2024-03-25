namespace phasereditor2d.ide.ui {

    import controls = colibri.ui.controls;

    export class IDEWelcomeExtension extends colibri.ui.ide.welcome.WelcomePageExtension {

        buildPage(editor: colibri.ui.ide.welcome.WelcomePage, contentElement: HTMLDivElement): void {

            contentElement.innerHTML = `<div>

            <style>

                p {
                    margin: 1em 0;
                }

                #welcome-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 80%;
                    margin-left: 10%;
                }

                #welcome-logo {
                    width: 100%;
                    max-width: 20em;
                }
                
                ul {
                    list-style-type: none;
                }
                a {
                    text-decoration: none;
                }
            </style>
        
            <div id="welcome-container">

                <h1>Welcome to</h1>
                
                <img id="welcome-logo" src="/editor/static/phaser-editor-512.png">

                <h3>A friendly IDE for Phaser game development</h3>

                <ul>
                    <li><a href="https://help-v3.phasereditor2d.com" target="_blank">🛟 Visit our Help site</a></li>
                    <li><a href="https://phasereditor2d.com" target="_blank">📝 Read the Latest News</a></li>
                    <li><a href=https://phaser.io/community/discord" target="_blank">🎮 Join our Discord</a></li>
                    <li><a href="https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/new/choose" target="_blank">🐞 Found a bug? Report it here!</a></li>
                </ul>

                <p>Send feedback and feature requests to <a href="mailto:support@phaser.io">support@phaser.io</a>.</p>

                <p>
                    <button onclick='colibri.Platform.getWorkbench().getCommandManager().executeCommand("phasereditor2d.scene.ui.editor.commands.OpenSceneFile")'>Open a Scene</button>
                </p>
        </div>
    </div>`;

            const img = document.createElement("img");
            editor.setIcon(new controls.DefaultImage(img, "static/favicon.png"));
        }
    }
}