import { Application, Assets, Sprite } from 'pixi.js';
import { Howl } from 'howler';

const board = (async () => {
    const app = new Application();
    await app.init( {backgroundColor: 0x1099bb, resizeTo: window});
    document.body.replaceChildren(app.canvas);
    const jackpotSound = new Howl({src: ['Assets/Sounds/JACKPOT.mp3']});


    const background_img = await Assets.load('Assets/Sprites/slots_background.png');
    const background_sprite = new Sprite(background_img);
    app.stage.addChild(background_sprite);

    const board_size = app.screen.width * 0.5;
    const tile_size = board_size / 8;
    const diamond_size = tile_size * 0.7;
    const board_x_start = app.screen.width * 0.25;
    const board_y_start = (app.screen.height / 2) - (board_size / 2);
    const tile_img = await Assets.load('Assets/Sprites/slots_tile.png');
    const blue_diamond = await Assets.load('Assets/Sprites/slots_diamond_blue.png');
    const red_diamond = await Assets.load('Assets/Sprites/slots_diamond_red.png');
    const green_diamond = await Assets.load('Assets/Sprites/slots_diamond_green.png');
    const orange_diamond = await Assets.load('Assets/Sprites/slots_diamond_orange.png');
    const tiles = [];
    const diamond_images = [blue_diamond, red_diamond, green_diamond, orange_diamond];
    const diamonds: Sprite[] = [];

    // tile placing logic
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            const tile = new Sprite(tile_img);
            tile.width = tile_size;
            tile.height = tile_size;
            tile.position.x = board_x_start + x * tile_size + tile_size;
            tile.position.y = board_y_start + y * tile_size + tile_size;
            app.stage.addChild(tile);
            tiles.push(tile);
            }
    }

    const spin_img = await Assets.load('Assets/Sprites/slots_spin_button.png');
    const spin_button_sprite = new Sprite(spin_img);
    spin_button_sprite.position.x = board_x_start + board_size;
    spin_button_sprite.position.y = (app.screen.height / 2) - (spin_button_sprite.height / 2);
    spin_button_sprite.eventMode = 'static';
    spin_button_sprite.cursor = 'pointer';
    spin_button_sprite.on('pointerdown', () => {
        jackpotSound.play();
        spin();
    });
    app.stage.addChild(spin_button_sprite);

    function spin() {
        for (let y = 0; y < 6; y++) {
            for (let x = 0; x < 6; x++) {
                const rand = Math.floor(Math.random()*4);
                const diamond_img = diamond_images[rand] ;
                diamonds[6*x+y].texture = diamond_img;
            }
        }
    }

 // diamond placing logic
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            const rand = Math.floor(Math.random()*4);
            const diamond_img = diamond_images[rand] ;
            const diamond_sprite = new Sprite(diamond_img);
            diamond_sprite.width = diamond_size;
            diamond_sprite.height = diamond_size;
            diamond_sprite.position.x = board_x_start + x * tile_size + tile_size * 1.5 - diamond_size * 0.5;
            diamond_sprite.position.y = board_y_start + y * tile_size + tile_size * 1.5 - diamond_size * 0.5;
            app.stage.addChild(diamond_sprite);
            diamonds.push(diamond_sprite);
            }
    }
})();

export default board;