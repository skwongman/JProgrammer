import discussPost from "./discuss.post.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

await Promise.all([
    discussPost(),
    userSigninStatus()
]);