/**
 * Class with image metadata and image file
 */
export class ImageMeta {

    id: number;
    title: string;
    timestamp: Date;
    url: string;
    user: string;
    likes: number;
    file: Express.Multer.File;
    commentIds: number[];


    constructor(title: string,
        user: string,
        timestamp: Date,
        file: Express.Multer.File) {

        this.title = title;
        this.user = user;
        this.timestamp = timestamp;
        this.file = file;
        this.likes = 0;
        this.commentIds = new Array();
    }



}

