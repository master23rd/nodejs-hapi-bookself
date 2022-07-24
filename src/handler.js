const { nanoid } = require('nanoid');
const books = require('./book');

class ValidationError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ValidationError';
    this.status = 'fail';
    this.code = code;
  }
}

const addBookHandler = (request, h) => {
  try {
    const {
      name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    if (name === undefined) {
      throw new ValidationError('Gagal menambahkan buku. Mohon isi nama buku', 400);
    } else if (readPage > pageCount) {
      throw new ValidationError('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', 400);
    }

    const id = nanoid(16);
    const finished = pageCount - readPage <= 0;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
      // eslint-disable-next-line max-len
      name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt,
    };

    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
    throw new Error('Buku gagal ditambahkan', 400);
  } catch (error) {
    let responseMessage;
    if (error instanceof ValidationError) {
      responseMessage = {
        message: error.message,
        code: error.code,
        status: error.status,
      };
    } else if (error instanceof ReferenceError) {
      responseMessage = {
        message: error.message,
        code: 500,
        status: 'error',
      };
    }

    const response = h.response({
      status: responseMessage.status,
      message: responseMessage.message,
    });
    response.code(responseMessage.code);
    return response;
  }
};

const getAllBookHandler = () => ({
  status: 'success',
  data: {
    books: books.map(({ id, name, publisher }) => ({ id, name, publisher })),
  },
});

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  try {
    const { id } = request.params;
    const {
      name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);
    const finished = pageCount - readPage <= 0;

    if (name === undefined) {
      throw new ValidationError('Gagal memperbarui buku. Mohon isi nama buku', 400);
    } else if (readPage > pageCount) {
      throw new ValidationError('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', 400);
    }

    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
      };

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }

    throw new Error('Gagal memperbarui buku. Id tidak ditemukan');
  } catch (error) {
    let responseMessage;
    if (error instanceof ValidationError) {
      responseMessage = {
        message: error.message,
        code: error.code,
        status: error.status,
      };
    } else if (error) {
      responseMessage = {
        message: error.message,
        code: 404,
        status: 'fail',
      };
    }

    const response = h.response({
      status: responseMessage.status,
      message: responseMessage.message,
    });
    response.code(responseMessage.code);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};
