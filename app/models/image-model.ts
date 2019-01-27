/**
 * Class with image metadata and image file
 */
export class ImageMeta {

    id: number;
    title: string;
    timestamp: Date;
    url: string;
    file: Express.Multer.File;


    constructor(title: string,
        timestamp: Date,
        file: Express.Multer.File) {

        this.title = title;
        this.timestamp = timestamp;
        this.file = file;
    }



}

