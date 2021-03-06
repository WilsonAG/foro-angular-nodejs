// Modulos
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PanelRoutingModule } from './panel.routing';
import { MomentModule } from 'angular2-moment';

// Componentes
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';

// Servicios

// NgModule
@NgModule({
    declarations: [MainComponent, ListComponent, AddComponent, EditComponent],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        PanelRoutingModule,
        MomentModule
    ],
    exports: [MainComponent, ListComponent, AddComponent, EditComponent],
    providers: []
})
export class PanelModule {}
