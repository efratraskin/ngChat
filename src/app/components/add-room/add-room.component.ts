import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // ייבוא FormsModule
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-room',
  standalone: true, // אם רכיב עצמאי
  imports: [FormsModule,MatDialogModule,CommonModule], // הוסף את FormsModule כאן
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent {
  roomName: string = '';

  constructor(public dialogRef: MatDialogRef<AddRoomComponent>,@Inject(MAT_DIALOG_DATA) public data: { userId: string } ) {}

  onBackgroundClick() {
    console.log('Background clicked!');
    this.dialogRef.close(); // סוגר את החלונית
  }

  closeModal() {
    this.dialogRef.close();
  }
  onOkClick(): void {
    this.dialogRef.close(this.roomName); // סגירת הדיאלוג עם השם המלא של החדר
  }
}

