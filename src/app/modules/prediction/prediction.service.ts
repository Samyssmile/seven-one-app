import { Injectable } from '@angular/core';
import { PredictionModel } from './models/prediction.model';
import { HttpClientService } from '../../shared/http/http-client.service';

@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  constructor(private httpClientService: HttpClientService) {}

  makePrediction(predictionModel: PredictionModel) {
    this.httpClientService.postPrediction(predictionModel);
  }
}
