const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const UserModel = require('./User');
const VehicleModel = require('./Vehicle');
const ReservationModel = require('./Reservation');
const UnavailabilityModel = require('./Unavailability');

// Inicializa os models antes de definir as relacoes para evitar dependencias circulares.
const User = UserModel(sequelize, Sequelize.DataTypes);
const Vehicle = VehicleModel(sequelize, Sequelize.DataTypes);
const Reservation = ReservationModel(sequelize, Sequelize.DataTypes);
const Unavailability = UnavailabilityModel(sequelize, Sequelize.DataTypes);

User.hasMany(Reservation, {
  foreignKey: 'userId',
  as: 'reservations',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Vehicle.hasMany(Reservation, {
  foreignKey: 'vehicleId',
  as: 'reservations',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Vehicle.hasMany(Unavailability, {
  foreignKey: 'vehicleId',
  as: 'unavailabilities',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Reservation.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Reservation.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle',
});

Unavailability.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle',
});

module.exports = {
  sequelize,
  Sequelize,
  User,
  Vehicle,
  Reservation,
  Unavailability,
};