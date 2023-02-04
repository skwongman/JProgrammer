export default function searchDrama(){

    $("#searchBarBtn").click(() => {
        async function searchKeyword(url, method){
            const response = await fetch(url, method);
            const data = await response.json();
            return data;
        };
    
        searchKeyword("/api/search", {
            method: "PUT",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({
                "searchBarInput": searchBarInput.value
            })
        })
        .then(data => {
            if(data.error && data.message == "not found"){
                alert("抱歉，找不到任何相關劇集內容！");
            };

            if(data.error && data.message == "The user input do not match with the designated format"){
                alert("請輸入正確內容！");
            };

            if(data.data){
                location.href = `/drama/${data.data.dramaID}`;
            };
        })
        .catch(error => {
            console.log("Error(index.searchDrama.js): " + error);
        });
    });

};