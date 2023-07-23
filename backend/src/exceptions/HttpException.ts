import Errors from './errors';

class HttpException extends Error {
  public status: number;

  public code: number;

  public message: string;

  public params: string;

  constructor(status: number, code: number, params?: string) {
    super(String(code));
    this.status = status;
    this.code = code;
    this.params = params;
    const err = Errors.find((error) => error.code === this.code);
    if (err.message) {
      this.code = code;
      this.message = err.message;
    } else {
      this.code = 0;
      this.message = 'Unknown error';
    }
  }
}

export default HttpException;
