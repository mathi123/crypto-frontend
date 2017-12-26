import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent implements OnInit {
  @Input()
  public showLogo = true;

  @Input()
  public showVersion = true;

  constructor() { }

  ngOnInit() {
  }

}
