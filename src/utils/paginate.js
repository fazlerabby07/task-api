const paginate = require('express-paginate');
const qs = require('qs');
const url = require('url');

const getPages = (req, pageCount) => {
  const pages = paginate
    .getArrayPages(req)(10, pageCount, req.query.page)
    .map(({ url }) => url);

  return {
    previousPage: previousPage(req),
    firstPage: firstPage(req),
    lastPage: lastPage(req, pageCount),
    nextPage: nextPage(req, pageCount),
    pages
  };
};

const previousPage = req => {
  if (req.query.page < 2) {
    return null;
  }

  return paginate.href(req)(true);
};

const firstPage = req => {
  const query = { ...req.query, page: 1 };

  return url.parse(req.originalUrl).pathname + '?' + qs.stringify(query);
};

const lastPage = (req, pageCount) => {
  const query = { ...req.query, page: pageCount };

  return url.parse(req.originalUrl).pathname + '?' + qs.stringify(query);
};

const nextPage = (req, pageCount) => {
  if (!paginate.hasNextPages(req)(pageCount)) {
    return null;
  }

  return paginate.href(req)();
};

module.exports = getPages;
