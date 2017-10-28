import { Component, OnInit } from '@angular/core';
import { LogService } from '../server-api/log.service';

@Component({
  selector: 'app-log-overview',
  templateUrl: './log-overview.component.html',
  styleUrls: ['./log-overview.component.css']
})
export class LogOverviewComponent implements OnInit {

  constructor(private logService: LogService) { }

  ngOnInit() {
  }

}
