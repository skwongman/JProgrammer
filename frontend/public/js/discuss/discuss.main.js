import discussPost from "./discuss.post.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

try{
    await Promise.all([
        discussPost(),
        userSigninStatus()
    ]);
}
catch(err){
    console.log(err);
};