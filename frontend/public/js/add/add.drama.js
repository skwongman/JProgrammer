export default function addDrama(){

    const model = {

        init: function(){

            function webInitialLoad(){
                // Show the whole page content.
                setTimeout(() => {
                    $("#addDramaContentContainer").css("visibility", "visible");
                }, 300);
        
                // All user input data clearance.
                $("input").val("");
                $("select").val("");
                $("textarea").val("");
                $("#addDramaCoverPhotoPreviewContainer").attr("src", "");
            };
            webInitialLoad();

            // Drama cover photo preview before upload.
            function dramaCoverPhotoPreviewFunc(){
                $("#addDramaCoverPhoto").change((e) => {

                    const photoToBeUploaded = e.target.files[0];
                    const typeOfPhotoAllowed = ["image/jpeg", "image/jpg", "image/png"];
                    const matchTypeOfPhoto = typeOfPhotoAllowed.includes(photoToBeUploaded.type);
                    const meetPhotoUploadSize = photoToBeUploaded.size <= 1000000;

                    // The type of photo to be uploaded should be jpeg, jpg or png.
                    if(!matchTypeOfPhoto){
                        alert("劇集封面圖片格式必須是jpeg、jpg、png！ ");

                        // Upload photo data clearance.
                        e.target.value = "";
                        $("#addDramaCoverPhotoPreviewContainer").attr("src", "");
                    }
                    // The size of photo to be uploaded should be 1MB or below.
                    else if(!meetPhotoUploadSize){
                        alert("請選擇容量少於1MB的劇集封面圖片！");

                        // Upload photo data clearance.
                        e.target.value = "";
                        $("#addDramaCoverPhotoPreviewContainer").attr("src", "");
                    }
                    else{
                        // Add the temp photo link to the html DOM for instance photo preview.
                        const tempPhotoLink = URL.createObjectURL(photoToBeUploaded);
                        
                        $("#addDramaCoverPhotoPreviewContainer").css("display", "block");
                        $("#addDramaCoverPhotoPreviewContainer").attr("src", tempPhotoLink);
                    };
                });
            };
            dramaCoverPhotoPreviewFunc();

            // Handle add drama button click.
            function addDramaFunc(){
                $("#handleAddDramaBtn").click((e) => {
                    e.preventDefault();

                    view.renderAddLoadingEffect();

                    const photoToBeUploaded = $("#addDramaCoverPhoto").get(0).files[0];

                    if(photoToBeUploaded == undefined){
                        alert("請選擇要上載的劇集封面圖片！");

                        // Remove loading effect
                        topbar.hide();
                    }
                    else{
                        // Pack both text and photo data by using form data approach before fetching API.
                        const addDramaTitle = $("#addDramaTitle").val();
                        const addDramaTitleJp = $("#addDramaTitleJp").val();
                        const addDramaCategory = $("#addDramaCategory").val();
                        const addDramaIntroduction = $("#addDramaIntroduction").val();
                        const addDramaTV = $("#addDramaTV").val();
                        const addDramaDateOfBroadcast = $("#addDramaDateOfBroadcast").val();
                        const addDramaWeek = $("#addDramaWeek").val();
                        const addDramaTimeOfBoardcast = $("#addDramaTimeOfBoardcast").val();
                        const addDramaActor = $("#addDramaActor").val();
                        const addDramaRating = $("#addDramaRating").val();
                        const addDramaMedia = $("#addDramaMedia").val();
                        const addDramaVideo = $("#addDramaVideo").val();
                        const addDramaCoverphoto = $("#addDramaCoverPhoto").get(0).files[0];
                        const addDramaData = new FormData();

                        addDramaData.append("addDramaTitle", addDramaTitle);
                        addDramaData.append("addDramaTitleJp", addDramaTitleJp);
                        addDramaData.append("addDramaCategory", addDramaCategory);
                        addDramaData.append("addDramaIntroduction", addDramaIntroduction);
                        addDramaData.append("addDramaTV", addDramaTV);
                        addDramaData.append("addDramaDateOfBroadcast", addDramaDateOfBroadcast);
                        addDramaData.append("addDramaWeek", addDramaWeek);
                        addDramaData.append("addDramaTimeOfBoardcast", addDramaTimeOfBoardcast);
                        addDramaData.append("addDramaActor", addDramaActor);
                        addDramaData.append("addDramaRating", addDramaRating);
                        addDramaData.append("addDramaMedia", addDramaMedia);
                        addDramaData.append("addDramaVideo", addDramaVideo);
                        addDramaData.append("addDramaCoverphoto", addDramaCoverphoto);

                        // Fetching data to the backend side.
                        async function addData(url, method){
                            const response = await fetch(url, method);
                            const data = await response.json();
                            return data;
                        };

                        addData("/api/add", {
                            method: "POST",
                            body: addDramaData
                        })
                        .then(data => {
                            view.renderAddDramaData(data);
                        })
                        .catch(error => {
                            view.renderAddDramaDataError(error);
                        });
                    };
                });
            };
            addDramaFunc();

        }

    };

    const view = {

        renderAddLoadingEffect: function(){
            topbar.show();
        },

        renderRemoveLoadingEffect: function(){
            topbar.hide();
        },

        renderAddDramaData: function(data){
            // Any forbidden access will be redirected to the index page.
            if(data.error && data.message == "forbidden"){
                location.href = "/";

                view.renderRemoveLoadingEffect();
            };

            // User input error handling.
            if(data.error && data.message == "The title does not match with the designated format"){
                alert("請輸入正確中文劇集標題格式！");

                view.renderRemoveLoadingEffect();
            }
            else if(data.error && data.message == "The Japanese title does not match with the designated format"){
                alert("請輸入正確日文劇集標題格式！");

                view.renderRemoveLoadingEffect();
            }
            else if(data.error && data.message == "The category does not match with the designated format"){
                alert("請選擇劇集類別！");

                view.renderRemoveLoadingEffect();
            }
            else if(data.error && data.message == "The introduction does not match with the designated format"){
                alert("請輸入正確劇集概要格式！");

                view.renderRemoveLoadingEffect();
            }
            else if(data.error && data.message == "The tv does not match with the designated format"){
                alert("請選擇劇播放電視台！");

                view.renderRemoveLoadingEffect();
            }
            else if(data.error && data.message == "The date does not match with the designated format"){
                alert("請選擇劇集首播日期！");

                view.renderRemoveLoadingEffect();
            }
            else if(data.error && data.message == "The week does not match with the designated format"){
                alert("請選擇劇集每週播放！");

                view.renderRemoveLoadingEffect();
            }
            else if(data.error && data.message == "The time does not match with the designated format"){
                alert("請輸入正確劇集時間表格式！");

                view.renderRemoveLoadingEffect();
            }
            else if(data.error && data.message == "The actor does not match with the designated format"){
                alert("請輸入正確劇集主要演員格式！");

                view.renderRemoveLoadingEffect();
            }
            else if(data.error && data.message == "The rating does not match with the designated format"){
                alert("請輸入正確劇集收視率格式！");

                view.renderRemoveLoadingEffect();
            }
            else if(data.error && data.message == "The media does not match with the designated format"){
                alert("請輸入正確劇集媒體資訊網址格式！");

                view.renderRemoveLoadingEffect();
            }
            else if(data.error && data.message == "The video does not match with the designated format"){
                alert("請輸入正確劇集來源網址格式！");

                view.renderRemoveLoadingEffect();
            };

            // If the drama title has been registered.
            if(data.error && data.message == "This drama title has been registered"){
                alert("已經有該劇集資料，如果有新的相同劇集名稱，歡迎隨時發送電郵致本網站作相關跟進。");

                view.renderRemoveLoadingEffect();
            };

            // Redirect to the newly added drama page if successful added drama.
            if(data.data){
                location.href = `/drama/${data.data.addDramaID}`;

                // All user input data clearance.
                $("input").val("");
                $("select").val("");
                $("textarea").val("");
                $("#addDramaCoverPhotoPreviewContainer").attr("src", "");

                view.renderRemoveLoadingEffect();
            };
        },

        renderAddDramaDataError: function(error){
            console.log("Error(add.drama.js): " + error);

            view.renderRemoveLoadingEffect();
        }

    };

    const controller = {

        init: function(){
            model.init();
        }

    };
    controller.init();

};