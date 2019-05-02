export class AuthorizationHeader {
  Authorization: string;

  constructor(headerValue: string) {
    this.Authorization = headerValue;
  }
}
