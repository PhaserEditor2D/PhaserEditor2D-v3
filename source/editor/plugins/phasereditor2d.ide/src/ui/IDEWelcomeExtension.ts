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
                    /* aspect-ratio: 1024 / 355; */
                    max-width: 8em;
                    margin-top: 1em;
                }
                
                ul {
                    list-style-type: none;
                }
                a {
                    text-decoration: none;
                }
            </style>
        
            <div id="welcome-container">

                <img id="welcome-logo" src="/editor/static/logo.png">

                <h1>Welcome to Phaser Editor 2D</h1>
                <h3>A friendly IDE for HTML5 game development</h3>

                <ul>
                    <li><a href="https://help-v3.phasereditor2d.com" target="_blank">🛟 Visit our Help</a></li>
                    <li><a href="https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/new/choose" target="_blank">🐞 Report an issue</a></li>
                    <li><a href="https://phasereditor2d.com" target="_blank">📝 Read the latest news</a></li>
                </ul>

                <p>To send us your feedback email <a href="mailto:support@phaser.io">support@phaser.io</a> or join us on <a target="_blank" href="https://phaser.io/community/discord">Discord</a></p>
        </div>
    </div>`;

            const img = document.createElement("img");
            editor.setIcon(new controls.DefaultImage(img, "static/favicon.png"));
        }
    }
}