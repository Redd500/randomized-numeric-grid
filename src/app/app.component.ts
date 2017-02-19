import { Component } from '@angular/core';
import { Currency } from './currency.interface';
import { Building } from './building.interface';
import { GameInfo } from './game-info';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {

	selectedBuilding: Building;

	gameInfo: GameInfo;

	constructor() {
		this.gameInfo = new GameInfo();
		window.setInterval(() => {
			this.tick();
		}, 1000);
	}
	
	ngAfterViewChecked() {
		for (let x of this.gameInfo.buildingGrid) {
			for (let y of x) {
				y.draw();
			}
		}
	}

	selectBuilding(row: number, col: number) {
		this.selectedBuilding = this.gameInfo.buildingGrid[row][col];
	}

	tick(): void {
		this.gameInfo.tick();
	}
}
