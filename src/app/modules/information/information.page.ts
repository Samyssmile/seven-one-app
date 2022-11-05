import { Component, OnInit } from '@angular/core';
import { TranslateConfigService } from '../../shared/translate/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import {Storage} from '@ionic/storage-angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage implements OnInit {
  language: string;

  constructor(private router: Router,
    private storage: Storage,
    private translateConfigService: TranslateConfigService,
    private translate: TranslateService) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  ngOnInit() {}

  deleteAccount(modal) {
    this.storage.clear();
    modal.dismiss();
    this.router.navigateByUrl('/registration');
  }

}
