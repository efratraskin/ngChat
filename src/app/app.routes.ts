import { Routes } from '@angular/router';
import { ChatContainerComponent } from './components/chat-container/chat-container.component';
import { AuthGuardService } from './services/auth-guard.service';  // ודא שאתה משתמש בשם הנכון
import { HomePageComponent } from './components/home-page/home-page.component';

export const routes: Routes = [
    {
      path: 'chat',
      component: ChatContainerComponent,
      canActivate: [AuthGuardService]  // השתמש בשם המחלקה הנכון
    },
    {
      path: 'chat/:roomId',  // נתיב עם פרמטר
      component: ChatContainerComponent,
      canActivate: [AuthGuardService]
    },
    {
      path: '',
      component: HomePageComponent
    },
    {
      path: '**',
      redirectTo: ''
    }
];
