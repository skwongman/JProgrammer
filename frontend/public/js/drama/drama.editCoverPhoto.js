export default function editCoverPhoto(){

    // Global variable for store the cover photo
    let editCoverPhoto;

    const model = {

        init: function(){

            // Photo preview
            $("#editDramaCoverPhotoBtn").change((e) => {

                const photoToBeUploaded = e.target.files[0];
                const typeOfPhotoAllowed = ["image/jpeg", "image/jpg", "image/png"];
                const matchTypeOfPhoto = typeOfPhotoAllowed.includes(photoToBeUploaded.type);
                const meetPhotoUploadSize = photoToBeUploaded.size <= 1000000;

                // The type of photo to be uploaded should be jpeg, jpg or png.
                if(!matchTypeOfPhoto){
                    alert("劇集封面圖片格式必須是jpeg、jpg、png！ ");

                    // Upload photo data clearance.
                    e.target.value = "";
                }
                // The size of photo to be uploaded should be 1MB or below.
                else if(!meetPhotoUploadSize){
                    alert("請選擇容量少於1MB的劇集封面圖片！");

                    // Upload photo data clearance.
                    e.target.value = "";
                }
                else{
                    // Add the temp photo link to the html DOM for instance photo preview.
                    const tempPhotoLink = URL.createObjectURL(photoToBeUploaded);

                    editCoverPhoto = $("#dramaCoverPhoto").attr("src");
                    
                    $("#dramaCoverPhoto").attr("src", "");
                    $("#dramaCoverPhoto").attr("src", tempPhotoLink);
                    $("#editDramaCoverPhotoSubmitContainer").css("display", "block");
                };

            });

            // Cancel not upload
            $("#editDramaCoverPhotoNotConfirmBtn").click((e) => {
                e.preventDefault();
                $("#dramaCoverPhoto").attr("src", editCoverPhoto);
                $("#editDramaCoverPhotoSubmitContainer").css("display", "none");
                $("#dramaEditBtn").css("display", "block");
                $("img.individual-edit-btn").css("display", "none");
                $("#editDramaCoverPhotoLabel").attr("for", "");
                $("#dramaCoverPhoto").css("cursor", "");
                $("#dramaCoverPhoto").off("mouseenter mouseleave");
            });

            // Photo upload
            $("#editDramaCoverPhotoConfirmBtn").click((e) => {

                e.preventDefault();

                view.renderAddLoadingEffect();

                // Pack both text and photo data by using form data approach before fetching API.
                const editDramaCoverPhoto = $("#editDramaCoverPhotoBtn").get(0).files[0];
                const updateIndicator = "edit7";
                const addDramaData = new FormData();

                addDramaData.append("editDramaCoverPhoto", editDramaCoverPhoto);
                addDramaData.append("updateIndicator", updateIndicator);

                const editDramaID = location.href.split("/").pop();

                // Fetching data to the backend side.
                async function editData(url, method){
                    const response = await fetch(url, method);
                    const data = await response.json();
                    return data;
                };

                editData(`/api/drama/edit/${editDramaID}`, {
                    method: "PATCH",
                    body: addDramaData
                })
                .then(data => {
                    if(data.data){
                        view.renderPhotoUploadData(data);
                    };
                })
                .catch(error => {
                    view.renderPhotoUploadDataError(error);
                });
            
            });

        }

    };

    const view = {

        renderAddLoadingEffect: function(){
            topbar.show();
        },

        renderRemoveLoadingEffect: function(){
            topbar.hide();
        },

        renderPhotoUploadData: function(data){
            $("#dramaCoverPhoto").attr("src", "");
            $("#dramaCoverPhoto").attr("src", data.data);
            $("#transparentLayer").css("background-color", data.dominantColor);
            $("#dramaBannerBackgroundPhoto").css("background-image", `url("${data.data}")`);
            (data.isDark) ? $("#dramaDetailsFontColor").css("color", "#fff") : $("#dramaDetailsFontColor").css("color", "#000");

            // Episode Tap Bar and Button Color
            (data.isDark) ? $(".video-btn-jp").css("color", "#fff") : $(".video-btn-jp").css("color", "#000");
            (data.isDark) ? $(".video-btn-chi").css("color", "#fff") : $(".video-btn-chi").css("color", "#000");
            (data.isDark) ? $(".video-btn-user").css("color", "#fff") : $(".video-btn-user").css("color", "#000");
            (data.isDark) ? $(".drama-no-source").css("color", "#fff") : $(".drama-no-source").css("color", "#000");
            (data.isDark) ? $(".nav-link").css("color", "#fff") : $(".nav-link").css("color", "#000");

            $("#editDramaCoverPhotoSubmitContainer").css("display", "none");
            $("#dramaEditBtn").css("display", "block");
            $("img.individual-edit-btn").css("display", "none");
            $("#editDramaCoverPhotoLabel").attr("for", "");
            $("#dramaCoverPhoto").css("cursor", "");
            $("#dramaCoverPhoto").off("mouseenter mouseleave");

            view.renderRemoveLoadingEffect();
        },

        renderPhotoUploadDataError: function(error){
            console.log("Error(drama.editCoverPhoto.js): " + error);

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