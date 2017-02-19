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

    addRowBasePrice: number;
    addRowPriceGrowth: number;
    addRowSelectGrowth: number;
    addRowSelectedCurrencies: boolean[];

    addRowPrice: number;

	currencies: Currency[];
    currencyThrowaway1: number[];
    currencyThrowaway2: number[];

	title: string;

    constructor() {
        this.title = 'Randomized Numeric Grid';

        this.gridSizeX = 1;
		this.gridSizeY = 10;

        this.addRowBasePrice = 1000;
        this.addRowPriceGrowth = 5;
        this.addRowSelectGrowth = 3;
        this.addRowSelectedCurrencies = [false, false, false, false, false, false, false, false, false, false];

        this.currencyThrowaway1 = Array<number>(this.addRowSelectedCurrencies.length/2).fill(1).map((x,i)=>i);
        this.currencyThrowaway2 = Array<number>(this.addRowSelectedCurrencies.length/2).fill(1).map((x,i)=>i+5);

        this.addRowPrice = this.addRowBasePrice * Math.pow(this.addRowPriceGrowth, this.gridSizeX - 1) * Math.pow(this.addRowSelectGrowth, 10);

        this.currencies = [
            {
                name: 'A',
                amount: 10000000,
                color: 'pink',
                income: 0
            },
            {
                name: 'B',
                amount: 10000000,
                color: 'red',
                income: 0
            },
            {
                name: 'C',
                amount: 10000000,
                color: 'orange',
                income: 0
            },
            {
                name: 'D',
                amount: 10000000,
                color: 'yellow',
                income: 0
            },
            {
                name: 'E',
                amount: 10000000,
                color: 'lime',
                income: 0
            },
            {
                name: 'F',
                amount: 10000000,
                color: 'cyan',
                income: 0
            },
            {
                name: 'G',
                amount: 10000000,
                color: 'blue',
                income: 0
            },
            {
                name: 'H',
                amount: 10000000,
                color: 'purple',
                income: 0
            },
            {
                name: 'I',
                amount: 10000000,
                color: 'brown',
                income: 0
            },
            {
                name: 'J',
                amount: 10000000,
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

    updateAddRowPrice(): void {
        let selected = 0;
        for (let x of this.addRowSelectedCurrencies) {
            if (x) {
                selected++;
            }
        }

        this.addRowPrice = this.addRowBasePrice * Math.pow(this.addRowPriceGrowth, this.gridSizeX - 1) * Math.pow(this.addRowSelectGrowth, 10 - selected);
    }

    addRow(): void {
        let x = 0;
        let selectedCurrencies = [];
        while (x < this.currencies.length) {
            if (this.addRowSelectedCurrencies[x]) {
                if (this.currencies[x].amount < this.addRowPrice) {
                    return;
                }
                selectedCurrencies.push(this.currencies[x]);
            }
            x++
        }

        if (selectedCurrencies.length == 0) {
            return;
        }

        x = 0;
        while (x < selectedCurrencies.length) {
            selectedCurrencies[x].amount -= this.addRowPrice;
            x++;
        }

        this.gridSizeX++;
        this.throwawayGridX = Array<number>(this.gridSizeX).fill(1).map((x,i)=>i)
        this.buildingGrid.push(new Array<Building>(this.gridSizeY));

        x = 0;
        let final = this.buildingGrid.length - 1;
        while (x < this.buildingGrid[final].length) {
            this.buildingGrid[final][x] = this.buildingsInfo[0].createBuilding(this, final, x);
            x++;
        }

        this.updateAddRowPrice();
    }
}