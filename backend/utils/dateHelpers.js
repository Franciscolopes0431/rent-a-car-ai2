const { Op } = require('sequelize');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toDateOnlyString(value) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const textValue = String(value);
  const isoMatch = textValue.match(/^\d{4}-\d{2}-\d{2}/);

  if (isoMatch) {
    return isoMatch[0].slice(0, 10);
  }

  const date = new Date(textValue);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Data invalida.');
  }

  return date.toISOString().slice(0, 10);
}

function parseDateOrThrow(value, fieldName) {
  const dateOnly = toDateOnlyString(value);
  const date = new Date(`${dateOnly}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Campo ${fieldName} invalido.`);
  }

  return date;
}

function normalizeDateRange(dataInicio, dataFim) {
  const inicio = parseDateOrThrow(dataInicio, 'data_inicio');
  const fim = parseDateOrThrow(dataFim, 'data_fim');

  if (inicio >= fim) {
    throw new Error('data_inicio deve ser menor que data_fim.');
  }

  return { inicio, fim };
}

function calculateDaysBetween(inicio, fim) {
  // A conta usa UTC para manter o valor estavel independentemente do fuso horario.
  return Math.ceil((fim.getTime() - inicio.getTime()) / MS_PER_DAY);
}

function buildOverlapWhere(inicio, fim) {
  // Regra de sobreposicao: inicio_existente < fim_pedido E fim_existente > inicio_pedido.
  return {
    [Op.and]: [
      { data_inicio: { [Op.lt]: fim } },
      { data_fim: { [Op.gt]: inicio } },
    ],
  };
}

module.exports = {
  parseDateOrThrow,
  normalizeDateRange,
  calculateDaysBetween,
  buildOverlapWhere,
};