import { QueryClient } from '@tanstack/react-query';
import { NO_SYMBOL, type SlotSymbol } from '../utils/types';
import { Container, Sprite, Texture, Assets } from 'pixi.js';
import { getReels } from '../api/queries';
import type { Queue } from '../utils/queue';
import { UnionFind } from '../utils/unionfind';

await Assets.init({basePath: 'Assets/Sprites/'})
await Assets.load([
    {alias: 'd_green', src: 'slots_diamond_green.png'},
    {alias: 'd_blue', src: 'slots_diamond_blue.png'},
    {alias: 'd_orange', src: 'slots_diamond_orange.png'},
    {alias: 'd_red', src: 'slots_diamond_red.png'},
    {alias: 'transparent', src: 'transparent.png'},
]);

export async function spin(boardSize: number, sprites: Container, qc: QueryClient) {
    const board: SlotSymbol[] = new Array(boardSize * boardSize).fill(NO_SYMBOL)
    const reels: Queue<SlotSymbol>[] = await qc.query({
        queryKey: ["getReels"],
        queryFn: getReels,
    });

    while (true) {
        // Fill board with symbols from reels
        for (var i = boardSize - 1; i >= 0; i--) {
            for (var j = boardSize - 1; j >= 0; j--) {

                const curTile = i * boardSize + j;
                if (board[curTile] != NO_SYMBOL) { // if the current tile already has a symbol
                    continue;
                }

                const symbol = reels[i].popFront();
                if (symbol == undefined) {
                    // TODO: figure out how to actually error handle 
                    // when a reel runs out of symbols
                    throw new Error("Reel ran out of symbols");
                }

                board[curTile] = symbol;
            }
        }
        
        await drawAndWait(sprites, board);

        // Group all adjacent symbols of same type
        const groups = new UnionFind(boardSize*boardSize);

        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {
                const curTile = i * boardSize + j;
                const leftTile = (i-1) * boardSize + j;
                const upTile = i * boardSize + (j-1);
                const downTile = i * boardSize + (j+1);
                const rightTile = (i+1) * boardSize + j;

                if (leftTile >= 0 && board[curTile] == board[leftTile]) {
                    groups.union(curTile, leftTile);
                } else if (upTile >= 0 && board[curTile] == board[upTile]) {
                    groups.union(curTile, upTile);
                } else if (downTile >= 0 && board[curTile] == board[downTile]) {
                    groups.union(curTile, downTile);
                } else if (downTile >= 0 && board[curTile] == board[rightTile]) {
                    groups.union(curTile, rightTile);
                }
            }
        }

        // Remove all groups of certain size
        const triggerThreshold = 5;
        var noTriggers = true;

        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {

                const curTile = i * boardSize + j;
                if (board[curTile] == NO_SYMBOL) {
                    continue
                }

                if (groups.size(curTile) < triggerThreshold) {
                    continue
                }

                // TODO: here we should save the current symbol somewhere before 
                // removing it, so that we in the end can calcualte a score/payout
                noTriggers = false
                board[curTile] = NO_SYMBOL;
            }
        }

        await drawAndWait(sprites, board);

        if (noTriggers) {
            return // spin is dead
        }

        // Push all symbols down to make space for new ones reeling in
        for (var i = boardSize - 1; i >= 0; i--) {
            for (var j = boardSize - 2; j >= 0; j--) { // notice we skip the bottom row
                var curTile = i * boardSize + j;
                var downTile = curTile + boardSize;

                const symbol = board[curTile];
                board[curTile] = NO_SYMBOL;

                while (downTile < boardSize * boardSize && board[downTile] == NO_SYMBOL) {
                    curTile = downTile
                    downTile += boardSize
                }

                board[curTile] = symbol;
            }
        }

        await drawAndWait(sprites, board);
    }
}

async function drawAndWait(sprites: Container, board: SlotSymbol[]) {
    const symbolTextures: Record<SlotSymbol, Texture> = {
        [NO_SYMBOL]: Texture.from('transparent'),
        0: Texture.from('d_green'),
        1: Texture.from('d_blue'),
        2: Texture.from('d_red'),
        3: Texture.from('d_orange'),
    };

    for (var i = 0; i < board.length; i++) {
        const newTexture = symbolTextures[board[i]];
        const container = sprites.getChildAt<Container>(i); // assumed to exist
        const sprite = container.getChildByLabel('tile_fg') as Sprite; // assumed to exist
        sprite.texture = newTexture;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
}