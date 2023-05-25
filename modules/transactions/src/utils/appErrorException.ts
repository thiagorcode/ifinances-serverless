export class AppErrorException extends Error {
  readonly statusCode: number;
  constructor(statusCode: number, mensagem: string) {
    super(mensagem);
    this.name = 'MeuErro';
    this.statusCode = statusCode;
  }
}
