import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ScientificNotationPipe } from './scientific-notation.pipe'

import { AppComponent } from './app.component';
import { BuildingViewComponent } from './building-view.component';

@NgModule({
  declarations: [
    AppComponent,
    BuildingViewComponent,
    ScientificNotationPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
