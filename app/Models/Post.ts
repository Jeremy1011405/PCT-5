import {PostType} from "./PostType";
export default class Post {
    id: String;
    type: PostType;
    username: String;
    image: any;
    footer: String;
    comments: any[];
    likes: String[];
    constructor(id: String, type: PostType, username: String, image: any, footer: String, comments: any[] ,likes: String[]) {
        this.id = id;
        this.type = type;
        this.username = username;
        this.image = image;
        this.footer = footer;
        this.comments = comments;
        this.likes = likes;
    }
}
