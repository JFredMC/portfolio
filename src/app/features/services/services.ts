import { Component } from '@angular/core';
import { TPipe } from '../../shared/i18n/t.pipe';

@Component({
  selector: 'app-services',
  imports: [TPipe],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class Services {}
