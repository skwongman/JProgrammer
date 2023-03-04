export default function discussPagination(discussPostID, totalPages){

    discussPostID = discussPostID.split("?")[0];
    const currentpage = location.href.split("page=").pop();
    
    for(let i = 0; i < totalPages; i ++){
        if(i + 1 == currentpage){
            $("#pagination").append(`
                <li id="page${i + 1}" class="page-item">
                    <span class="page-link">${i + 1}</span>
                </li>
            `);
        }
        else{
            $("#pagination").append(`
                <li id="page${i + 1}" class="page-item">
                    <a class="page-link" href="/discuss/${discussPostID}?page=${i + 1}">${i + 1}</a>
                </li>
            `);
        };
    };

    document.querySelector(`#page${currentpage}`).className = "page-item active";

};