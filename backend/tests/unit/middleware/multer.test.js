const fs = require('fs');
const path = require('path');
const {
  imageUpload,
  destinationFn,
  filenameFn
} = require('../../../middleware/multer');

describe('Middleware Multer pour le téléchargement d\'images', () => {
  beforeAll(() => {
    const uploadDir = path.join(process.cwd(), 'public/upload/products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  });

  test('devrait configurer le stockage avec la destination correcte', () => {
    const mockCb = jest.fn();
    destinationFn({}, {}, mockCb);
    expect(mockCb).toHaveBeenCalledWith(null, 'public/upload/products');
  });

  test('devrait nommer le fichier avec le format correct', () => {
    const originalNow = Date.now;
    Date.now = jest.fn(() => 1234567890);

    const mockCb = jest.fn();
    const mockFile = {
      fieldname: 'image',
      originalname: 'test.jpg'
    };

    filenameFn({}, mockFile, mockCb);
    expect(mockCb).toHaveBeenCalledWith(null, 'image_1234567890test.jpg');

    Date.now = originalNow;
  });

  test('doit limiter la taille du fichier à 1MB', () => {
    expect(imageUpload.limits.fileSize).toBe(1048576);
  });

  describe('fileFilter', () => {
    const fileFilter = imageUpload.fileFilter;

    test.each([
      ['test.jpg'],
      ['test.jpeg'],
      ['test.png']
    ])('doit accepter le fichier %s', (filename) => {
      const mockCb = jest.fn();
      fileFilter({}, { originalname: filename }, mockCb);
      expect(mockCb).toHaveBeenCalledWith(undefined, true);
    });

    test('doit rejeter les fichiers non autorisés', () => {
      const mockCb = jest.fn();
      fileFilter({}, { originalname: 'test.gif' }, mockCb);

      expect(mockCb.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(mockCb.mock.calls[0][0].message).toBe('Il fault choisir un fichier jgp, png ou jpeg.');
    });
  });
});
