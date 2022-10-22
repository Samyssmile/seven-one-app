import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../shared/http/http-client.service';
import { Observer } from 'rxjs';
import { AuthenticatedUserDto } from '../../shared/dtos/AuthenticatedUserDto';
import { Storage } from '@ionic/storage-angular';
import { TranslateConfigService } from '../../shared/translate/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.page.html',
  styleUrls: ['./main-page.page.scss'],
})
export class MainPagePage implements OnInit, Observer<any> {
  nickname = 'No nickname yet';
  language: string;

  constructor(
    private httpClientService: HttpClientService,
    private storage: Storage,
    private translateConfigService: TranslateConfigService,
    private translate: TranslateService
  ) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();

    this.storage.get('profile').then(
      (profile) => {
        if (profile && profile.nickname) {
          this.nickname = profile.nickname;
        }
      },
      (error) => {
        console.log('Error while getting profile from storage: ' + error);
      }
    );
  }

  ngOnInit() {}

  complete(): void {
    console.log('Profile Observer completed');
  }

  error(err: any): void {
    console.log('Profile Observer error: ' + err);
  }

  next(authenticatedUserDto: AuthenticatedUserDto): void {
    if (authenticatedUserDto) {
      console.log(
        'Received new profile: ' + authenticatedUserDto.nickname + ' and UUID: ' + authenticatedUserDto.clientUuid
      );
      this.nickname = authenticatedUserDto.nickname;
      this.storage.set('profile', authenticatedUserDto).then(
        (value) => {
          console.log('Profile saved to storage - ' + value.nickname);
        },
        (error) => {
          console.log('Error while saving profile to storage: ' + error);
        }
      );
    }
  }
}
