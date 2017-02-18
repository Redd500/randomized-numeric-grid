import { Building } from './building.interface';
import { GameInfo } from './game-info';

export interface BuildingInfo {
    createBuilding(gameInfo: GameInfo, row: number, col: number): Building;
}