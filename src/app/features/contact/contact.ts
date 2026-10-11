import { Component } from '@angular/core';
import { TPipe } from '../../shared/i18n/t.pipe';

@Component({
  selector: 'app-contact',
  imports: [TPipe],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {

}
