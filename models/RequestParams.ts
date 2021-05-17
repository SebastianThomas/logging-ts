import { Request } from 'express';

export class RequestParams {
  ips: string[];
  body: any;
  method: string;
  params: any;
  path: string;
  protocol: string;
  route: string;
  secure: boolean;
  statusCode: number | undefined;
  statusMessage: string | undefined;
  subdomains: string[];
  url: string;
  xhr: boolean;

  constructor(req: Request) {
    this.ips = req.ips;
    this.body = req.body;
    this.method = req.method;
    this.params = req.params;
    this.path = req.path;
    this.protocol = req.protocol;
    this.route = req.route;
    this.secure = req.secure;
    this.statusCode = req.statusCode;
    this.statusMessage = req.statusMessage;
    this.subdomains = req.subdomains;
    this.url = req.url;
    this.xhr = req.xhr;
  }
}
