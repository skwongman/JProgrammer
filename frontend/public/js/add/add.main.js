import addDrama from "./add.drama.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

await Promise.all([
    addDrama(),
    userSigninStatus()
]);