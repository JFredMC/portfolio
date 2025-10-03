import { Component } from '@angular/core';
import { Navbar } from "./core/layout/navbar/navbar";
import { Footer } from "./core/layout/footer/footer";
import { About } from "./features/about/about";
import { Services } from './features/services/services';
import { Projects } from './features/projects/projects';
import { Contact } from './features/contact/contact';
import { Home } from './features/home/home';
import { Experience } from './features/experience/experience';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
    imports: [
      Navbar,
      Home,
      Footer,
      About,
      Services,
      Experience,
      Projects,
      Contact,
    ],
})
export class App {
  protected title = 'Portfolio';
}
