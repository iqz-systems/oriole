import { RestClient } from './rest-client';

export abstract class ClientBase {
  protected restClient: RestClient;

  constructor(restClient: RestClient) {
    this.restClient = restClient;
  }
}
