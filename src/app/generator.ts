import { Building } from './building.interface';
import { Currency } from './currency.interface';
import { GameInfo } from './game-info';

export class Generator implements Building {
    name: string;
    amount: number;
    currencies: Currency[];
    selected: boolean;
    tier: number;
    tierChances: number[];
    tierOptions: number[];
    tierTotalChances: number;
    growthThrowaway: number[];
    growth: number[];
    priceThrowaway: number[];
    curCost: Currency[];
    price: number[];
    priceGrowth: number[];
    row: number;
    col: number;
    minGrowth: number;
    maxGrowth: number;
    minPrice: number;
    maxPrice: number;
    basePrice: number[];
    minPriceGrowth: number;
    maxPriceGrowth: number;
    rerollBasePriceCost: number;
    rerollGrowthCost: number;
    rerollPriceGrowthCost: number;
    rerollCurrencyCost: number;
    rerollTierCost: number;
    selectedPhase: number;
    rowMinBasePriceMulti: number;
    rowMaxBasePriceMulti: number;
    rowMaxPriceGrowthMulti: number;
    rowMinGrowthMulti: number;
    rowMaxGrowthMulti: number;
    rowRerollMulti: number;
    canBuy: boolean;

    constructor(
        name: string,
        multiChances: number[],
        multipliers: number[],
        gameInfo: GameInfo,
        minGrowth: number,
        maxGrowth: number,
        minPrice: number,
        maxPrice: number,
        minPriceGrowth: number,
        maxPriceGrowth: number,
        row: number,
        col: number
        ) {
        this.rowMaxBasePriceMulti = 2.20;
        this.rowMinBasePriceMulti = 1.7;
        this.rowMaxPriceGrowthMulti = 1.1;
        this.rowMaxGrowthMulti = 1.95;
        this.rowMinGrowthMulti = 1.5;
        this.rowRerollMulti = 1.85;
        this.name = name;
        this.amount = 0;
        this.tierChances = multiChances;
        this.tierOptions = multipliers;
        this.growth = [];
        this.row = row;
        this.col = col;
        this.currencies = [];
        this.growth = [];
        this.curCost = [];
        this.price = [];
        this.priceGrowth = [];
        this.minGrowth = Math.floor(minGrowth * Math.pow(this.rowMinGrowthMulti, this.row) * 100) / 100;
        this.maxGrowth = Math.floor(maxGrowth * Math.pow(this.rowMaxGrowthMulti, this.row) * 100) / 100;
        this.minPrice = Math.floor(minPrice * Math.pow(this.rowMinBasePriceMulti, this.row) * 100) / 100;
        this.maxPrice = Math.floor(maxPrice * Math.pow(this.rowMaxBasePriceMulti, this.row) * 100) / 100;
        this.minPriceGrowth = minPriceGrowth;
        this.maxPriceGrowth = Math.floor(maxPriceGrowth * Math.pow(this.rowMaxPriceGrowthMulti, this.row) * 100) / 100;
        this.basePrice = [];
        this.selected = false;
        this.rerollBasePriceCost = Math.floor(500 * Math.pow(this.rowRerollMulti, this.row) * 100) / 100;
        this.rerollGrowthCost = Math.floor(2000 * Math.pow(this.rowRerollMulti, this.row) * 100) / 100;
        this.rerollPriceGrowthCost = Math.floor(10000 * Math.pow(this.rowRerollMulti, this.row) * 100) / 100;
        this.rerollCurrencyCost = Math.floor(25000 * Math.pow(this.rowRerollMulti, this.row) * 100) / 100;
        this.rerollTierCost = Math.floor(50000 * Math.pow(this.rowRerollMulti, this.row) * 100) / 100;
        this.selectedPhase = 0;
        this.canBuy = false;


        let multiChanceTotal = 0;

        for (let x of multiChances) {
            multiChanceTotal += x;
        }

        this.tierTotalChances = multiChanceTotal;
        
        let multi = Math.floor(Math.random() * multiChanceTotal);
        let currentChance = multiChances[0];
        let pos = 0;
        let actualMulti = 0;

        while (true) {
            if (multi < currentChance) {
                actualMulti = multipliers[pos];
                this.tier = actualMulti;
                break;
            }

            pos++;
            currentChance += multiChances[pos];
        }

        this.growthThrowaway = Array<number>(actualMulti).fill(1).map((x,i)=>i);

        pos = 0;
        while (pos < actualMulti) {
            let num = Math.floor(Math.random() * gameInfo.currencies.length);

            this.currencies.push(gameInfo.currencies[num]);
            
            num = Math.floor((Math.random() * (maxGrowth + 0.01 - minGrowth) + minGrowth) * 100) / 100;

            this.growth.push(num);

            pos++
        }

        this.curCost.push(this.currencies[0]);

        this.priceThrowaway = Array<number>(this.curCost.length).fill(1).map((x,i)=>i);

        for (let x of this.curCost) {
            let temp = Math.floor((Math.random() * (maxPrice + 0.01 - minPrice) + minPrice) * 100) / 100

            this.price.push(0);
            this.basePrice.push(temp);
            
            this.priceGrowth.push(Math.floor(Math.random() * (maxPriceGrowth * 100 + 1 - minPriceGrowth * 100) + minPriceGrowth * 100) / 100);
        }
    }

    draw(): void {
        let canvas = document
            .getElementById('building-table')
            .getElementsByClassName('building-row-' + this.row)[0]
            .getElementsByClassName('building-' + this.col)[0]
            .getElementsByTagName('canvas')[0];
        
        if (!canvas) {
            return;
        }
        
        let c = canvas.getContext('2d');

        let pos = 0;
        let allCur = this.currencies.length;
        while (pos < allCur) {
            c.beginPath();
            c.moveTo(0, canvas.height * pos / allCur);
            c.lineTo(0, canvas.height * (pos + 1) / allCur);
            c.lineTo(canvas.width, canvas.height * (pos + 1) / allCur);
            c.lineTo(canvas.width, canvas.height * pos / allCur);
            c.lineTo(0, canvas.height * pos / allCur);
            c.fillStyle = this.currencies[pos].color;
            c.fill();
            pos++;
        }

        pos = 0;
        while (pos < allCur - 1) {
            c.beginPath();
            c.moveTo(0, canvas.height * (pos + 1) / allCur);
            c.lineTo(canvas.width, canvas.height * (pos + 1) / allCur);
            c.strokeStyle = 'white';
            c.lineWidth = 2;
            c.stroke();
            pos++;
        }
        
        c.fillStyle = 'gray';
        c.font = "40px Arial";
        c.textBaseline = 'middle';
        c.textAlign = 'center';
        c.fillText('+', canvas.width/2, canvas.height/2);
    }

    tick(): void {
        let x = 0;
        while (x < this.currencies.length) {
            this.currencies[x].amount += this.amount * this.growth[x];
            this.currencies[x].income += this.amount * this.growth[x];
            x++;
        }
    }

    selectTick(): void {
        let element = document.getElementsByClassName('building-row-' + this.row)[0]
            .getElementsByClassName('building-' + this.col)[0]
            .getElementsByTagName('div')[0];


        if (this.selectedPhase >= this.currencies.length * 2) {
            this.selectedPhase = 0;
        }

        if (this.selectedPhase % 2 == 1) {
            element.classList.remove('selected-' + this.currencies[(this.selectedPhase - 1) / 2].name);
            element.classList.add('selected');
        }
        else {
            element.classList.remove('selected');
            element.classList.add('selected-' + this.currencies[this.selectedPhase / 2].name);
        }

        this.selectedPhase++;
    }

    select(): void {
        this.selected = true;
        let element = document.getElementsByClassName('building-row-' + this.row)[0]
            .getElementsByClassName('building-' + this.col)[0]
            .getElementsByTagName('div')[0];
        element.classList.add('selected-' + this.currencies[0].name);
        this.selectedPhase = 0;
    }

    deselect(gameInfo: GameInfo): void {
        this.selected = false;
        let element = document.getElementsByClassName('building-row-' + this.row)[0]
            .getElementsByClassName('building-' + this.col)[0]
            .getElementsByTagName('div')[0];
        let i = 0;
        while (i < gameInfo.currencies.length) {
            element.classList.remove('selected-' + gameInfo.currencies[i].name);
            i++;
        }
        element.classList.remove('selected');
    }

    build(amount: number): void {
        let x = 0;
        while (x < this.curCost.length) {
            if (this.curCost[x].amount < this.price[x]) {
                return;
            }
            x++;
        }
        this.amount += amount;
        x = 0;
        while (x < this.curCost.length) {
            this.curCost[x].amount -= this.price[x];
            this.price[x] = this.basePrice[x] * (Math.pow(this.priceGrowth[x], this.amount) - Math.pow(this.priceGrowth[x], this.amount + amount)) / (1 - this.priceGrowth[x]);
            x++;
        }

        for (let y of this.currencies) {
            y.unlocked = true;
        }
    }

    rerollBasePrice(pos: number): void {
        if (this.curCost[pos].amount >= this.rerollBasePriceCost) {
            this.basePrice[pos] = Math.floor((Math.random() * (this.maxPrice + 0.01 - this.minPrice) + this.minPrice) * 100) / 100;
            this.price[pos] = this.basePrice[pos] * Math.pow(this.priceGrowth[pos], this.amount);
            this.curCost[pos].amount -= this.rerollBasePriceCost;
        }
    }

    rerollGrowth(pos: number): void {
        if (this.currencies[pos].amount >= this.rerollGrowthCost) {
            this.growth[pos] = Math.floor((Math.random() * (this.maxGrowth + 0.01 - this.minGrowth) + this.minGrowth) * 100) / 100;
            this.currencies[pos].amount -= this.rerollGrowthCost;
        }
    }

    rerollPriceGrowth(pos: number): void {
        if (this.curCost[pos].amount >= this.rerollPriceGrowthCost) {
            this.priceGrowth[pos] = Math.floor(Math.random() * (this.maxPriceGrowth * 100 + 1 - this.minPriceGrowth * 100) + this.minPriceGrowth * 100) / 100;
            this.price[pos] = this.basePrice[pos] * Math.pow(this.priceGrowth[pos], this.amount);
            this.curCost[pos].amount -= this.rerollPriceGrowthCost;
        }
    }

    rerollCurrency(pos: number, gameInfo: GameInfo): void {
        if (this.currencies[pos].amount >= this.rerollCurrencyCost) {
            this.currencies[pos].amount -= this.rerollCurrencyCost;
            this.currencies[pos] = gameInfo.currencies[Math.floor(Math.random() * 10)];

            if (this.curCost[pos]) {
                this.curCost[pos] = this.currencies[pos];
            }

            this.currencies[pos].unlocked = true;

            this.draw();
        }
    }

    rerollTier(gameInfo: GameInfo): void {
        let x = 0;
        while (x < this.curCost.length) {
            if (this.curCost[x].amount < this.rerollTierCost) {
                return;
            }
            x++;
        }

        x = 0;
        while (x < this.curCost.length) {
            this.curCost[x].amount -= this.rerollTierCost;
            x++;
        }

        let multi = Math.floor(Math.random() * this.tierTotalChances);
        let currentChance = this.tierChances[0];
        let pos = 0;

        while (true) {
            if (multi < currentChance) {
                this.tier = this.tierOptions[pos];
                break;
            }

            pos++;
            currentChance += this.tierChances[pos];
        }

        this.growthThrowaway = Array<number>(this.tier).fill(1).map((x,i)=>i);

        pos = 0;
        this.currencies = [];
        this.growth = [];
        this.curCost = [];
        while (pos < this.tier) {
            let num = Math.floor(Math.random() * gameInfo.currencies.length);

            this.currencies.push(gameInfo.currencies[num]);

            gameInfo.currencies[num].unlocked = true;
            
            num = Math.floor((Math.random() * (this.maxGrowth + 0.1 - this.minGrowth) + this.minGrowth) * 10) / 10;

            this.growth.push(num);

            pos++
        }

        this.curCost.push(this.currencies[0]);

        this.priceThrowaway = Array<number>(this.curCost.length).fill(1).map((x,i)=>i);

        this.price = [];
        this.basePrice = [];
        this.priceGrowth = [];
        for (let x of this.curCost) {
            let temp = Math.floor((Math.random() * (this.maxPrice + 0.1 - this.minPrice) + this.minPrice) * 10) / 10

            this.price.push(temp);
            this.basePrice.push(temp);
            
            this.priceGrowth.push(Math.floor(Math.random() * (this.maxPriceGrowth * 10 + 1 - this.minPriceGrowth * 10) + this.minPriceGrowth * 10) / 10);
        }

        x = 0;
        while (x < this.price.length) {
            this.price[x] = this.basePrice[x] * Math.pow(this.priceGrowth[x], this.amount);
            x++;
        }

        this.draw();
    }

}