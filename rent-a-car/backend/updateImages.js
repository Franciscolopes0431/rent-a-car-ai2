const { Vehicle } = require('./models');

const images = {
  'Audi': { 'A4': '/cars/AUDI A4.jpg' },
  'BMW': { 'X3': '/cars/BMW X3.jpg' },
  'Citroën': { 'C3': '/cars/Citroën C3.jpg' },
  'Mercedes': { 'A180': '/cars/Mercedes A180.jpg' },
  'Nissan': { 'Qashqai': '/cars/Nissan Qashqai.jpg' },
  'Seat': { 'Leon': '/cars/Seat Leon.jpeg' },
  'Skoda': { 'Octavia': '/cars/Skoda Octavia.jpg' },
  'Toyota': { 'Corolla': '/cars/Toyota Corolla.jpg' },
  'Volkswagen': { 'Golf': '/cars/Volkswagen Golf.jpg' },
  'Ford': { 'Focus': '/cars/ford focus.jpg' },
  'Hyundai': { 'Tucson': '/cars/Hyundai tucson.jpg' },
  'Opel': { 'Corsa': '/cars/Opel Corsa.jpg' },
  'Kia': { 'Sportage': '/cars/Kia Sportage.jpg' },
  'Volvo': { 'XC40': '/cars/Volvo XC40.jpg' },
  'Fiat': { 'Panda': '/cars/Fiat Panda.jpg' },
  'Porsche': { 'Cayenne': '/cars/Porsche Cayenne.jpg' },
  'Mini': { 'Cooper': '/cars/Mini Cooper.jpg' },
  'Dacia': { 'Duster': '/cars/Dacia Duster.jpg' },
  'Lexus': { 'NX': '/cars/Lexus NX.jpg' },
  'Mazda': { '3': '/cars/Mazda 3.jpg' },
  'Alfa Romeo': { 'Giulia': '/cars/Alfa Romeo Giulia.jpg' },
  'Honda': { 'Jazz': '/cars/Honda Jazz.jpg' }
};

async function updateAllImages() {
  for (const brand in images) {
    for (const model in images[brand]) {
      const url = images[brand][model];
      await Vehicle.update({ imageUrl: url }, { where: { brand, model } });
      console.log(`Updated ${brand} ${model} to ${url}`);
    }
  }
}

updateAllImages().then(() => {
  console.log('All images updated successfully!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
