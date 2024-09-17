import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
private subscription : Subscription=new Subscription()
public IsLoggedIn$:Observable<boolean> 
constructor(private authService:AuthService)
{
this.IsLoggedIn$=authService.IsLogged()
}
  ngOnInit(): void {
   
  }
 
public LoginWithGoogle():void{
  this.authService.signInWithGoogle();
}
public signOut():void{
  this.authService.signOut();
}
}
