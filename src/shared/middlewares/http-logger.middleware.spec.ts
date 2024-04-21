// * GDK Application Shell Default File
import { HttpLoggerMiddleware } from './http-logger.middleware';

describe('HttpLoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new HttpLoggerMiddleware()).toBeDefined();
  });
});
