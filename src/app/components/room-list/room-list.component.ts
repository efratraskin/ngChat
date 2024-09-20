import { Component, Input, input, OnInit } from '@angular/core';
import { IChatRoom } from '../../models';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';

import { MatRadioModule } from '@angular/material/radio';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [MatListModule,CommonModule,MatRadioModule,RouterModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent implements OnInit{

  @Input() rooms:Array<IChatRoom> | undefined
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
