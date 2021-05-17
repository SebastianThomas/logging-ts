import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { Logger } from '../logging/Logger';

import { RequestParams } from '../models/RequestParams';
import { User } from '../models/User';
import { Visit } from '../models/Visit';

export class Stats {
  static pwd: string = 'hai';
  lastIndex: number = 0;
  users: User[] = [];

  logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
    this.logger.initStats();

    fs.readFile('users-stats/users-stats.json', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // File not found
          return this.saveUsers();
        }
        throw err;
      }

      this.users = JSON.parse(data.toString()).users;
      this.lastIndex = JSON.parse(data.toString()).lastIndex || 0;
      this.logger.usersRetrieved(this.users);
    });
  }

  // Get routes
  newRequest(req: Request, res: Response, next: NextFunction) {
    let user: User | undefined = this.users.find(el => el.ip === req.ip);

    if (!user) user = this.newUser(req.ip, false);

    this.users.forEach((el, index) => {
      if (el.ip === req.ip) {
        const requestParams: RequestParams = new RequestParams(req);
        this.users[index].visits.push(new Visit(new Date(), requestParams));

        return;
      }
    });

    this.saveUsers();

    next();
  }

  getUsers() {
    return this.users;
  }

  newUser(ip: string, saveUsers: boolean = true): User {
    if (!this.users) {
      throw new Error(`Users not defined: ${this.users}`);
    }

    const newUser = this.lastIndex++;
    const u = new User(newUser, ip);
    this.users.push(u);

    if (saveUsers) this.saveUsers();

    this.logger.newUser(newUser);
    return u;
  }

  saveUsers() {
    const payload = {
      users: this.users,
      time: new Date().getTime(),
      lastIndex: this.lastIndex,
    };

    // Write to temporary file
    fs.writeFile(
      'users-stats/users-stats.json',
      JSON.stringify(payload),
      err => {
        if (err) {
          fs.mkdir('users-stats', () => {
            if (err) throw err;
            console.log('After creation');
            return this.saveUsers();
          });
        }

        // Directory existing; writing to permanent file
        const now = new Date();
        const dateFormat = Logger.formatDate('-', now);
        const timeFormat = Logger.formatTime('-', now);
        const path = `users-stats/${dateFormat}_${timeFormat}_users-stats.json`;
        fs.writeFile(path, JSON.stringify(payload), err => {
          if (err) throw err;
          this.logger.fileWritten(path);
        });
      }
    );
  }

  // Remove stats
  resetStats() {
    this.users = [];

    this.removeJSONs();
    this.clearTempJSON();

    this.logger.statsResetted();
  }

  removeJSONs() {
    fs.readdir('users-stats', (err, files) => {
      if (err) {
        console.error('Could not list the directory.', err);
      }

      files.forEach(file => {
        if (file !== 'users-stats.json') {
          fs.unlink(`users-stats/${file}`, err => {
            if (err) console.log(err);
          });
        }
      });
    });
  }

  clearTempJSON() {
    fs.writeFile(
      'users-stats/users-stats.json',
      JSON.stringify({
        users: [],
        time: new Date().getTime(),
        lastIndex: this.lastIndex ? this.lastIndex : 0,
      }),
      err => {
        if (err) throw err;
      }
    );
  }
}
