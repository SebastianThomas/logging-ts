import { Visit } from './Visit';

export class User {
  id: number;
  ip: string;
  visits: Visit[];
  time: number;

  constructor(id: number, ip: string) {
    this.id = id;
    this.ip = ip;

    this.visits = [];
    this.time = new Date().getTime();
  }
}
