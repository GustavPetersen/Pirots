import { QueryClient } from '@tanstack/react-query';
import { type SpinResult, type Position, type PrisonerColor } from '../utils/types';
import { Container, Sprite, Texture, } from 'pixi.js';
import { getSpin } from '../api/queries';
import { GRID_WIDTH, PRISONER_COLORS, prisonerTextureIds, sleep, symbolTextureIds } from '../utils/constants';

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

function getForegroundSprite(sprites: Container, pos: { x: number; y: number }): Sprite {
    const tile = sprites.getChildAt<Container>(pos.x * GRID_WIDTH + pos.y);
    const fg = tile?.getChildByLabel("tile_fg") as Sprite | null;
    if (!fg) throw new Error(`No tile_fg at (${pos.x}, ${pos.y})`);
    return fg;
}

function setTileTexture(sprites: Container, pos: Position, textureId: string) {
    getForegroundSprite(sprites, pos).texture = Texture.from(textureId);
}

async function draw(sprites: Container, board: SpinResult["initialGrid"], ms: number) {
    board.forEach((column, x) => {
        column.forEach(({ name }, y) => {
            const textureId = symbolTextureIds[name];
            if (!textureId) throw new Error(`Unknown symbol "${name}" at (${x}, ${y})`);
            getForegroundSprite(sprites, { x, y }).texture = Texture.from(textureId);
        });
    });
    await sleep(ms);
}

async function drawPrisoners(sprites: Container, spinResult: SpinResult, ms: number) {
    for (const color of PRISONER_COLORS) {
        const { startingPosition } = spinResult.prisonerMovements[color];
        getForegroundSprite(sprites, startingPosition).texture = Texture.from(prisonerTextureIds[color]);
    }
    await sleep(ms);
}

async function movePrisoner(sprites: Container, color: PrisonerColor, start: Position, movements: Position[], ms: number) {
    let current = start;
    for (const next of movements) {
        await sleep(ms);
        setTileTexture(sprites, current, "transparent");
        setTileTexture(sprites, next, prisonerTextureIds[color]);
        current = next;
    }
}

async function drawMovements(sprites: Container, spinResult: SpinResult, ms: number) {
    for (const color of PRISONER_COLORS) {
        const { startingPosition, movements } = spinResult.prisonerMovements[color];
        await movePrisoner(sprites, color, startingPosition, movements, ms);
    }
    await sleep(ms);
}