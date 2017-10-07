import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConfigurationService } from "./configuration.service";
import { Currency } from "../models/currency";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CurrencyService {
 
  constructor(private httpClient: HttpClient, private config: ConfigurationService) { }

  read(): Observable<Currency[]> {
    return this.httpClient.get<Currency[]>(`${this.config.getBaseUrl()}/currency`);
  }
/*
  remove(id: number): Promise<boolean> {
    return this.http.delete(`${this.config.getBaseUrl()}/user/${id}`, this.config.getHttpOptions())
      .toPromise()
      .then((r: Response) => r.json() as boolean)
      .catch((err: Error) => console.log(err));
  }

  read(id: number): Promise<User> {
    return this.http.get(`${this.config.getBaseUrl()}/user/${id}`, this.config.getHttpOptions())
      .toPromise()
      .then((r: Response) => r.json() as User)
      .catch((err: Error) => console.log(err));
  }

  update(user: User): Promise<boolean> {
    return this.http.put(`${this.config.getBaseUrl()}/user`, JSON.stringify(user), this.config.getHttpOptions())
      .toPromise()
      .then((r: Response) => r.json() as boolean)
      .catch((err: Error) => console.log(err));
  }

  create(user: User, password: string): Promise<number> {
    let data = new RegistrationData();
    data.fullName = user.fullname;
    data.email = user.email;
    data.password = password;

    return this.http.post(`${this.config.getBaseUrl()}/user`, JSON.stringify(data), this.config.getHttpOptions())
      .toPromise()
      .then((r: Response) => r.json() as number)
      .catch((err: Error) => console.log(err));
  }
*/
}