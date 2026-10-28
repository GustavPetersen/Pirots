import { QueryClient } from '@tanstack/react-query';
import { type SpinResult, type SlotSymbol, } from '../utils/types';
import { Container, Sprite, } from 'pixi.js';
import { getSpin } from '../api/queries';
import { BOARD_WIDTH, BOARD_HEIGHT, sleep, getSymbolTexture, PRISONERS, } from '../utils/constants';

export async function spin(sprites: Container, qc: QueryClient) {

    const spinResult: SpinResult = await qc.query({
        queryKey: ["getSpin"],
        queryFn: getSpin(6, 60),
    });

    const board: SlotSymbol[] = new Array(BOARD_WIDTH * BOARD_HEIGHT).fill("empty");
    const ms = 700;

    while (!spinResult.symbolReel.isEmpty()) {
        // Fill board
        board.forEach((symbol, i) => {
            if (symbol === "empty") board[i] = spinResult.symbolReel.popFront()!;
        });

        await drawBoard(sprites, board, ms);

        // Walk prisoners
        for (const _ of PRISONERS) {
            const walk = spinResult.prisonerWalks.popFront()!;
            const prisoner = board[walk[0]];

            const prisonerTexture = getSymbolTexture(prisoner);
            const emptyTexture = getSymbolTexture("empty");

            for (var i = 1; i < walk.length; i++) {
                const prev = walk[i - 1];
                const current = walk[i];

                getSpriteAt(sprites, prev).texture = emptyTexture;
                board[prev] = "empty";
                getSpriteAt(sprites, current).texture = prisonerTexture;
                board[current] = prisoner;

                await sleep(ms);
            }
        }
        await sleep(ms);

        // Push symbols down
        for (var tile = board.length - BOARD_WIDTH - 1; tile >= 0; tile--) {
            var downTile = tile;
            while ((downTile += BOARD_WIDTH) < board.length && board[downTile] === "empty") { }
            downTile -= BOARD_WIDTH; // We have overshot by 1

            if (downTile === tile) continue;

            board[downTile] = board[tile];
            board[tile] = "empty";
        }

        await drawBoard(sprites, board, ms);
    }
}

async function drawBoard(sprites: Container, board: SlotSymbol[], ms: number) {
    board.forEach((symbol, i) => {
        getSpriteAt(sprites, i).texture = getSymbolTexture(symbol);
    });
    await sleep(ms);
}

function getSpriteAt(sprites: Container, idx: number): Sprite {
    const tile = sprites.getChildAt<Container>(idx);
    const sprite = tile.getChildByLabel("tile_fg") as Sprite | null;
    if (!sprite) throw new Error(`No tile_fg at ${idx}`);
    return sprite;
}
