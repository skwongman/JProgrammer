import latestList from "./latest.list.js";
import latestSortlist from "./latest.sortlist.js";
import categorySortlist from "./category.sortlist.js";
import popularList from "./latest.popularList.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

await Promise.all([
    latestList(),
    latestSortlist(),
    categorySortlist(),
    popularList(),
    userSigninStatus()
]);