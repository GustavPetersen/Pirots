export type SpinResult = {
    initialGrid: Array<Array<{name: string}>>,
    prisonerMovements: {
                            Blue: 
                            {
                                startingPosition: 
                                {
                                    x: number, y: number
                                }
                                movements: Array<{x: number, y: number}>
                            },
                            Green: 
                            {
                                startingPosition: 
                                {
                                    x: number, y: number
                                }
                                movements: Array<{x: number, y: number}>
                            },
                            Orange: 
                            {
                                startingPosition: 
                                {
                                    x: number, y: number
                                }
                                movements: Array<{x: number, y: number}>
                            },
                            Red: 
                            {
                                startingPosition: 
                                {
                                    x: number, y: number
                                }
                                movements: Array<{x: number, y: number}>
                            }
                        }
};