import { Component } from '@angular/core';
import { TPipe } from './shared/i18n/t.pipe';
import { Navbar } from './core/layout/navbar/navbar';
import { Footer } from './core/layout/footer/footer';
import { About } from './features/about/about';
import { Projects } from './features/projects/projects';
import { Home } from './features/home/home';
import { Experience } from './features/experience/experience';
import { Contact } from './features/contact/contact';
import { Support } from './features/support/support';
import { Services } from './features/services/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    TPipe,
    Navbar,
    Home,
    Footer,
    About,
    Experience,
    Projects,
    Support,
    Contact,
    Services,
  ],
})
export class App {
  protected title = 'Portfolio';
}
