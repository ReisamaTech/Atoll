import logger from './logger';
import * as express from 'express';
import * as expressWS from 'express-ws';
import * as cors from 'cors';

const DEFAULT_INTERNAL_HOST = '0.0.0.0';
const DEFAULT_INTERNAL_PORT = 4000;
const DEFAULT_EXTERNAL_PRIVATE_HOST = '0.0.0.0';
const DEFAULT_EXTERNAL_PRIVATE_PORT = 5000;
const DEFAULT_EXTERNAL_PUBLIC_HOST = '0.0.0.0';
const DEFAULT_EXTERNAL_PUBLIC_PORT = 8000;

const INTERNAL_HOST = process.env.INTERNAL_HOST ?? DEFAULT_INTERNAL_HOST;
const INTERNAL_PORT = process.env.INTERNAL_PORT ?? DEFAULT_INTERNAL_PORT;
const EXTERNAL_PRIVATE_HOST = process.env.EXTERNAL_PRIVATE_HOST ?? DEFAULT_EXTERNAL_PRIVATE_HOST;
const EXTERNAL_PRIVATE_PORT = process.env.EXTERNAL_PRIVATE_PORT ?? DEFAULT_EXTERNAL_PRIVATE_PORT;
const EXTERNAL_PUBLIC_HOST = process.env.EXTERNAL_PUBLIC_HOST ?? DEFAULT_EXTERNAL_PUBLIC_HOST;
const EXTERNAL_PUBLIC_PORT = process.env.EXTERNAL_PUBLIC_PORT ?? DEFAULT_EXTERNAL_PUBLIC_PORT;

export class API {
    internalApp: expressWS.Application;
    externalPrivateApp: expressWS.Application;
    externalPublicApp: expressWS.Application;
    constructor() {
        this.internalApp = initExpress(INTERNAL_PORT, INTERNAL_HOST);
        this.externalPublicApp = initExpress(EXTERNAL_PUBLIC_PORT, EXTERNAL_PUBLIC_HOST);
        this.externalPrivateApp = initExpress(EXTERNAL_PRIVATE_PORT, EXTERNAL_PRIVATE_HOST);

        const InternalAPI = require('./internal').InternalAPI;
        const PublicPages = require('./external-public').PublicPages;
        const PrivatePages = require('./external-private').PrivatePages;

        this.internalApp.use(InternalAPI);
        //this.externalPublicApp.use(PublicPages);
        //this.externalPrivateApp.use(PrivatePages);
    }
}

function initExpress(port, host) {
    const app = expressWS(express()).app;

    // debug logger
    if (process.env.DEBUG) {
        function requestLogger(req: express.Request, res: express.Response, next: express.NextFunction) {
            try {
                req.app.locals.logger.debug(`${req.ip} > ${req.method} ${req.path}`);
            } catch (err) { }
            next();
        }
        app.use(requestLogger);
    }

    // Disable X-Powered-By Express header
    app.disable("x-powered-by");

    // Configure CORS
    const CORS = cors({

    });

    app.use("*", CORS);
    app.options("*", CORS);

    // Create Application specfic logger
    switch (port) {
        case INTERNAL_PORT: {
            app.locals.logger = logger.child({
                "area": "InternalApp"
            });
            break;
        }
        case EXTERNAL_PUBLIC_PORT: {
            app.locals.logger = logger.child({
                "area": "PublicApp"
            });
            break;
        }
        case EXTERNAL_PRIVATE_PORT: {
            app.locals.logger = logger.child({
                "area": "PrivateApp"
            });
            break;
        }
        default: {
            throw new Error("Invalid Port");
        }
    }

    const server = app.listen(port, host);
    server.on("listening", () => {
        app.locals.logger.info(`Listening on ${host}:${port}`);
    });

    return app;
}

new API();