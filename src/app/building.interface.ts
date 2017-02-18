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
    draw(): void;
    tick(): void;
    build(): void;
}