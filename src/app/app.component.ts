import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from "./components/header/header.component";
import {MatListModule} from '@angular/material/list';
import { MatSelectionList } from '@angular/material/list';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent,MatListModule,MatSelectionList,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'NGChat';
  constructor(private authService:AuthService){}
  
    
  public signInWithGoogle(){
    this.authService.signInWithGoogle()
  }
}

