import { Component, Input, OnInit } from '@angular/core';
import { IMessage } from '../../models';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{
@Input() massages:Array<IMessage>=[];
constructor(){

}
  ngOnInit(): void {
   console.log("efrat & dudi",this.massages);
  }
}
