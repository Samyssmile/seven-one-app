import { Injectable } from '@angular/core';
import * as uuid from 'uuid';
import { HttpClientService } from '../../../shared/http/http-client.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private httpClientService: HttpClientService) {}

  // create a new user
  createUser(nickname: string) {
    this.httpClientService.createNewUserAccount(uuid.v4(), nickname);
  }
}
