import { Component } from '@angular/core';
import { Currency } from './currency.interface';
import { Building } from './building.interface';
import { GameInfo } from './game-info';
import { BuildingInfo } from './building-info.interface';
import { Generator } from './generator';
import { GeneratorInfo } from './generator-info'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {

	selectedBuilding: Building;

	gameInfo: GameInfo;

	constructor() {
		let save = JSON.parse(localStorage.getItem("RNG_game_info"));
		if (!save) {
			this.gameInfo = new GameInfo();
		}
		else {
			this.load(save);
		}
	}

    tick(): void {
		this.gameInfo.tick();
	}

	hasE(val: string): boolean {
		return val.includes('e');
	}
	
	ngAfterViewInit() {
		window.setInterval(() => {
			this.tick();
		}, 1000);
		window.setInterval(() => {
			this.selectTick();
		}, 300)
		window.setInterval(() => {
			this.save();
		}, 10000);
	}

	resetGame(): void {
		this.gameInfo = new GameInfo();
		this.selectedBuilding = null;
	}

	ngAfterViewChecked() {
		for (let x of this.gameInfo.buildingGrid) {
			for (let y of x) {
				y.draw();
			}
		}
	}

	selectBuilding(row: number, col: number) {
		if (this.selectedBuilding) {
			this.selectedBuilding.deselect(this.gameInfo);
		}
		this.selectedBuilding = this.gameInfo.buildingGrid[row][col];
		this.selectedBuilding.select();
	}

	selectTick() {
		if (this.selectedBuilding) {
			this.selectedBuilding.selectTick();
		}
	}

	save(): void {
		localStorage.setItem("RNG_game_info",JSON.stringify(this.gameInfo));
	}

	load(save: GameInfo): void {
		this.gameInfo = new GameInfo();
		for (var key in save) {
			if (save.hasOwnProperty(key)) {
				this.gameInfo[key] = save[key];
			}
		}

		this.gameInfo.buildingsInfo = Array<BuildingInfo>();
		this.gameInfo.buildingsInfo.push(new GeneratorInfo());

		this.gameInfo.buildingGrid = Array<Array<Building>>(this.gameInfo.throwawayGridX.length);
		let x = 0;
		while (x < this.gameInfo.buildingGrid.length) {
			this.gameInfo.buildingGrid[x] = Array<Building>(this.gameInfo.throwawayGridY.length);
			x++;
		}
		
		x = 0;
		while (x < save.buildingGrid.length) {
			let y = 0;
			while (y < save.buildingGrid[x].length) {
				this.gameInfo.buildingGrid[x][y] = new Generator(
													save.buildingGrid[x][y].name,
													save.buildingGrid[x][y].tierChances,
													save.buildingGrid[x][y].tierOptions,
													this.gameInfo,
													save.buildingGrid[x][y].minGrowth,
													save.buildingGrid[x][y].maxGrowth,
													save.buildingGrid[x][y].minPrice,
													save.buildingGrid[x][y].maxPrice,
													save.buildingGrid[x][y].minPriceGrowth,
													save.buildingGrid[x][y].maxPriceGrowth,
													x,
													y);
				for (var key in save.buildingGrid[x][y]) {
					if (save.buildingGrid[x][y].hasOwnProperty(key)) {
						this.gameInfo.buildingGrid[x][y][key] = save.buildingGrid[x][y][key];
					}
				}

				this.gameInfo.buildingGrid[x][y].selected = false;

				let i = 0;
				while (i < this.gameInfo.buildingGrid[x][y].currencies.length) {
					for (let c of this.gameInfo.currencies) {
						if (this.gameInfo.buildingGrid[x][y].currencies[i].name == c.name) {
							this.gameInfo.buildingGrid[x][y].currencies[i] = c;
							break;
						}
					}
					i++;
				}

				i = 0;
				while (i < this.gameInfo.buildingGrid[x][y].curCost.length) {
					for (let c of this.gameInfo.currencies) {
						if (this.gameInfo.buildingGrid[x][y].curCost[i].name == c.name) {
							this.gameInfo.buildingGrid[x][y].curCost[i] = c;
							break;
						}
					}
					i++
				}
				y++;
			}
			x++;
		}
	}
}
