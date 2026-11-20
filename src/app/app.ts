import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SideBarComponent } from './layout/side-bar/side-bar.component';

@Component({
  imports: [RouterOutlet, NavbarComponent, SideBarComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Task-management-dashboard');
}
