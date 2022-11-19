import {Injectable, isDevMode} from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import {HttpClientService} from '../shared/http/http-client.service';
import {AuthenticatedUserDto} from '../shared/dtos/AuthenticatedUserDto';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private httpClientService: HttpClientService, private storage: Storage, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[],
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if app storage is created, check if there is a profile
    this.createStorage();
    if (this.storage) {
      return this.storage.get('profile').then((profile: AuthenticatedUserDto) => {
        if (profile && profile.nickname && profile.jwt) {
          this.httpClientService.login(profile.clientUuid);
          return true;
        } else {
          this.router.navigate(['registration']).then();
        }
      });
    }
  }

  private createStorage() {
    this.storage.create().then(
      (value) => {
        if (isDevMode()){
          console.log('Storage created');
        }
      },
      (error) => {
        if (isDevMode()){
          console.log('Error while creating storage: ' + error);
        }
      },
    );
  }
}
