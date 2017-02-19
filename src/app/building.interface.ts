import { GameInfo } from './game-info';
import { Currency } from './currency.interface';

export interface Building {
    name: string;
    amount: number;
    currencies: Currency[];
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
    draw(): void;
    tick(): void;
    build(): void;
    rerollBasePrice(pos: number): void;
    rerollGrowth(pos: number): void;
    rerollPriceGrowth(pos: number): void;
}