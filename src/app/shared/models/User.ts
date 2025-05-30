

export interface User {
    id: string;
    name: {
        firstname: string;
        lastname: string;
    };
    email: string;
    password: string;
    products: [];
    events: string[];
}
//   export const ProfileObject = [
//     {
//       id: "1",
//       avatar: "M",
//       firstname: "Márk",
//       lastname: "Márton",
//       user_name: "markmarton",
//       email: "marok@gamil.com",
//       password: "marok1",
//       ordersNumber: 2,
//       eventsNumber: 1,
//     },
//     {
//       id: "2",
//       avatar: "A",
//       firstname: "Admin",
//       lastname: "Péter",
//       user_name: "adminuser",
//       email: "admin@admin.com",
//       password: "admin1",
//     }
//     ,
//     {
//       id: "3",
//       avatar: "J",
//       firstname: "János",
//       lastname: "Kovács",
//       user_name: "janoskovacs",
//       email: "janos.kovacs@example.com",
//       password: "janos123",
//       ordersNumber: 5,
//       eventsNumber: 2,
//     },
//     {
//       id: "4",
//       avatar: "E",
//       firstname: "Erika",
//       lastname: "Nagy",
//       user_name: "erikanagy",
//       email: "erika.nagy@example.com",
//       password: "erika456",
//       ordersNumber: 3,
//       eventsNumber: 4,
//     }
// ];
