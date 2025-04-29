import { DatePipe } from "@angular/common";

export interface Event {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    location: string;
    pic: string;
    description?: string;
  }

  export const EventObject = [
    {
        'id': 3,
        'name': 'Horgászat',
        'startDate': new Date('2025-07-04'),
        'endDate': new Date('2025-07-06'),
        'location': 'Tópart',
        'pic': '../../../assets/images/events/horgaszat.jpg',
        'description': 'Egy szuper horgásztúra!'
    },
    {
        'id': 4,
        'name': 'Horgászverseny',
        'startDate': new Date('2024-09-01'),
        'endDate': new Date('2024-09-09'),
        'location': 'Tópart',
        'pic': '../../../assets/images/events/verseny.jpg',
        'description': 'Egy izgalmas horgászverseny!'
    }
    ,
    {
        'id': 5,
        'name': 'Horgászfesztivál',
        'startDate': new Date('2025-08-01'),
        'endDate': new Date('2025-08-03'),
        'location': 'Tópart déli része',
        'pic': '../../../assets/images/events/fesztival.png',
        'description': 'Egy szuper horgászfesztivál!'
    }
    ,
    {
        'id': 6,
        'name': 'Horgász Workshop',
        'startDate': new Date('2025-10-15'),
        'endDate': new Date('2025-10-16'),
        'location': 'Tópart oktatóközpont',
        'pic': '../../../assets/images/events/workshop.png',
        'description': 'Egy oktató jellegű horgász workshop!'
    }
];