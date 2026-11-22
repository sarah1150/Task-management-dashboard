import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Statistic } from '../../models/statistic';

@Component({
  selector: 'app-statistics-card',
  templateUrl: './statistics-card.component.html',
  styleUrls: ['./statistics-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsCardComponent {
  readonly statistics = input.required<Statistic[]>();
}
