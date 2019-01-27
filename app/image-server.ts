import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./controllers/image-controller";


class ImageServer {
    public app: express.Application;
    public routes: Routes = new Routes();

    constructor() {
        this.app = express();
        this.routes.routes(this.app);
        this.config();
        this.configSwagger();

    }

    /**
     * Configure the express app.
     */
    private config(): void {
        // Native Express configuration
        this.app.use(bodyParser.urlencoded({ extended: false }));
        //support json input and limit 10mb
        this.app.use(bodyParser.json({ limit: '10mb' }));
    }

    private configSwagger(): void {
        const swaggerUi = require('swagger-ui-express');
        const YAML = require('yamljs');
        const swaggerDocument = YAML.load('./swagger.yaml');

        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }


}

export default new ImageServer().app;