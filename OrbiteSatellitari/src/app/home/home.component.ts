import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService, private router: Router) { }

  ngOnInit() {
    this.prova()
  }

  prova(){
    this.homeService.showService().subscribe(
      response =>{
          console.log(response)
      },
      error => {
        console.log(error)
      }
    )
  }
}
