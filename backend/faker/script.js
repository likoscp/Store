const { faker } = require('@faker-js/faker');
const fs = require('fs');

// const generateData = () => {

// const orders = [];

// odrer

// for (let i = 0; i < 1000; i++) {
//   const order = {
//     userId: faker.string.uuid(), 
//     items: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
//       productId: faker.string.uuid(),
//       quantity: faker.number.int({ min: 1, max: 10 }),
//     })),
//     status: faker.helpers.arrayElement(['pending', 'completed', 'cancelled']),
//     order_date: faker.date.past(),
//   };
//   orders.push(order);
// }

//   return orders;
// };

// const data = generateData();
// fs.writeFileSync('orders.json', JSON.stringify(data, null, 2), 'utf-8');

//Posts

// const generatePosts = () => {
//   const posts = [];
//   for (let i = 0; i < 1000; i++) {
//     const post = {
//       title: faker.lorem.sentence(),
//       content: faker.lorem.paragraphs(3),
//       mainImage: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
//       creatorId: faker.string.uuid(), 
//       images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
//         faker.image.urlPicsumPhotos({ width: 800, height: 600 })
//       ),
//       status: faker.helpers.arrayElement(['public', 'private', 'archive']),
//       created_date: faker.date.past(),
//     };
//     posts.push(post);
//   }
//   return posts;
// };

// const data = generatePosts();
// fs.writeFileSync('posts.json', JSON.stringify(data, null, 2), 'utf-8');

//Products

// const generateProducts = () => {
//   const products = [];
//   for (let i = 0; i < 1000; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       price: faker.number.float({ min: 1, max: 1000, precision: 0.01 }),
//       stock: faker.number.int({ min: 0, max: 500 }),
//       category: faker.commerce.department(),
//       tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
//         faker.commerce.productAdjective()
//       ),
//     };
//     products.push(product);
//   }
//   return products;
// };

// const data = generateProducts();
// fs.writeFileSync('products.json', JSON.stringify(data, null, 2), 'utf-8');

// Users

// const generateUsers = () => {
//   const users = [];

//   for (let i = 0; i < 50; i++) {
//     users.push({
//       name: faker.person.fullName(),
//       email: faker.internet.email(),
//       phone: faker.phone.number(),
//       address: faker.location.streetAddress(),
//       status: faker.helpers.arrayElement(['active', 'blocked']),
//       loyalityLevel: faker.number.int({ min: 1, max: 10 }),
//       role: 'moderator',
//       created_date: faker.date.past(),
//     });

//     for (let i = 0; i < 300; i++) {
//       users.push({
//         name: faker.person.fullName(),
//         email: faker.internet.email(),
//         phone: faker.phone.number(),
//         address: faker.location.streetAddress(),
//         status: faker.helpers.arrayElement(['active', 'blocked']),
//         loyalityLevel: faker.number.int({ min: 1, max: 10 }),
//         role: 'employer',
//         created_date: faker.date.past(),
//       });

//       for (let i = 0; i < 5; i++) {
//         users.push({
//           name: faker.person.fullName(),
//           email: faker.internet.email(),
//           phone: faker.phone.number(),
//           address: faker.location.streetAddress(),
//           status: faker.helpers.arrayElement(['active', 'blocked']),
//           loyalityLevel: faker.number.int({ min: 1, max: 10 }),
//           role: 'administrator',
//           created_date: faker.date.past(),
//         });
//       }

//       for (let i = 0; i < faker.number.int({ min: 1, max: 50 }); i++) {
//         users.push({
//           name: faker.person.fullName(),
//           email: faker.internet.email(),
//           phone: faker.phone.number(),
//           address: faker.location.streetAddress(),
//           status: faker.helpers.arrayElement(['active', 'blocked']),
//           loyalityLevel: faker.number.int({ min: 1, max: 10 }),
//           role: 'supplier',
//           created_date: faker.date.past(),
//         });
//       }

//       for (let i = 0; i < faker.number.int({ min: 1, max: 100 }); i++) {
//         users.push({
//           name: faker.person.fullName(),
//           email: faker.internet.email(),
//           phone: faker.phone.number(),
//           address: faker.location.streetAddress(),
//           status: faker.helpers.arrayElement(['active', 'blocked']),
//           loyalityLevel: faker.number.int({ min: 1, max: 10 }),
//           role: 'B2B',
//           created_date: faker.date.past(),
//         });
//       }

//       const remainingUsers = 1000 - users.length;
//       for (let i = 0; i < remainingUsers; i++) {
//         users.push({
//           name: faker.person.fullName(),
//           email: faker.internet.email(),
//           phone: faker.phone.number(),
//           address: faker.location.streetAddress(),
//           status: faker.helpers.arrayElement(['active', 'blocked']),
//           loyalityLevel: faker.number.int({ min: 1, max: 10 }),
//           role: 'user',
//           created_date: faker.date.past(),
//         });
//       }
//     }

//     return users;
//   }
// };

// const data = generateUsers();
// fs.writeFileSync('users.json', JSON.stringify(data, null, 2), 'utf-8');

// Tickets

// const generateTickets = (userIds, orderIds) => {
//   const tickets = [];
  
//   for (let i = 0; i < 1000; i++) {
//     const logs = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
//       userId: faker.helpers.arrayElement(userIds),
//       action: faker.lorem.sentence(),
//       date_of_action: faker.date.recent(),
//     }));

//     const comments = Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => ({
//       userId: faker.helpers.arrayElement(userIds),
//       comments: faker.lorem.sentences(),
//       date_of_comments: faker.date.recent(),
//     }));

//     const attachments = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => {
//       const fileType = faker.helpers.arrayElement(['image', 'video', 'document', 'archive']);
//       switch (fileType) {
//         case 'image':
//           return faker.image.urlPicsumPhotos();
//         case 'video':
//           return `https://video.example.com/${faker.string.uuid()}.mp4`;
//         case 'document':
//           return `https://docs.example.com/${faker.string.uuid()}.pdf`;
//         case 'archive':
//           return `https://files.example.com/${faker.string.uuid()}.zip`;
//         default:
//           return faker.internet.url();
//       }
//     });

//     const ticket = {
//       ownerId: faker.helpers.arrayElement([...userIds, null]),
//       orderId: faker.helpers.arrayElement(orderIds),
//       problem: faker.lorem.paragraph(),
//       logs,
//       status: faker.helpers.arrayElement(['not started', 'pending', 'completed', 'cancelled']),
//       comments,
//       attachment: attachments,
//     };

//     tickets.push(ticket);
//   }

//   return tickets;
// };

// const data = generateTickets(userIds, orderIds);
// fs.writeFileSync('tickets.json', JSON.stringify(data, null, 2), 'utf-8');
