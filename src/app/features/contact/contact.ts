import { Component } from '@angular/core';
import { TPipe } from '../../shared/i18n/t.pipe';
import { ContactFormComponent } from './contact-form.component';

@Component({
  selector: 'app-contact',
  imports: [ContactFormComponent, TPipe],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {

}
