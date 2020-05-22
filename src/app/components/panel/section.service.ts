import { Injectable } from '@angular/core';

import { InfoComponent } from '../info/info.component';
import { EventosComponent } from '../eventos/eventos.component';
import { GaleriaComponent } from '../galeria/galeria.component';

import { SectionItem } from './section.item';

@Injectable()
export class SectionService {
    getComponents() {
        return [
            new SectionItem(InfoComponent, {}),
            new SectionItem(EventosComponent, {}),
            new SectionItem(GaleriaComponent, {})
        ];
    }
}
