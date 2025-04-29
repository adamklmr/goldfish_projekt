import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule,MatCardTitleGroup } from '@angular/material/card';
import { EventObject } from '../../shared/models/Event';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';




@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
  EventObject = EventObject; // Az események tömbje
  selectedIndex: number = 0;

  ngOnInit(): void {}
  hasStarted(eventStartDate: Date): boolean {
    const now = new Date();
    return new Date(eventStartDate) < now;
  }

reload(index: number): void {
    // Ellenőrizzük, hogy az index érvényes-e
    if (index >= 0 && index < this.EventObject.length) {
      this.selectedIndex = index; // Beállítjuk az új kiválasztott indexet
      console.log("Új selectedIndex:", index); // Ellenőrzéshez
    } else {
      console.error("Érvénytelen index:", index);
    }
  }
}
