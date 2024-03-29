import { Request, Response, response } from "express";
import * as fs from 'fs';
import { ImageMeta } from '../models/image-model';
import { db, filepathcreater, loadCollection, upload, commdb } from '../utils/dbutils';
import { Comments } from "../models/comments-model";


const COLLECTION_NAME = 'images';
const COMMENTS_COL_NAME = 'comments';


export class Routes {

    public routes(app): void {

        /**  
         * Root URL to check if server is up
         */
        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'Server is UP!!'
                })
            })

        /**
         * Images API supports GET and POST
         *
         */
        app.route('/images')
            /**
             * GET list of all the images stored on server
             */
            .get(async (req: Request, res: Response) => {
                try {
                    const col = await loadCollection(COLLECTION_NAME, db);
                    res.send(col.data);
                } catch (err) {
                    console.log(err);
                    res.sendStatus(400);
                }
            })
            /**
            *  Upload a new image onto the server
            */
            .post(upload, async (req: Request, res: Response) => {
                try {

                    if (!req.file) {
                        throw Error("invalid file type - only images are supported");
                    }

                    console.log("file uploaded : " + req.file.filename);

                    var imageMeta: ImageMeta = new ImageMeta(req.body.title, req.body.user, new Date(), req.file);

                    const col = await loadCollection(COLLECTION_NAME, db);
                    const data = col.insert(imageMeta);
                    var imageUrl: string = req.protocol + "://" + req.get('host') + req.originalUrl + "/" + data.$loki;
                    imageMeta.url = imageUrl;
                    imageMeta.id = data.$loki;
                    db.saveDatabase();
                    console.log(imageMeta);
                    res.send(imageMeta);
                } catch (err) {
                    console.log(err);
                    res.status(400).send({ message: err.toString() });

                }
            })
            /**
             * PUT operation is not supported for this URI
             */
            .put((req: Request, res: Response) => {
                res.status(501).send({
                    message: 'PUT method is not supported on this URL, please use POST to upload images'
                })
            })
            /**
             * DELETE operation is not supported for this URI
             * 
             */
            .delete((req: Request, res: Response) => {
                res.status(501).send({
                    message: 'DELETE method is not supported on this URL, please delete individual images by ID'
                })
            })


        /**
         * Images per ID - support GET and DELETE operation
         * 
         * */
        app.route('/images/:id')
            /**
             *          GET image by ID - Use the URL from images API to download the image
             *              
             */

            .get(async (req: Request, res: Response) => {
                try {
                    const col = await loadCollection(COLLECTION_NAME, db);
                    const result = col.get(req.params.id);

                    if (!result) {
                        res.sendStatus(404);
                        return;
                    }

                    res.setHeader('Content-Type', result.file.mimetype);
                    fs.createReadStream(filepathcreater(result.file.filename)).pipe(res);
                } catch (err) {
                    console.log(err);
                    res.sendStatus(400);
                }
            })
            /**
             * DELETE will remove the image from the server
             * on sucess, it returns 204 status
             */
            .delete(async (req: Request, res: Response) => {
                try {
                    const col = await loadCollection(COLLECTION_NAME, db);
                    const result = col.get(req.params.id);

                    if (!result) {
                        res.sendStatus(404);
                        return;
                    };

                    var inputuser = req.query.user;

                    console.log("input user : " + inputuser);
                    console.log("result : " + result.user);

                    if (!inputuser || inputuser != result.user) {
                        res.sendStatus(403);
                        return;
                    }

                    fs.unlink(filepathcreater(result.file.filename), cb => { return });
                    col.remove(result);
                    db.saveDatabase();
                    res.sendStatus(204);
                } catch (err) {
                    console.log(err);
                    res.sendStatus(400);
                }
            })
            /**
            * PUT operation is not support for this URI
             */
            .put((req: Request, res: Response) => {
                res.status(501).send({
                    message: 'PUT method is not supported on this URL'
                })
            })
            /**
             * POST operation is not support for this URI
             */
            .post((req: Request, res: Response) => {
                res.status(501).send({
                    message: 'POST method is not supported on this URL, please use delete to delete individual image and then add it'
                })
            })


        /**
        * Images per ID - support GET and DELETE operation
        * 
        * */
        app.route('/images/user/:user')
            /**
             *          GET image by user id - Use the URL from images API to download the image
             *              
             */
            /**
                 *          GET image by user id - Use the URL from images API to download the image
                 *              
                 */

            .get(async (req: Request, res: Response) => {
                try {
                    const col = await loadCollection(COLLECTION_NAME, db);
                    const result = col.find({ 'user': req.params.user });

                    if (!result) {
                        res.sendStatus(404);
                        return;
                    }
                    res.send(result);
                } catch (err) {
                    console.log(err);
                    res.sendStatus(400);
                }
            })


        /**
        * increments like for a particular image
        * 
        * */
        app.route('/image/:id/like')
            /**
                 *          POST like on image by  id - increment the like
                 *              
                 */

            .post(async (req: Request, res: Response) => {
                try {
                    const col = await loadCollection(COLLECTION_NAME, db);
                    const result = col.get(req.params.id);

                    if (!result) {
                        res.sendStatus(404);
                        return;
                    }

                    result.likes++;
                    col.update(result);
                    db.saveDatabase();
                    res.send(result);
                } catch (err) {
                    console.log(err);
                    res.sendStatus(400);
                }
            })


                    /**
        * increments like for a particular image
        * 
        * */
        app.route('/image/:id/comment')
        /**
             *          PUT image by  id - increment the like
             *              
             */

        .post(async (req: Request, res: Response) => {
            try {
                const col = await loadCollection(COLLECTION_NAME, db);
                const result = col.get(req.params.id);

                if (!result) {
                    res.sendStatus(404);
                    return;
                }

                //console.log(req);

                
                var comment: Comments = new Comments(req.query.user, new Date(), req.query.comment);
                const commCol = await loadCollection(COMMENTS_COL_NAME, commdb);
                const data = commCol.insert(comment);

                comment.commentId = data.$loki;

                console.log(result);

                result.commentIds.push(comment.commentId);
               
                col.update(result);
                db.saveDatabase();
                commdb.saveDatabase();
                res.send(result);
            } catch (err) {
                console.log(err);
                res.sendStatus(400);
            }
        })



    }
}




