import { Component, Input, OnInit } from '@angular/core';
import { Building } from './building.interface';

@Component({
	selector: 'building-view',
	templateUrl: './building-view.component.html',
	styleUrls: ['./building-view.component.css']
})

export class BuildingViewComponent {
    @Input() building: Building;

    ngOnInit(): void {
        console.log(this.building);
    }
}