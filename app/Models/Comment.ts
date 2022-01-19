export default class Comment {
    id: String;
    username: String;
    info: String;
    likes: String[]
    timestamp: String;
    constructor(id: String, username: String, info: String, likes: String[], timestamp: String) {
        this.id = id;
        this.username = username;
        this.info = info;
        this.likes = likes;
        this.timestamp = timestamp;
    }
}
