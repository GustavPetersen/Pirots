import { Application, Assets, Sprite } from 'pixi.js';
import { Howl } from 'howler';

export default async function createBoard(container: HTMLElement): Promise<Application> {
    const app = new Application();
    await app.init( {backgroundColor: 0x1099bb, resizeTo: window});
    container.appendChild(app.canvas);

    const jackpotSound = new Howl({src: ['Assets/Sounds/JACKPOT.mp3']});
    
    const backgroundImg = await Assets.load('Assets/Sprites/slots_background.png');
    const background = new Sprite(backgroundImg);
    background.setSize(app.screen.width, app.screen.height);
    app.stage.addChild(background);

    const boardSize = app.screen.width * 0.5;
    const tileSize = boardSize / 8;
    const diamondSize = tileSize * 0.7;
    const boardStartX = app.screen.width * 0.25; // We have to rename these at some point!
    const boardStartY = (app.screen.height / 2) - (boardSize / 2); // We have to rename these at some point!

    const tileImg = await Assets.load('Assets/Sprites/slots_tile.png');
    const diamondImgs = await Promise.all([
        Assets.load('Assets/Sprites/slots_diamond_blue.png'),
        Assets.load('Assets/Sprites/slots_diamond_red.png'),
        Assets.load('Assets/Sprites/slots_diamond_green.png'),
        Assets.load('Assets/Sprites/slots_diamond_orange.png'),
    ]);
    const diamonds: Sprite[] = [];

    // tiles
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            const tile = new Sprite(tileImg);
            tile.width = tileSize;
            tile.height = tileSize;
            tile.position.set(
                boardStartX + x * tileSize + tileSize,
                boardStartY + y * tileSize + tileSize,
            );
            app.stage.addChild(tile);
        }
    }

    // diamonds
    const randomDiamond = () => diamondImgs[Math.floor(Math.random() * 4)];
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            const d = new Sprite(randomDiamond());
            d.width = diamondSize;
            d.height = diamondSize;
            d.position.set(
                boardStartX + x * tileSize + tileSize * 1.5 - diamondSize * 0.5,
                boardStartY + y * tileSize + tileSize * 1.5 - diamondSize * 0.5,
            );
            app.stage.addChild(d);
            diamonds.push(d);
        }
    }

    function spin() {
        for (const d of diamonds) {
            d.texture = randomDiamond();
        }
    }

    // spin button
    const spinImg = await Assets.load('Assets/Sprites/slots_spin_button.png');
    const spinButton = new Sprite(spinImg);
    spinButton.position.set(boardStartX + boardSize, app.screen.height / 2 - spinButton.height / 2);
    spinButton.eventMode = 'static';
    spinButton.cursor = 'pointer';
    spinButton.on('pointerdown', () => {
        jackpotSound.play();
        spin();
    });
    app.stage.addChild(spinButton);

    return app;
}