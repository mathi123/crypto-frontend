import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Logger } from '../logger';
import { UserService } from '../server-api/user.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  public user: User = new User();
  private routeParamsSubscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute,
    private userService: UserService, private dialogService: MatDialog, private logger: Logger) { }

  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      let id = params['id'];

      if(id === undefined || id === null || id === '0'){
        this.user = new User();
      }else{
        this.userService.readById(id)
          .subscribe(User => this.refresh(User));
      }
    });
  }

  private refresh(user: User){
    this.logger.verbose("data loaded, showing User");
    this.user = user;
  }
}