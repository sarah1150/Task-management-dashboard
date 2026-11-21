import { Component, OnInit, signal } from '@angular/core';
import { NavigationItem } from '../types/navigation-item';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
  imports: [...MATERIAL_IMPORTS, RouterLink],
})
export class SideBarComponent implements OnInit {
  navigation: NavigationItem[] = [
    { label: 'Dashboard', route: '/', icon: 'dashboard.svg' },
    { label: 'Tasks', route: '/tasks', icon: 'task.svg' },
    { label: 'Calendar', route: '/', icon: 'calendar.svg' },
    { label: 'Analytics', route: '/', icon: 'analytics.svg' },
    { label: 'Team', route: '/team', icon: 'team.svg' },
    { label: 'Settings', route: '/', icon: 'settings.svg' },
  ];
  navOpen = signal(false);

  constructor() {}

  ngOnInit() {}

  closeNavigation(): void {
    this.navOpen.set(false);
  }
}
