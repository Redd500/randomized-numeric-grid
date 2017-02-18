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
            1,
            5,
            5,
            15,
            1.3,
            1.5,
            row,
            col
        );
    }
}