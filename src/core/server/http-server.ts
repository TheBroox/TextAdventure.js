import express, { Handler } from 'express';
import { Express } from 'express';

import bodyParser from 'body-parser';
import session from 'express-session';
import createConsole from '../console/console';

import { ICartridge } from '../shims/textadventurejs.shim';

export interface IServerOptions {
  ipAddress?: string;
  port?: number;
  consoleApiPath?: string;
}

export class ConsoleHttpServer {

  private _options: IServerOptions = {};
  private _middleware?: Handler[];
  private _app: Express;
  private _cartridges: { [cartridgeName: string]: ICartridge };

  constructor(options: IServerOptions) {

    this._middleware = [];
    this._cartridges = {};
    this._options = options;
  }

  private configure(): void {

    const consoleApiPath = this._options.consoleApiPath || '/console';

    this._app = express();

    this._app.use(bodyParser.json());
    this._app.use(bodyParser.urlencoded({ extended: true }));

    if (this._middleware) {
      this._middleware.forEach(toUse => {
        this._app.use(toUse);
      });
    }

    this._app.use(session({secret: '1234567890QWERTY', resave: false, saveUninitialized: true}));

    const con = createConsole();

    if (this._cartridges) {
      Object.keys(this._cartridges).forEach(cartridgeName => {
        con.registerCartridge(cartridgeName, this._cartridges[cartridgeName]);
      })
    }

    this._app.post(consoleApiPath, function(req,res) {
      res.json({response: con.input(req.body.input, req.session.id)});
    });
  }

  public use(middleware: Handler): ConsoleHttpServer {

    this._middleware.push(middleware);

    return this;
  }

  public registerCartridge(name: string, cartridge: ICartridge): ConsoleHttpServer {

    this._cartridges[name] = cartridge;

    return this;
  }

  public listen(): void {

    this.configure();

    const port = this._options.port;
    const ipAddress = this._options.ipAddress;

    this._app.listen(port, ipAddress, function () {
      console.log( "Listening on " + ipAddress + ", server_port " + port);
    });
  }
}
