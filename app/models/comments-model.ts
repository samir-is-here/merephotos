/**
 * class to represent comments and replies for a given image ID
 */

export class Comments {

    commentId: number;
    timestamp: Date;
    user: string;
    comment: string;
    replies: Comments[];

    constructor( user: string,
        timestamp: Date,       
        comment: string) {
       
        this.timestamp = timestamp;
        this.user = user;
        this.comment = comment;
        this.replies = new Array();

    }






}