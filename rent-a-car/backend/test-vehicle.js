const { Vehicle } = require('./models');

async function test() {
  const v = await Vehicle.findOne({ where: { brand: 'Ford', model: 'Focus' } });
  console.log(v.toJSON());
}
test().then(() => process.exit(0));
