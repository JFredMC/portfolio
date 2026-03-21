import { Component, ViewChild } from '@angular/core';
import { Navbar } from "./core/layout/navbar/navbar";
import { Footer } from "./core/layout/footer/footer";
import { About } from "./features/about/about";
import { Projects } from './features/projects/projects';
import { Home } from './features/home/home';
import { Experience } from './features/experience/experience';
import { Preloader } from './core/preloader/preloader';

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
      Preloader
    ],
})
export class App {
  @ViewChild('preloader') preloader!: Preloader;
  protected title = 'Portfolio';

  ngAfterViewInit() {
    setTimeout(() => {
      this.preloader.hide();
    }, 3200);
  }
}
