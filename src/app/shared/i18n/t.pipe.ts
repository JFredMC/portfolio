import { inject, Pipe, PipeTransform } from '@angular/core';
import { I18nService } from './i18n.service';

@Pipe({ name: 't', pure: false })
export class TPipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(text: string | null | undefined, params?: Record<string, string | number>): string {
    return this.i18n.t(text ?? '', params);
  }
}
