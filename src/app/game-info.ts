import { Currency } from './currency.interface';
import { Building } from './building.interface';
import { BuildingInfo } from './building-info.interface';
import { Generator } from './generator';
import { GeneratorInfo } from './generator-info';

export class GameInfo {
	gridSizeX: number;
    gridSizeY: number;
	throwawayGridX: number[];
	throwawayGridY: number[];
	buildingGrid: Building[][];
    buildingsInfo: BuildingInfo[];

	currencies: Currency[];

	title: string;

    constructor() {
        this.title = 'Randomized Numeric Grid';

        this.gridSizeX = 1;
		this.gridSizeY = 5;

        this.currencies = [
            {
                name: 'A',
                amount: 20,
                color: 'pink',
                income: 0
            },
            {
                name: 'B',
                amount: 20,
                color: 'red',
                income: 0
            },
            {
                name: 'C',
                amount: 20,
                color: 'orange',
                income: 0
            },
            {
                name: 'D',
                amount: 20,
                color: 'yellow',
                income: 0
            },
            {
                name: 'E',
                amount: 20,
                color: 'lime',
                income: 0
            },
            {
                name: 'F',
                amount: 20,
                color: 'cyan',
                income: 0
            },
            {
                name: 'G',
                amount: 20,
                color: 'blue',
                income: 0
            },
            {
                name: 'H',
                amount: 20,
                color: 'purple',
                income: 0
            },
            {
                name: 'I',
                amount: 20,
                color: 'brown',
                income: 0
            },
            {
                name: 'J',
                amount: 20,
                color: 'black',
                income: 0
            }
	    ];

        this.buildingsInfo = [new GeneratorInfo()];

        this.buildingGrid = new Array<Array<Building>>(this.gridSizeX);

        this.throwawayGridX = Array<number>(this.gridSizeX).fill(1).map((x,i)=>i)
        this.throwawayGridY = Array<number>(this.gridSizeY).fill(1).map((x,i)=>i)

        let x = 0;
        while (x < this.buildingGrid.length) {
            this.buildingGrid[x] = new Array<Building>(this.gridSizeY);

            let y = 0;
            while (y < this.buildingGrid[x].length) {
                this.buildingGrid[x][y] = this.buildingsInfo[0].createBuilding(this, x, y);
                y++;
            }
            x++;
        }
    }

    tick(): void {
        for (let x of this.currencies) {
            x.income = 0;
        }
        for (let x of this.buildingGrid) {
            for (let y of x) {
                y.tick();
            }
        }
    }
}