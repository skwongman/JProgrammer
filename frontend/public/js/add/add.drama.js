export default function addDrama(){

    // Show whole content
    setTimeout(() => {
        $("#addDramaContentContainer").css("visibility", "visible");
    }, 300);

    // Handle add drama button click.
    $("#handleAddDramaBtn").click((e) => {
        e.preventDefault();

        // Add loading effect
        topbar.show();

        // Fetching data to the backend side.
        async function addData(url, method){
            const response = await fetch(url, method);
            const data = await response.json();
            return data;
        };

        addData("/api/add", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({
                "addDramaTitle": addDramaTitle.value,
                "addDramaCategory": addDramaCategory.value,
                "addDramaIntroduction": addDramaIntroduction.value,
                "addDramaTV": addDramaTV.value,
                "addDramaDateOfBroadcast": addDramaDateOfBroadcast.value,
                "addDramaWeek": addDramaWeek.value,
                "addDramaTimeOfBoardcast": addDramaTimeOfBoardcast.value,
                "addDramaActor": addDramaActor.value,
                "addDramaRating": addDramaRating.value,
                "addDramaMedia": addDramaMedia.value
            })
        })
        .then(data => {
            // User input error handling.
            if(data.error && data.message == "The title does not match with the designated format"){
                alert("請輸入正確劇集標題格式！");

                // Remove loading effect
                topbar.hide();
            }
            else if(data.error && data.message == "The category does not match with the designated format"){
                alert("請選擇劇集類別！");

                // Remove loading effect
                topbar.hide();
            }
            else if(data.error && data.message == "The introduction does not match with the designated format"){
                alert("請輸入正確劇集概要格式！");

                // Remove loading effect
                topbar.hide();
            }
            else if(data.error && data.message == "The tv does not match with the designated format"){
                alert("請選擇劇播放電視台！");

                // Remove loading effect
                topbar.hide();
            }
            else if(data.error && data.message == "The date does not match with the designated format"){
                alert("請選擇劇集首播日期！");

                // Remove loading effect
                topbar.hide();
            }
            else if(data.error && data.message == "The week does not match with the designated format"){
                alert("請選擇劇集每週播放！");

                // Remove loading effect
                topbar.hide();
            }
            else if(data.error && data.message == "The time does not match with the designated format"){
                alert("請輸入正確劇集時間表格式！");

                // Remove loading effect
                topbar.hide();
            }
            else if(data.error && data.message == "The actor does not match with the designated format"){
                alert("請輸入正確劇集主要演員格式！");

                // Remove loading effect
                topbar.hide();
            }
            else if(data.error && data.message == "The rating does not match with the designated format"){
                alert("請輸入正確劇集收視率格式！");

                // Remove loading effect
                topbar.hide();
            }
            else if(data.error && data.message == "The media does not match with the designated format"){
                alert("請輸入正確劇集媒體資訊網址格式！");

                // Remove loading effect
                topbar.hide();
            };

            // If the drama title has been registered.
            if(data.error && data.message == "This drama title has been registered"){
                alert("已經有該劇集資料，如果有新的相同劇集名稱，歡迎隨時發送電郵致本網站作相關跟進。");

                // Remove loading effect
                topbar.hide();
            };

            // Redirect to the newly added drama page if successful added drama.
            if(data.data){
                location.href = `/drama/${data.data.addDramaID}`;

                // Remove loading effect
                topbar.hide();
            };
        })
        .catch(error => {
            console.log("Error(add.drama.js): " + error);

            // Remove loading effect
            topbar.hide();
        });
    });

};