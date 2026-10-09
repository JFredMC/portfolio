import { Component } from '@angular/core';
import { Navbar } from './core/layout/navbar/navbar';
import { Footer } from './core/layout/footer/footer';
import { About } from './features/about/about';
import { Projects } from './features/projects/projects';
import { Home } from './features/home/home';
import { Experience } from './features/experience/experience';
import { Contact } from './features/contact/contact';
import { Support } from './features/support/support';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    Navbar,
    Home,
    Footer,
    About,
    Experience,
    Projects,
    Support,
    Contact,
  ],
})
export class App {
  protected title = 'Portfolio';
}
