import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from "./components/header/header.component";
import {MatListModule} from '@angular/material/list';
import { MatSelectionList } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {ScrollingModule} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent,MatListModule,MatSelectionList,RouterModule,MatDialogModule,CommonModule,ScrollingModule],
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

