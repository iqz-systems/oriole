import { RestClient } from './rest-client';

export abstract class ClientBase {
  restClient: RestClient;

  constructor(restClient: RestClient) {
    this.restClient = restClient;
  }
}
