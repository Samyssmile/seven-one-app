import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private storage: Storage, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[],
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if app storage is created, check if there is a profile
    this.createStorage();
    if (this.storage) {
      return this.storage.get('profile').then((profile) => {
        if (profile && profile.nickname) {
          console.log('Auth Guard allow load page - ' + profile.nickname);
          return true;
        } else {
          console.log('Auth Guard disallow load page');
          this.router.navigate(['registration']).then();
        }
      });
    }
  }

  private createStorage() {
    console.log('Creating storage');
    this.storage.create().then(
      (value) => {
        console.log('Storage created');
      },
      (error) => {
        console.log('Error while creating storage: ' + error);
      },
    );
  }
}
