type Symbol = number

const evaluate_board = (window: Symbol[], windowSize: number) => {
    while (true) {
        // Group all adjacent symbols in window
        const parents: number[] = new Array(windowSize*windowSize).fill(-1);
        for (var i = 0; i < windowSize*windowSize; i++) {
            for (var j = 0; j < windowSize; j++) {
                const cur = i * windowSize + j;
                const left = (i-1) * windowSize + j;
                const up = i * windowSize + (j-1);

                if (window[cur] == window[left]) {
                    var parent = left
                    do {
                        parents[cur] = parent
                        parent = parents[parent]
                    } while (parent != parents[parent])
                } else if (window[cur] == window[up]) {
                    var parent = up
                    do {
                        parents[cur] = parent
                        parent = parents[parent]
                    } while (parent != parents[parent])
                } else {
                    parents[cur] = cur
                }
            }
        }

        // Count members in each group 
        const groups = new Map<number, number>();




    }
}