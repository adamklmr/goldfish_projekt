export interface Product {
    id: number;
    name: string;
    category: string;
    instock: boolean;
    price: number;
    pic: string;
    description?: string;
  }
  export const ProductObject = [
    {
      'id': 1,
      'name': 'Orsó',
      'category': 'Felszerelés',
      'instock': true,
      'price': 12000,
      'pic': '../../../assets/images/products/orso.jpg',
      'description': 'Carp Expert Uni Runner 6000 nyeletőfékes orsó'
    },
    {
      'id': 2,
      'name': 'Vízálló ruha',
      'category': 'Ruházat',
      'instock': true,
      'price': 20000,
      'pic': '../../../assets/images/products/ruha.jpg',
      'description': 'Terepmintás vízálló ruha'
    }
    ,
    {
      'id': 3,
      'name': 'Horgászbot',
      'category': 'Felszerelés',
      'instock': true,
      'price': 21890,
      'pic': '../../../assets/images/products/horgaszbot_1.png',
      'description': 'Prologic C-SERIES SPOD MARKER AB 12ft 5LBS 50MM'
    }
    ,
    {
      'id': 4,
      'name': 'Csizma',
      'category': 'Ruházat',
      'instock': true,
      'price': 12490,
      'pic': '../../../assets/images/products/csizma.jpeg',
      'description': 'OUTDOOR EVA CSIZMA THERMO PLUS -20C'
    }
    ,
    {
      'id': 5,
      'name': 'Kapásjelző',
      'category': 'Felszerelés',
      'instock': true,
      'price': 42000,
      'pic': '../../../assets/images/products/kapasjelzo.png',
      'description': 'Delphin Optimo elektromos kapásjelző szett ajándék swingerrel'
    }
    ,
    {
      'id': 6,
      'name': 'Csali táska',
      'category': 'Felszerelés',
      'instock': true,
      'price': 5190,
      'pic': '../../../assets/images/products/csalitaska.png',
      'description': 'Delphin BaiTyx csalis övtáska'
    }
  ];