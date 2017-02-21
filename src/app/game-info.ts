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
    buyMultiple: number;

    addRowBasePrice: number;
    addRowPriceGrowth: number;
    addRowSelectGrowth: number;
    addRowSelectedCurrencies: boolean[];

    addRowPrice: number;

	currencies: Currency[];
    currencyThrowaway1: number[];
    currencyThrowaway2: number[];

    tutorialPhase: number;

	title: string;

    canBuyRow: boolean;

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

        this.tutorialPhase = 0;

        this.buyMultiple = 1;

        this.canBuyRow = false;

        this.currencies = [
            {
                name: 'A',
                amount: 0,
                color: 'pink',
                income: 0,
                unlocked: false
            },
            {
                name: 'B',
                amount: 0,
                color: 'red',
                income: 0,
                unlocked: false
            },
            {
                name: 'C',
                amount: 0,
                color: 'orange',
                income: 0,
                unlocked: false
            },
            {
                name: 'D',
                amount: 0,
                color: 'yellow',
                income: 0,
                unlocked: false
            },
            {
                name: 'E',
                amount: 0,
                color: 'lime',
                income: 0,
                unlocked: false
            },
            {
                name: 'F',
                amount: 0,
                color: 'cyan',
                income: 0,
                unlocked: false
            },
            {
                name: 'G',
                amount: 0,
                color: 'blue',
                income: 0,
                unlocked: false
            },
            {
                name: 'H',
                amount: 0,
                color: 'purple',
                income: 0,
                unlocked: false
            },
            {
                name: 'I',
                amount: 0,
                color: 'brown',
                income: 0,
                unlocked: false
            },
            {
                name: 'J',
                amount: 0,
                color: 'black',
                income: 0,
                unlocked: false
            }
	    ];

        this.buildingsInfo = [new GeneratorInfo()];

        this.buildingGrid = new Array<Array<Building>>(this.gridSizeX);

        this.throwawayGridX = Array<number>(this.gridSizeX).fill(1).map((x,i)=>i);
        this.throwawayGridY = Array<number>(this.gridSizeY).fill(1).map((x,i)=>i);

        let x = 0;
        while (x < this.buildingGrid.length) {
            this.buildingGrid[x] = new Array<Building>(this.gridSizeY);
            let y = 0;
            while (y < this.buildingGrid[x].length) {
                let randBuild = this.buildingsInfo[Math.floor(Math.random() * this.buildingsInfo.length)];
                this.buildingGrid[x][y] = randBuild.createBuilding(this, x, y);
                y++;
            }
            x++;
        }
        this.buildingGrid[0][0].tier = 2;
        this.buildingGrid[0][0].basePrice = [5];
        this.buildingGrid[0][0].priceGrowth = [1.3];
        this.buildingGrid[0][0].curCost = [];
        this.buildingGrid[0][0].currencies = [];
        this.buildingGrid[0][0].growth = [3, 2];
        this.buildingGrid[0][0].priceThrowaway = [0];
        this.buildingGrid[0][0].growthThrowaway = [0, 1];

        let pos = 0;
        while (pos < 2) {
            let num = Math.floor(Math.random() * this.currencies.length);

            if (this.buildingGrid[0][0].currencies.find((v, i, o) => v == this.currencies[num])) {
                continue;
            }

            this.buildingGrid[0][0].currencies.push(this.currencies[num]);

            pos++
        }

        this.buildingGrid[0][0].curCost.push(this.buildingGrid[0][0].currencies[0]);
    }

    tick(): void {
        if (this.buildingGrid[0][0].amount >= 5 &&
            this.tutorialPhase == 0) {
                this.tutorialPhase++;
        }
        
        for (let x of this.currencies) {
            x.income = 0;
        }

        for (let x of this.buildingGrid) {
            for (let y of x) {
                y.tick();
            }
        }

        for (let x of this.buildingGrid) {
            for (let y of x) {
                let i = 0;
                while (i < y.curCost.length) {
                    if (y.curCost[i].amount < y.price[i]) {
                        y.canBuy = false;
                        break;
                    }
                    i++;
                    y.canBuy = true;
                }
            }
        }

        let sum = 0;
        for (let x of this.currencies) {
            sum += x.income;
        }
        if (sum >= 100 && this.tutorialPhase == 1) {
            this.tutorialPhase++;
        }
        if (sum >= 150 && this.tutorialPhase == 2) {
            this.tutorialPhase++;
        }
        if (sum >= 250 && this.tutorialPhase == 3) {
            this.tutorialPhase++;
        }
        if (sum >= 400 && this.tutorialPhase == 4) {
            this.tutorialPhase++;
        }
        if (sum >= 700 && this.tutorialPhase == 5) {
            this.tutorialPhase++;
        }

        let x = 0;
        let selectedCurrencies = [];
        while (x < this.currencies.length) {
            if (this.addRowSelectedCurrencies[x]) {
                selectedCurrencies.push(this.currencies[x]);
            }
            x++
        }

        for (let y of selectedCurrencies) {
            if (y.amount < this.addRowPrice) {
                this.canBuyRow = false;
                break;
            }
            this.canBuyRow = true;
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

        let x = 0;
        let selectedCurrencies = [];
        while (x < this.currencies.length) {
            if (this.addRowSelectedCurrencies[x]) {
                selectedCurrencies.push(this.currencies[x]);
            }
            x++
        }

        for (let y of selectedCurrencies) {
            if (y.amount < this.addRowPrice) {
                this.canBuyRow = false;
                break;
            }
            this.canBuyRow = true;
        }
    }
    
    addRow(): void {
        if (!this.canBuyRow) {
            return;
        }
        let x = 0;
        let selectedCurrencies = [];
        while (x < this.currencies.length) {
            if (this.addRowSelectedCurrencies[x]) {
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

    updatePrices(): void {
        let multi = this.buyMultiple;
        if (!multi || multi <= 0) {
            multi = 1;
        }

        if (multi > 100) {
            multi = 100;
        }

        for (let x of this.buildingGrid) {
            for (let y of x) {
                let i = 0;
                while (i < y.price.length) {
                    y.price[i] = y.basePrice[i] * (Math.pow(y.priceGrowth[i], y.amount) - Math.pow(y.priceGrowth[i], y.amount + multi)) / (1 - y.priceGrowth[i]);
                    if (y.amount == 0) {
                        y.price[i] -= y.basePrice[i];
                    }
                    i++;
                }
            }
        }

        for (let x of this.buildingGrid) {
            for (let y of x) {
                let i = 0;
                while (i < y.curCost.length) {
                    if (y.curCost[i].amount < y.price[i]) {
                        y.canBuy = false;
                        break;
                    }
                    i++;
                    y.canBuy = true;
                }
            }
        }
    }

}