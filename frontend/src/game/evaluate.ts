type Symbol = number

export function evaluate_board(tiles: Symbol[], boardSize: number) {
    while (true) {
        // Group all adjacent symbols in window
        const group: number[] = new Array(boardSize*boardSize).fill(-1); // tile -> group leader
        const counter = new Map<number, number>(); // group leader -> group size

        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {
                const cur = i * boardSize + j;
                const left = (i-1) * boardSize + j;
                const up = i * boardSize + (j-1);

                if (left >= 0 && tiles[cur] == tiles[left]) {
                    group[cur] = group[left]
                } else if (up >= 0 && tiles[cur] == tiles[up]) {
                    group[cur] = group[up]
                } else {
                    group[cur] = cur // make self group leader
                }

                counter.set(group[cur], (counter.get(group[cur]) ?? 0) + 1)
            }
        }
    }
}