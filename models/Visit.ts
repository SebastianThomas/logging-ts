import { RequestParams } from './RequestParams';

export class Visit {
  time: number;
  requestParams: RequestParams;

  constructor(time: Date, requestParams: RequestParams) {
    this.time = time.getTime();
    this.requestParams = requestParams;
  }
}
