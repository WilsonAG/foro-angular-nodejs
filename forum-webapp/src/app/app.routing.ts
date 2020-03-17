// MODULOS DEL ROUTER
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTES
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { TopicsComponent } from './components/topics/topics.component';
import { TopicDetailComponent } from './components/topic-detail/topic-detail.component';
import { UserGuard } from './services/user.guard';
import { NoIdentityGuard } from './services/noIdentity.guard';

// RUTAS
const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'inicio', component: HomeComponent },
    {
        path: 'login',
        canActivate: [NoIdentityGuard],
        component: LoginComponent
    },
    {
        path: 'registro',
        canActivate: [NoIdentityGuard],
        component: RegisterComponent
    },
    { path: 'ajustes', canActivate: [UserGuard], component: UserEditComponent },
    { path: 'temas', component: TopicsComponent },
    { path: 'temas/:page', component: TopicsComponent },
    { path: 'tema/:id', component: TopicDetailComponent },
    { path: '**', component: HomeComponent }
];

// EXPORTAR

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
