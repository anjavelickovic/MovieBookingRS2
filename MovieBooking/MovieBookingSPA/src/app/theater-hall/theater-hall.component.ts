import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-theater-hall',
  templateUrl: './theater-hall.component.html',
  styleUrls: ['./theater-hall.component.css']
})
export class TheaterHallComponent implements OnInit {
  closeResult: string;
  
  constructor(private router: Router) {}
    
  ngOnInit(): void {
  }

}
