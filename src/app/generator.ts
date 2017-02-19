import { Building } from './building.interface';
import { Currency } from './currency.interface';
import { GameInfo } from './game-info';

export class Generator implements Building {
    name: string;
    amount: number;
    currencies: Currency[];
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
        this.minGrowth = minGrowth;
        this.maxGrowth = maxGrowth;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.minPriceGrowth = minPriceGrowth;
        this.maxPriceGrowth = maxPriceGrowth;
        this.basePrice = [];
        this.rerollBasePriceCost = 500;
        this.rerollGrowthCost = 2000;
        this.rerollPriceGrowthCost = 10000;
        this.rerollCurrencyCost = 25000;
        this.rerollTierCost = 50000;

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
            
            num = Math.floor((Math.random() * (maxGrowth - minGrowth) + minGrowth) * 10) / 10;

            this.growth.push(num);

            pos++
        }

        this.curCost.push(this.currencies[0]);

        this.priceThrowaway = Array<number>(this.curCost.length).fill(1).map((x,i)=>i);

        for (let x of this.curCost) {
            let temp = Math.floor((Math.random() * (maxPrice - minPrice) + minPrice) * 1000) / 1000

            this.price.push(temp);
            this.basePrice.push(temp);
            
            this.priceGrowth.push(Math.floor(Math.random() * (maxPriceGrowth * 100 - minPriceGrowth * 100) + minPriceGrowth * 100) / 100);
        }
    }

    draw(): void {
        let canvas = document
            .getElementById('building-table')
            .getElementsByClassName('building-row-' + this.row)[0]
            .getElementsByClassName('building-' + this.col)[0]
            .getElementsByTagName('canvas')[0];
        
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
            c.lineWidth = 1;
            c.stroke();
            pos++;
        }
        
        c.fillStyle = 'gray';
        c.font = "20px Arial";
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

    build(): void {
        let x = 0;
        while (x < this.curCost.length) {
            if (this.curCost[x].amount < this.price[x]) {
                return;
            }
            x++;
        }
        this.amount++;
        x = 0;
        while (x < this.curCost.length) {
            this.curCost[x].amount -= this.price[x];
            this.price[x] = this.basePrice[x] * Math.pow(this.priceGrowth[x], this.amount);
            x++;
        }
    }

    rerollBasePrice(pos: number): void {
        if (this.curCost[pos].amount >= this.rerollBasePriceCost) {
            this.basePrice[pos] = Math.floor((Math.random() * (this.maxPrice - this.minPrice) + this.minPrice) * 1000) / 1000
            this.price[pos] = this.basePrice[pos] * Math.pow(this.priceGrowth[pos], this.amount);
            this.curCost[pos].amount -= this.rerollBasePriceCost;
        }
    }

    rerollGrowth(pos: number): void {
        if (this.currencies[pos].amount >= this.rerollGrowthCost) {
            this.growth[pos] = Math.floor((Math.random() * (this.maxGrowth - this.minGrowth) + this.minGrowth) * 10) / 10;
            this.currencies[pos].amount -= this.rerollGrowthCost;
        }
    }

    rerollPriceGrowth(pos: number): void {
        if (this.curCost[pos].amount >= this.rerollPriceGrowthCost) {
            this.priceGrowth[pos] = Math.floor(Math.random() * (this.maxPriceGrowth * 100 - this.minPriceGrowth * 100) + this.minPriceGrowth * 100) / 100;
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

            this.draw();
        }
    }

    rerollTier(gameInfo: GameInfo): void {
        let x = 0;
        while (x < this.curCost.length) {
            if (this.curCost[x].amount < this.price[x]) {
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
            
            num = Math.floor((Math.random() * (this.maxGrowth - this.minGrowth) + this.minGrowth) * 10) / 10;

            this.growth.push(num);

            pos++
        }

        this.curCost.push(this.currencies[0]);

        this.priceThrowaway = Array<number>(this.curCost.length).fill(1).map((x,i)=>i);

        this.price = [];
        this.basePrice = [];
        this.priceGrowth = [];
        for (let x of this.curCost) {
            let temp = Math.floor((Math.random() * (this.maxPrice - this.minPrice) + this.minPrice) * 1000) / 1000

            this.price.push(temp);
            this.basePrice.push(temp);
            
            this.priceGrowth.push(Math.floor(Math.random() * (this.maxPriceGrowth * 100 - this.minPriceGrowth * 100) + this.minPriceGrowth * 100) / 100);
        }

        x = 0;
        while (x < this.price.length) {
            this.price[x] = this.basePrice[x] * Math.pow(this.priceGrowth[x], this.amount);
            x++;
        }

        this.draw();
    }

}