import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account';
import { Observable } from 'rxjs/Observable';
import * as SocketIo from 'socket.io-client';
import { ConfigurationService } from '../server-api/configuration.service';
import { TransactionCacheService } from '../cache/transaction-cache.service';
import { Logger } from '../logger';

@Injectable()
export class SocketManagerService {
  private socket: any;

  constructor(private logger: Logger, private configService: ConfigurationService, 
    private transactionCacheService: TransactionCacheService) { }

  init(){
    let address = this.configService.getBaseUrl();
    this.socket = SocketIo(address, {
      path: '/socket',
      query: {
        token: this.configService.getBearerToken()
      }
    });

    this.socket.on('reloadTransactions', (data) => this.transactionCacheService.reloadCacheForAccount(data.accountId));
    this.socket.on('reloadTotal', (data) => this.reloadAccountSummary(data))
  }

  reloadAccountSummary(data){
    this.logger.verbose('reload account summary: '+data);
  }

  close(){
    this.logger.info("disconnecting socket");
    this.socket.disconnect();
  }

}