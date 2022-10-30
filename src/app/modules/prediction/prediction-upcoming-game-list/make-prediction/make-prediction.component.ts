import { Component, Input, OnInit } from '@angular/core';
import { Match } from '../../models/game.model';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthenticatedUserDto } from '../../../../shared/dtos/AuthenticatedUserDto';
import { PredictionService } from '../../prediction.service';

@Component({
  selector: 'app-make-prediction',
  templateUrl: './make-prediction.component.html',
  styleUrls: ['./make-prediction.component.scss', '../../../../app.component.scss'],
})
export class MakePredictionComponent implements OnInit {
  @Input() game: Match;
  firstTeamScore: number;
  secondTeamScore: number;

  constructor(
    private modalController: ModalController,
    private storage: Storage,
    private predictionService: PredictionService
  ) {}

  ngOnInit() {}

  onDismiss() {
    this.modalController.dismiss('make-prediction-modal', 'dismiss', 'make-prediction-modal');
  }

  onPredictionMade() {
    this.storage.get('profile').then((profile: AuthenticatedUserDto) => {
      const clientsUuid = profile.clientUuid;
      this.predictionService.makePrediction({
        matchUuid: this.game.uuid,
        clientUuid: clientsUuid,
        prediction: this.firstTeamScore + ':' + this.secondTeamScore,
      });
      this.game.preidctionFirstTeamGoals = this.firstTeamScore;
      this.game.preidctionSecondTeamGoals = this.secondTeamScore;
      this.game.predicted = true;

      this.modalController.dismiss(
        {
          message: 'Prediction Made!',
          gameUuid: this.game.uuid,
          clientUuid: clientsUuid,
        },
        'prediction-made',
        'make-prediction-modal'
      );
    });
  }

  isSaveButtonDisabled() {
    if (this.firstTeamScore === undefined || this.firstTeamScore === null) {
      return true;
    }
    if (this.secondTeamScore === undefined || this.secondTeamScore === null) {
      return true;
    }
  }

  acceptValue() {
    // firstTeamScore and secondTeamScore are numbers between 0 and 10
    return this.firstTeamScore > 10 || this.firstTeamScore < 0;
  }

  onScoreValueChanged($event) {
    // checks of number only. Doesn't allow + - . for in input
    $event.target.value = $event.target.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');
    // checks for maxlength doesn't allow greater than specified length
    $event.target.value = $event.target.value.length > 1 ? $event.target.value.substring(0, 1) : $event.target.value;
  }
}
