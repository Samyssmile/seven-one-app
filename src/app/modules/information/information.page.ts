import {Component, OnInit} from '@angular/core';
import {TranslateConfigService} from '../../shared/translate/translate-config.service';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from '@ionic/storage-angular';
import {Router} from '@angular/router';
import {HttpClientService} from '../../shared/http/http-client.service';
import {
  PredictionUpcomingGameListService
} from '../prediction/prediction-upcoming-game-list/prediction-upcoming-game-list.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage implements OnInit {
  language: string;

  constructor(private predictionListService: PredictionUpcomingGameListService,
    private router: Router,
    private httpClientService: HttpClientService,
    private storage: Storage,
    private translateConfigService: TranslateConfigService,
    private translate: TranslateService) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  ngOnInit() {}

  deleteAccount(modal) {
    this.storage.clear().then(
      () => {
        this.httpClientService.deleteUserAccount().subscribe(
          (value) => {
            this.storage.clear();
            this.httpClientService.clear();
            this.predictionListService.clear();
            modal.dismiss();
            this.router.navigateByUrl('/registration').then();
          }
        );
      }
    );
  }
}
