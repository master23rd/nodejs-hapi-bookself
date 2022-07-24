const {
  getAllBookHandler, addBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
} = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: getAllBookHandler,
  },
  {
    method: 'POST',
    path: '/books',
    // handler: () => {},
    handler: addBookHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBookHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
