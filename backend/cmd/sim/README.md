# Simulator

A command-line tool that plays the game millions of times with no browser, database or animation, and reports statistics. We use it to balance the game: playing by hand is far too few spins to see the real averages.

It runs the exact same engine as the server (`internal/engine`), so what the sim reports is what players get.

## Running it

```bash
cd backend
go run ./cmd/sim                    # 1,000,000 spins, seed 1
go run ./cmd/sim -n 10000000        # 10 million spins
go run ./cmd/sim -n 10000000 -seed 42
```

| Flag    | Default     | What it does                          |
| ------- | ----------- | ------------------------------------- |
| `-n`    | `1000000`   | Number of spins to simulate           |
| `-seed` | `1`         | Random seed (same seed = same result) |

## What it reports

| Stat           | Meaning                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------- |
| **RTP**        | Return to player: total won ÷ total bet. 96% means players get back 96 coins per 100 bet over time. The ± is the uncertainty of the estimate. |
| **Hit rate**   | Share of spins that win anything.                                                         |
| **Volatility** | Standard deviation of win ÷ bet. Low = many small wins, high = long dry spells and big hits. |
| **Max win**    | Biggest single-spin win seen, as a multiple of the bet.                                   |

### Rough targets

| Stat       | Typical for slots | Notes                                                        |
| ---------- | ----------------- | ------------------------------------------------------------ |
| RTP        | 94–97%            | Above 100% inflates the coin economy.                        |
| Hit rate   | 20–35%            | Much lower feels dead; much higher makes wins meaningless.   |
| Volatility | High              | Pirots-style games have rare big wins.                       |

