/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsCardComponent } from './statistics-card.component';
import { Statistic } from '../../models/statistic';

describe('StatisticsCardComponent', () => {
  let component: StatisticsCardComponent;
  let fixture: ComponentFixture<StatisticsCardComponent>;

  const mockStatistics: Statistic[] = [
    {
      id: 'stat-001',
      title: 'Total Tasks',
      icon: '📊',
      value: 156,
      change: '+12',
      changeLabel: 'this week',
      changeType: 'positive',
      color: '#1976D2',
    },
    {
      id: 'stat-002',
      title: 'Completed',
      icon: '✅',
      value: 89,
      change: '+8',
      changeLabel: 'today',
      changeType: 'positive',
      color: '#388E3C',
    },
  ] as Statistic[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('statistics', mockStatistics);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should receive statistics through the input signal', () => {
    expect(component.statistics()).toEqual(mockStatistics);
  });

  it('should accept an empty statistics array', () => {
    fixture.componentRef.setInput('statistics', []);
    fixture.detectChanges();
    expect(component.statistics()).toEqual([]);
  });

  it('should update statistics when the input changes', () => {
    const updatedStatistics: Statistic[] = [
      {
        id: 'stat-002',
        title: 'Completed',
        icon: '✅',
        value: 89,
        change: '+8',
        changeLabel: 'today',
        changeType: 'positive',
        color: '#388E3C',
      },
    ] as Statistic[];

    fixture.componentRef.setInput('statistics', updatedStatistics);
    fixture.detectChanges();
    expect(component.statistics()).toEqual(updatedStatistics);
  });
});
