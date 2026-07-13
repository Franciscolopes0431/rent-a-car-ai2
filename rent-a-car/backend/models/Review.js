module.exports = (sequelize, DataTypes) => sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  reservationId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.STRING(500), allowNull: false, validate: { len: [10, 500] } },
  moderationStatus: { type: DataTypes.ENUM('pendente', 'aprovada', 'oculta'), allowNull: false, defaultValue: 'pendente', field: 'moderation_status' },
  adminResponse: { type: DataTypes.STRING(500), allowNull: true, field: 'admin_response' },
  moderatedById: { type: DataTypes.INTEGER, allowNull: true, field: 'moderated_by_id' },
  moderatedAt: { type: DataTypes.DATE, allowNull: true, field: 'moderated_at' },
}, { tableName: 'reviews', timestamps: true });
