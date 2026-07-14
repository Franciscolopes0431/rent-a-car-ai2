function parsePositiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizePagination(page, pageSize, options = {}) {
  const defaultSize = options.defaultSize || 10;
  const maxSize = options.maxSize || 100;
  const safePage = parsePositiveInteger(page, 1);
  const safePageSize = Math.min(maxSize, parsePositiveInteger(pageSize, defaultSize));
  return {
    page: safePage,
    pageSize: safePageSize,
    limit: safePageSize,
    offset: (safePage - 1) * safePageSize,
  };
}

module.exports = { normalizePagination };
