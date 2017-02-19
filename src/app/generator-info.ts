import { BuildingInfo } from './building-info.interface';
import { Building } from './building.interface';
import { Generator } from './generator';
import { GameInfo } from './game-info';

export class GeneratorInfo {
    createBuilding(gameInfo: GameInfo, row: number, col: number): Building {
        return new Generator(
            'Generator',
            [50, 30, 10, 2],
            [1, 2, 3, 5],
            gameInfo,
            0.2,
            5,
            1,
            15,
            1.1,
            2.2,
            row,
            col
        );
    }
}