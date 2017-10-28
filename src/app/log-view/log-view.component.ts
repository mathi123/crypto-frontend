import { Component, OnInit } from '@angular/core';
import { LogService } from '../server-api/log.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger } from '../logger';
import { MatDialog } from '@angular/material';
import { Location } from "@angular/common";
import { Log } from '../models/log';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.component.html',
  styleUrls: ['./log-view.component.css']
})
export class LogViewComponent implements OnInit {
  private log: Log = new Log();
  private routeParamsSubscription: Subscription;

  constructor(private router: Router, private location: Location, private route: ActivatedRoute,
    private logService: LogService, private dialogService: MatDialog, private logger: Logger) { }

  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      let id = params['id'];

      if(id === undefined || id === null || id === '0'){
        this.log = new Log();
      }else{
        this.logService.readById(id)
          .subscribe(log => this.refresh(log));
      }
    });
  }

  private refresh(log: Log){
    this.logger.verbose("data loaded, showing log");
    this.log = log;
  }
}
