import { QueryClient } from '@tanstack/react-query';
import { type SpinResult, type Position } from '../utils/types';
import { Container, Sprite, Texture, } from 'pixi.js';
import { getSpin } from '../api/queries';

export async function spin(gridSize: number, sprites: Container, qc: QueryClient) {

    const spinResult: SpinResult = await qc.query({
        queryKey: ["getSpin"],
        queryFn: getSpin(6, 60),
    });

    await draw(sprites, spinResult.initialGrid, 200);
    await drawPrisoners(sprites, spinResult, 200);
    await drawMovements(sprites, spinResult, 700);

    console.log(spinResult);
}

async function draw(sprites: Container, board: Array<Array<{name: string}>>, ms: number) {
    const symbolTextures: Record<string, Texture> = {
        "empty": Texture.from('transparent'),
        "green": Texture.from('d_green'),
        "blue": Texture.from('d_blue'),
        "red": Texture.from('d_red'),
        "orange": Texture.from('d_orange'),
    };
    var normalizedBoard: Array<string> = [];
    for (var x = 0; x < board.length; x++) 
    {
        for (var y = 0; y < board[0].length; y++) 
            {
                normalizedBoard.push(board[x][y].name)
            }
    }

    for (var i = 0; i < normalizedBoard.length; i++) {
        const newTexture = symbolTextures[normalizedBoard[i]];
        const container = sprites.getChildAt<Container>(i); // assumed to exist
        const sprite = container.getChildByLabel('tile_fg') as Sprite; // assumed to exist
        sprite.texture = newTexture;
    }

    await new Promise((resolve) => setTimeout(resolve, ms));

}

async function drawPrisoners(sprites: Container, spinResult: SpinResult, ms: number) {
    const symbolTextures: Record<string, Texture> = {
        "Green": Texture.from('p_green'),
        "Blue": Texture.from('p_blue'),
        "Red": Texture.from('p_red'),
        "Orange": Texture.from('p_orange'),
    };

    // TODO: Fix this 
    const prisoners = spinResult.prisonerMovements;
    const bluePosition = prisoners.Blue.startingPosition;
    const bluePrisonerTexture = symbolTextures["Blue"];
    const bluePrisonerContainer = sprites.getChildAt<Container>(bluePosition.x*6 + bluePosition.y); // assumed to exist
    const blueSprite = bluePrisonerContainer.getChildByLabel('tile_fg') as Sprite; // assumed to exist
    blueSprite.texture = bluePrisonerTexture;

    const redPosition = prisoners.Red.startingPosition;
    const redPrisonerTexture = symbolTextures["Red"];
    const redPrisonerContainer = sprites.getChildAt<Container>(redPosition.x*6 + redPosition.y); // assumed to exist
    const redSprite = redPrisonerContainer.getChildByLabel('tile_fg') as Sprite; // assumed to exist
    redSprite.texture = redPrisonerTexture;

    const greenPosition = prisoners.Green.startingPosition;
    const greenPrisonerTexture = symbolTextures["Green"];
    const greenPrisonerContainer = sprites.getChildAt<Container>(greenPosition.x*6 + greenPosition.y); // assumed to exist
    const greenSprite = greenPrisonerContainer.getChildByLabel('tile_fg') as Sprite; // assumed to exist
    greenSprite.texture = greenPrisonerTexture;

    const orangePosition = prisoners.Orange.startingPosition;
    const orangePrisonerTexture = symbolTextures["Orange"];
    const orangePrisonerContainer = sprites.getChildAt<Container>(orangePosition.x*6 + orangePosition.y); // assumed to exist
    const orangeSprite = orangePrisonerContainer.getChildByLabel('tile_fg') as Sprite; // assumed to exist
    orangeSprite.texture = orangePrisonerTexture;
        
    await new Promise((resolve) => setTimeout(resolve, ms));

}

async function drawMovements(sprites: Container, spinResult: SpinResult, ms: number) {
    // TODO: Lets draw this shit!
    const symbolTextures: Record<string, Texture> = {
        "empty": Texture.from('transparent'),
        "Green": Texture.from('p_green'),
        "Blue": Texture.from('p_blue'),
        "Red": Texture.from('p_red'),
        "Orange": Texture.from('p_orange'),
    };
    let blueGuy = spinResult.prisonerMovements.Blue.startingPosition;
    // Blue movements 
    const blueMovements = spinResult.prisonerMovements.Blue.movements;
    await blueMovements.forEach(async position => {
        await new Promise((resolve) => setTimeout(resolve, ms));
        const bluePrisonerPosition = blueGuy;
        const emptyTexture = symbolTextures["empty"];
        const emptyContainer = sprites.getChildAt<Container>(bluePrisonerPosition.x*6 + bluePrisonerPosition.y); // assumed to exist
        const emptySprite = emptyContainer.getChildByLabel('tile_fg') as Sprite; // assumed to exist
        emptySprite.texture = emptyTexture;


        const bluePosition = position;
        const bluePrisonerTexture = symbolTextures["Blue"];
        const bluePrisonerContainer = sprites.getChildAt<Container>(bluePosition.x*6 + bluePosition.y); // assumed to exist
        const blueSprite = bluePrisonerContainer.getChildByLabel('tile_fg') as Sprite; // assumed to exist
        blueSprite.texture = bluePrisonerTexture;

        blueGuy = position;
        await new Promise((resolve) => setTimeout(resolve, ms));
    });

    let redGuy = spinResult.prisonerMovements.Red.startingPosition;
    const redMovements = spinResult.prisonerMovements.Red.movements;
    await redMovements.forEach(async position => {
        await new Promise((resolve) => setTimeout(resolve, ms));
        const redPrisonerPosition = redGuy;
        const emptyTexture = symbolTextures["empty"];
        const emptyContainer = sprites.getChildAt<Container>(redPrisonerPosition.x*6 + redPrisonerPosition.y); // assumed to exist
        const emptySprite = emptyContainer.getChildByLabel('tile_fg') as Sprite; // assumed to exist
        emptySprite.texture = emptyTexture;


        const redPosition = position;
        const redPrisonerTexture = symbolTextures["Red"];
        const redPrisonerContainer = sprites.getChildAt<Container>(redPosition.x*6 + redPosition.y); // assumed to exist
        const redSprite = redPrisonerContainer.getChildByLabel('tile_fg') as Sprite; // assumed to exist
        redSprite.texture = redPrisonerTexture;

        redGuy = position;
        
    });
    
    let greenGuy = spinResult.prisonerMovements.Green.startingPosition;
    const greenMovements = spinResult.prisonerMovements.Green.movements;
    await greenMovements.forEach(async position => {
        await new Promise((resolve) => setTimeout(resolve, ms));
        const greenPrisonerPosition = greenGuy;
        const emptyTexture = symbolTextures["empty"];
        const emptyContainer = sprites.getChildAt<Container>(greenPrisonerPosition.x*6 + greenPrisonerPosition.y); // assumed to exist
        const emptySprite = emptyContainer.getChildByLabel('tile_fg') as Sprite; // assumed to exist
        emptySprite.texture = emptyTexture;


        const greenPosition = position;
        const greenPrisonerTexture = symbolTextures["Green"];
        const greenPrisonerContainer = sprites.getChildAt<Container>(greenPosition.x*6 + greenPosition.y); // assumed to exist
        const greenSprite = greenPrisonerContainer.getChildByLabel('tile_fg') as Sprite; // assumed to exist
        greenSprite.texture = greenPrisonerTexture;

        greenGuy = position;
        await new Promise((resolve) => setTimeout(resolve, ms));
    });

    let orangeGuy = spinResult.prisonerMovements.Orange.startingPosition;
    const orangeMovements = spinResult.prisonerMovements.Orange.movements;
    await orangeMovements.forEach(async position => {
        await new Promise((resolve) => setTimeout(resolve, ms));
        const orangePrisonerPosition = orangeGuy;
        const emptyTexture = symbolTextures["empty"];
        const emptyContainer = sprites.getChildAt<Container>(orangePrisonerPosition.x*6 + orangePrisonerPosition.y); // assumed to exist
        const emptySprite = emptyContainer.getChildByLabel('tile_fg') as Sprite; // assumed to exist
        emptySprite.texture = emptyTexture;


        const orangePosition = position;
        const orangePrisonerTexture = symbolTextures["Orange"];
        const orangePrisonerContainer = sprites.getChildAt<Container>(orangePosition.x*6 + orangePosition.y); // assumed to exist
        const orangeSprite = orangePrisonerContainer.getChildByLabel('tile_fg') as Sprite; // assumed to exist
        orangeSprite.texture = orangePrisonerTexture;

        orangeGuy = position;
        await new Promise((resolve) => setTimeout(resolve, ms));
    });

    await new Promise((resolve) => setTimeout(resolve, ms));
}