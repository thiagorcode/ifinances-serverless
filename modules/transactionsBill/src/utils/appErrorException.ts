export class AppErrorException extends Error {
  readonly statusCode: number;
  readonly dataError: any;
  constructor(statusCode: number, message: string, data?: any) {
    super(message);

    this.name = 'MeuErro';
    this.statusCode = statusCode;
    this.dataError = data;
  }
}
