import { Component, OnInit } from '@angular/core';
import { TranslateConfigService } from '../../shared/translate/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage implements OnInit {
  language: string;

  constructor(private translateConfigService: TranslateConfigService, private translate: TranslateService) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  ngOnInit() {}
}
