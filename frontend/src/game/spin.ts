import { QueryClient } from '@tanstack/react-query';
import { type SpinResult, type Position, } from '../utils/types';
import { Container, Sprite, Texture, } from 'pixi.js';
import { getSpin } from '../api/queries';
import { BOARD_WIDTH, sleep, getSymbolTexture, } from '../utils/constants';

export async function spin(sprites: Container, qc: QueryClient) {

    const spinResult: SpinResult = await qc.query({
        queryKey: ["getSpin"],
        queryFn: getSpin(6, 60),
    });

    await drawBoard(sprites, spinResult.initialBoard, 200);
    await drawMovements(sprites, spinResult, 700);
}

function getForegroundSprite(sprites: Container, pos: Position): Sprite {
    const tile = sprites.getChildAt<Container>(pos.x * BOARD_WIDTH + pos.y);
    const fg = tile?.getChildByLabel("tile_fg") as Sprite | null;
    if (!fg) throw new Error(`No tile_fg at (${pos.x}, ${pos.y})`);
    return fg;
}

function setTileTexture(sprites: Container, pos: Position, texture: Texture) {
    getForegroundSprite(sprites, pos).texture = texture;
}

async function drawBoard(sprites: Container, board: SpinResult["initialBoard"], ms: number) {
    board.forEach((column, x) => {
        column.forEach((symbol, y) => {
            const pos = {x, y};
            const texture = getSymbolTexture(symbol);
            setTileTexture(sprites, pos, texture);
        });
    });
    await sleep(ms);
}

async function drawMovements(sprites: Container, spinResult: SpinResult, ms: number) {
    const emptyTexture = getSymbolTexture("empty");

    for (const movement of spinResult.prisonerMovements) {
        const prisonerTexture = getForegroundSprite(sprites, movement[0]).texture;
        let current = movement[0];

        for (const next of movement) { // first iteration replaces prisoner with itself :clown_emoji:
            await sleep(ms);
            setTileTexture(sprites, current, emptyTexture);
            setTileTexture(sprites, next, prisonerTexture);
            current = next;
        }
    }
    await sleep(ms);
}