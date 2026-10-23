import { QueryClient } from '@tanstack/react-query';
import { type SpinResult } from '../utils/types';
import { Container, Sprite, Texture, } from 'pixi.js';
import { getSpin } from '../api/queries';

export async function spin(gridSize: number, sprites: Container, qc: QueryClient) {

    const spinResult: SpinResult = await qc.query({
        queryKey: ["getSpin"],
        queryFn: getSpin(6, 60),
    });

    await draw(sprites, spinResult.initialGrid, 200);

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