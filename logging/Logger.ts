import chalk from 'chalk';
import { User } from '../models/User';

export class Logger {
  constructor() {
    console.log(chalk.yellow('Logging with chalk.'));
  }

  request(req: any, res: any, next: any) {
    const now = new Date();
    console.log(
      chalk.blue(
        Logger.formatDate('/', now) + ' ' + Logger.formatTime(':', now) + ': '
      ) +
        chalk.red(req.method) +
        ' ' +
        chalk.green(req.path)
    );

    next();
  }

  // Express listen
  listen(PORT: number | string) {
    console.log(chalk.yellow(`Listening to PORT ${PORT}`));
  }

  // Statistics
  initStats() {
    console.log('Statistics initialized');
  }
  usersRetrieved(users: User[]) {
    console.log(chalk.gray('Retrieved upreviously saved users'));
  }

  newUser(id: number) {
    console.log(chalk.red('A new user connected!'));
  }

  fileWritten(filePath: string) {
    console.log(chalk.gray('Written to file: ') + chalk.gray(filePath));
  }

  statsResetted() {
    console.log(chalk.gray('Statistics resetted'));
  }

  // Formatting
  static formatDate(delimiter: string, dt: Date): string {
    const monthAdd = dt.getMonth() < 9 ? '0' : '';
    const dayAdd = dt.getDate() < 10 ? '0' : '';
    return `${dt.getFullYear()}${delimiter}${monthAdd}${
      dt.getMonth() + 1
    }${delimiter}${dayAdd}${dt.getDate()}`;
  }

  static formatTime(delimiter: string, dt: Date): string {
    return dt.toLocaleTimeString('de-DE').replace(/:/g, delimiter);
  }
}
