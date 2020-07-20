import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home.service';
import { WikidataService } from '../services/wikidata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService, private wikidataService: WikidataService, private router: Router) { }

  ngOnInit() {
    this.prova2()
  }
  prova(){
    this.wikidataService.showService().subscribe(
      response =>{
        console.log('funge')
          console.log(JSON.stringify(response))
          var prova = JSON.parse(JSON.stringify(response))
          console.log(prova.query.pages[0].thumbnail.source)
      },
      error => {
        console.log(error)
      }
    )  
  }
  prova2(){
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
