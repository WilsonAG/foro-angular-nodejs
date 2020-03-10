import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

import { AppRoutingModule } from './app.routing';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    declarations: [AppComponent, RegisterComponent, LoginComponent, HomeComponent],
    imports: [BrowserModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
