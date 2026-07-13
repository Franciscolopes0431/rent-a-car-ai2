const { sequelize, Vehicle } = require('./models');

const images = [
  { brand: 'Audi', model: 'A4', file: 'AUDI A4.jpg' },
  { brand: 'BMW', model: 'X3', file: 'BMW X3.jpg' },
  { brand: 'Citroën', model: 'C3', file: 'Citroën C3.jpg' },
  { brand: 'Mercedes', model: 'A180', file: 'Mercedes A180.jpg' },
  { brand: 'Nissan', model: 'Qashqai', file: 'Nissan Qashqai.jpg' },
  { brand: 'Seat', model: 'Leon', file: 'Seat Leon.jpeg' },
  { brand: 'Skoda', model: 'Octavia', file: 'Skoda Octavia.jpg' },
  { brand: 'Toyota', model: 'Corolla', file: 'Toyota Corolla.jpg' },
  { brand: 'Volkswagen', model: 'Golf', file: 'Volkswagen Golf.jpg' },
  { brand: 'Ford', model: 'Focus', file: 'ford focus.jpg' },
];

async function updateImages() {
  try {
    // Add the column directly via raw query if it doesn't exist
    await sequelize.query('ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);');
    console.log('Added column image_url to vehicles table.');

    for (const { brand, model, file } of images) {
      await Vehicle.update(
        { imageUrl: `/cars/${file}` },
        { where: { brand, model } }
      );
      console.log(`Updated ${brand} ${model} with image /cars/${file}`);
    }
    console.log('Finished updating images');
  } catch (error) {
    console.error('Error:', error);
  }
}

updateImages()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
