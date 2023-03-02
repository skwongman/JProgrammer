export default function dramaEditBtn(){

    const model = {

        init: function(){
            // Display all the drama edit buttons and hide edit button itself.
            $("#dramaEditBtn").click(() => {
                view.renderAddLoadingEffect();

                async function editDataAuth(url){
                    const response = await fetch(url);
                    const data = await response.json();
                    return data;
                };

                editDataAuth("/api/user/auth")
                .then(data => {
                    view.renderDramaEditData(data);
                })
                .catch(error => {
                    view.renderDramaEditDataError(error);
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

        renderDramaEditData: function(data){
            if(data.error && data.message == "forbidden"){
                location.href = "/signin";

                view.renderRemoveLoadingEffect();
            };

            if(data.data){
                if($("img.individual-edit-btn").css("display") == "block"){
                    $("img.individual-edit-btn").css("display", "none");
    
                    // Clear the photo upload function.
                    $("#editDramaCoverPhotoLabel").attr("for", "");
    
                    // Clear the cursor.
                    $("#dramaCoverPhoto").css("cursor", "");
                
                    // Clear the CSS hover effect.
                    $("#dramaCoverPhoto").off("mouseenter mouseleave");
    
                    // Return to the first tab of video bar.
                    $("#home-tab").click();

                    view.renderRemoveLoadingEffect();
                }
                else{
                    $("img.individual-edit-btn").css("display", "block");
                    $("#editDramaCoverPhotoLabel").attr("for", "editDramaCoverPhotoBtn");
                    $("#dramaCoverPhoto").css("cursor", "pointer");
                    $("#dramaCoverPhoto").hover(
                        function(){
                            $(this).css("filter", "brightness(0.8) contrast(120%)");
                        },
                        function(){
                            $(this).css("filter", "");
                        }
                    );
            
                    if($("#dramaDownloadUploadTab").css("display") == "block"){
                        $("#edit7").css("display", "block");
                        $("#profile-tab-2").click();

                        view.renderRemoveLoadingEffect();
                    }
                    else{
                        $("#edit7").css("display", "none");

                        view.renderRemoveLoadingEffect();
                    };
                };
            };
        },

        renderDramaEditDataError: function(error){
            console.log("Error(drama.editBt.js): " + error);
        }

    };

    const controller = {

        init: function(){
            model.init();
        }

    };
    controller.init();

};