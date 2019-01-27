import * as Loki from 'lokijs';
import * as path from 'path';
import * as multer from 'multer';

const loadCollection = function (colName, db: Loki): Promise<Loki.Collection<any>> {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        })
    });
}

const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        console.log("invalid file!!");
        return cb(null, false);
        //throw new Error('Only image files are allowed!');
    }
    cb(null, true);
}

const filenamer = function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
}

const filepathcreater = function (filename: string): string {
    return path.join(UPLOAD_PATH, filename);
}


const DB_NAME = 'images.json';
const UPLOAD_PATH = 'uploads';
const diskStorage = multer.diskStorage({ destination: `${UPLOAD_PATH}/`, filename: filenamer });
const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: imageFilter, storage: diskStorage }).single('imageFile'); // multer configuration
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' });


export { imageFilter, loadCollection, filenamer, filepathcreater, upload, db };
