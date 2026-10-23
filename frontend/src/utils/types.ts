export type SpinResult = {
    initialGrid: Array<Array<{name: string}>>,
    prisonerMovements: {
                            Blue: 
                            {
                                startingPosition: Position
                                movements: Array<Position>
                            },
                            Green: 
                            {
                                startingPosition: Position
                                movements: Array<Position>
                            },
                            Orange: 
                            {
                                startingPosition: Position
                                movements: Array<Position>
                            },
                            Red: 
                            {
                                startingPosition: Position
                                movements: Array<Position>
                            }
                        }
};

export type Position = {
    x: number,
    y: number,
};