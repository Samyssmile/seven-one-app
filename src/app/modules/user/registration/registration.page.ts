import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { RegistrationService } from './registration.service';
import { Observer } from 'rxjs';
import { HttpClientService } from '../../../shared/http/http-client.service';
import { Router } from '@angular/router';
import { TranslateConfigService } from '../../../shared/translate/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit, Observer<any> {
  registrationForm: FormGroup;
  language: string;

  constructor(
    private registrationService: RegistrationService,
    private httpClientService: HttpClientService,
    private router: Router,
    private translateConfigService: TranslateConfigService,
    private translate: TranslateService
  ) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  ngOnInit() {
    this.registrationForm = new FormGroup({
      nickname: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });

    this.httpClientService.registerJwtObserver(this);
  }

  onSubmit() {
    this.registrationService.createUser(this.registrationForm.controls.nickname.value);
    this.registrationForm.reset();
  }

  complete(): void {
    console.log('JWT Observer completed');
  }

  error(err: any): void {
    console.log('JWT Observer error: ' + err);
  }

  next(value: any): void {
    console.log('Received new JWT: ' + value);
    if (value && value.length > 0) {
      this.router.navigateByUrl('/main-page/prediction-upcoming-game-list').then();
    }
  }
}
