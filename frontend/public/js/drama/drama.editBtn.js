export default function dramaEditBtn(){

    // Display all the drama edit buttons and hide edit button itself.
    $("#dramaEditBtn").click(() => {

        // Add loading effect
        topbar.show();

        async function editDataAuth(url){
            const response = await fetch(url);
            const data = await response.json();
            return data;
        };

        editDataAuth("/api/user/auth")
        .then(data => {

            if(data.error && data.message == "forbidden"){
                location.href = "/signin";

                // Remove loading effect
                topbar.hide();
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

                    // Remove loading effect
                    topbar.hide();
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

                        // Remove loading effect
                        topbar.hide();
                    }
                    else{
                        $("#edit7").css("display", "none");

                        // Remove loading effect
                        topbar.hide();
                    };
                };
            };

        })
        .catch(error => {
            console.log("Error(drama-getEachDramaData.js - ): " + error);
        });

    });

};