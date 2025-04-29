export interface Cart {
    id: number;
    name: string;
    category: string;
    price: number;
    pic: string;
    quantity: number;
  }
    export const CartObject = [
        {
        'id': 1,
        'name': 'Orsó',
        'category': 'Felszerelés',
        'price': 12000,
        'pic': '../../../assets/images/products/orso.jpg',
        'quantity': 1
        },
        {
        'id': 2,
        'name': 'Ruhadarab',
        'category': 'Ruházat',
        'price': 8000,
        'pic': '../../../assets/images/products/ruha.jpg',
        'quantity': 2
        },
        {
            'id': 3,
            'name': 'Kapásjelző',
            'category': 'Felszerelés',
            'price': 42000,
            'pic': '../../../assets/images/products/kapasjelzo.png',
            'quantity': 1
          }
          ,
          {
            'id': 4,
            'name': 'Csali táska',
            'category': 'Felszerelés',
            'price': 5190,
            'pic': '../../../assets/images/products/csalitaska.png',
            'quantity': 1
          }
    ];

