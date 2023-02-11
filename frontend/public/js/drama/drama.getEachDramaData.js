export default function getEachDramaData(){

    // Add loading effect
    topbar.show();

    // Global variable for the drama content to be edited.
    let contentToBeEdit = null;
    let episodeToBeEdit = "";
    let originalEpisodeContent = "";
    let actorToBeEdit = "";
    let originalActorContent = "";
    let dramaVideoTitle = null;

    const dramaID = location.href.split("/").pop();

    async function getData(url){
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    getData(`/api/drama/${dramaID}`)
    .then(data => {
        if(data.error == true && data.message == "ID not found"){
            location.href = "/";

            // Remove loading effect
            topbar.hide();
        };

        if(data.data){
            const dramaData = data.data.drama;

            // Cover photo
            const colorData = data.data; // Get drama photo dominant color

            $("#dramaCoverPhoto").attr("src", dramaData.dramaCoverPhoto);
            $("#transparentLayer").css("background-color", colorData.dominantColor);
            $("#dramaBannerBackgroundPhoto").css("background-image", `url("${dramaData.dramaCoverPhoto}")`);
            (colorData.isDark) ? $("#dramaDetailsFontColor").css("color", "#fff") : $("#dramaDetailsFontColor").css("color", "#000");

            // Title
            const yearOfDrama = ` (${dramaData.dramaDateOfBoardcast.split("-")[0]})`;

            $("#dramaTitle").text(dramaData.dramaTitle + yearOfDrama);

            // Category
            dramaData.dramaCategory.map((result, index) => {
                $("#dramaCategory").append(result);
                if(index !== dramaData.dramaCategory.length - 1){
                    $("#dramaCategory").append("、");
                };
            });

            // Introduction
            if(dramaData.dramaIntroduction == "None"){
                $("#dramaIntroduction").text("暫無概要");
            }
            else{
                const threshold = 65; // Max no. of wording for introduction
                let string = dramaData.dramaIntroduction;
                
                if(string.length > threshold){
                    string = string.substring(0, threshold) + "…";
                    $("#dramaIntroduction").text(string);
                }
                else{
                    $("#dramaIntroduction").text(string);
                };
            };

            // TV station
            $("#dramaTV").text(dramaData.dramaTV);

            // First episode date of broadcast
            $("#dramaDateOfBoardcast").text(`${dramaData.dramaDateOfBoardcast}`);

            // Week of broadcast
            $("#dramaWeek").text(`${dramaData.dramaWeek}`);

            // Time of broadcast
            $("#dramaTimeOfBoardcast").text(dramaData.dramaTimeOfBoardcast.split("~")[0]);

            // Episode (Japanese Source)
            if(dramaData.dramaDownloadJp.length == 0){
                $("#dramaDownloadJp").append(`
                    <div class="drama-episode-title" align="center">
                        <span class="drama-no-source">暫無來源</span>
                    </div>
                `);
            }
            else{
                for(let i = dramaData.dramaDownloadJp.length - 1; i >= 0; i --){
                    const episode = dramaData.dramaDownloadJp.length - i;
    
                    $("#dramaDownloadJp").append(`
                        <div class="drama-episode-title">
                            <span class="video-btn-jp" id="videoBtn${episode}" titleChi="${dramaData.dramaDownloadJp[i].downloadTitleChi}" titleJp="${dramaData.dramaDownloadJp[i].downloadTitleJp}" link="${dramaData.dramaDownloadJp[i].downloadLink}">第${episode}話</span>
                        </div>
                    `);
                };
            };

            // Episode (Chinese Source)
            if(dramaData.dramaDownloadChi.length == 0){
                $("#dramaDownloadChi").append(`
                    <div class="drama-episode-title" align="center">
                        <span class="drama-no-source">暫無來源</span>
                    </div>
                `);
            }
            else{
                for(let i = dramaData.dramaDownloadChi.length - 1; i >= 0; i --){
                    const episode = dramaData.dramaDownloadChi.length - i;
    
                    $("#dramaDownloadChi").append(`
                        <div class="drama-episode-title">
                            <span class="video-btn-chi" id="videoBtn${episode}" titleChi="${dramaData.dramaDownloadChi[i].downloadTitleChi}" titleJSF="${dramaData.dramaDownloadChi[i].downloadTitleJSF}" link="${dramaData.dramaDownloadChi[i].downloadLink}">第${episode}話</span>
                        </div>
                    `);
                };
            };

            // Episode (User Upload Source)
            try{
                if(dramaData.dramaVideo.length == 0 || dramaData.dramaVideo == "None"){
                    $("#dramaDownloadUpload").append(`
                        <div class="drama-episode-title" align="center">
                            <span class="drama-no-source">暫無來源</span>
                        </div>
                    `);
                }
                else{
                    for(let i = 0; i < dramaData.dramaVideo.length; i ++){
                        const episode = i + 1;

                        dramaVideoTitle = dramaData.dramaTitle;

                        if(i !== dramaData.dramaVideo.length - 1){
                            episodeToBeEdit = episodeToBeEdit + dramaData.dramaVideo[i] + ", ";
                        }
                        else{
                            episodeToBeEdit = episodeToBeEdit + dramaData.dramaVideo[i];
                        };

                        // episodeToBeEdit = episodeToBeEdit + dramaData.dramaVideo[i] + ", ";
        
                        // episodeToBeEdit.push(dramaData.dramaVideo[i]);

                        $("#dramaDownloadUpload").append(`
                            <div class="drama-episode-title">
                                <span class="video-btn-user" id="videoBtn${episode}" titleChi="${dramaData.dramaTitle}" titleEpisode="第${episode}話" link="${dramaData.dramaVideo[i]}">第${episode}話</span>
                            </div>
                        `);

                        originalEpisodeContent += `<div class="drama-episode-title"><span class="video-btn-user" id="videoBtn${episode}" titleChi="${dramaData.dramaTitle}" titleEpisode="第${episode}話" link="${dramaData.dramaVideo[i]}">第${episode}話</span></div>`
                    };
                    $("#dramaDownloadUploadTab").css("display", "block");
                };
            }
            catch(error){null};

            // Episode Tap Bar and Button Color
            (colorData.isDark) ? $(".video-btn-jp").css("color", "#fff") : $(".video-btn-jp").css("color", "#000");
            (colorData.isDark) ? $(".video-btn-chi").css("color", "#fff") : $(".video-btn-chi").css("color", "#000");
            (colorData.isDark) ? $(".video-btn-user").css("color", "#fff") : $(".video-btn-user").css("color", "#000");
            (colorData.isDark) ? $(".drama-no-source").css("color", "#fff") : $(".drama-no-source").css("color", "#000");
            (colorData.isDark) ? $(".nav-link").css("color", "#fff") : $(".nav-link").css("color", "#000");
            
            // Drama Video
            let currentTime = 0;
            const preventContextMenu = function(event){
                event.preventDefault();
            };

            // Handle Button Click (Japanese Source)
            $("span.video-btn-jp").click((e) => {

                // Add loading effect
                topbar.show();

                async function watchVideoAuth(url){
                    const response = await fetch(url);
                    const data = await response.json();
                    return data;
                };

                watchVideoAuth("/api/video/auth")
                .then(data => {
                    // Watch drama function is only available for user account logged in.
                    if(data.error && data.message == "forbidden"){
                        location.href = "/signin";

                        // Remove loading effect
                        topbar.hide();
                    };

                    // Watch drama function is only available for testing account.
                    if(data.error && data.message == "restricted to test account at this stage only"){
                        alert("抱歉，觀看劇集功能暫時只提供給以下測試帳戶作為測試用途:\n\n測試帳戶: test@test.com\n\n測試密碼: 12345678");

                        // Remove loading effect
                        topbar.hide();
                    };

                    if(data.ok){
                        // Add the drama video link to the HLS.js
                        if(Hls.isSupported()){
                            const video = $("video").get(0);
                            const hls = new Hls();
                            hls.loadSource(e.target.attributes.link.value);
                            hls.attachMedia(video);
                            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                                video.pause();
                                // Add the drama video title to the video navigation bar.
                                $("#videoTitle").text(e.target.attributes.titleChi.value + " / " + e.target.attributes.titleJp.value);

                                // Display the drama video player.
                                $("#videoContainer").css("display", "block");

                                // Record the video playing time before hide.
                                $("#video").prop("currentTime", currentTime);

                                // Disable the scrolling function.
                                $("body").css("overflow", "hidden");

                                // Disable mouse right-click function.
                                $(document).on("contextmenu", preventContextMenu);

                                // Remove loading effect
                                topbar.hide();
                            });
                        };
                    };
                })
                .catch(error => {
                    console.log("Error(drama.getEachDramaData.js - 1): " + error);

                    // Remove loading effect
                    topbar.hide();
                });

            });

            // Handle Button Click (Chinese Source)
            $("span.video-btn-chi").click((e) => {

                // Add loading effect
                topbar.show();

                async function watchVideoAuth(url){
                    const response = await fetch(url);
                    const data = await response.json();
                    return data;
                };

                watchVideoAuth("/api/video/auth")
                .then(data => {
                    // Watch drama function is only available for user account logged in.
                    if(data.error && data.message == "forbidden"){
                        location.href = "/signin";

                        // Remove loading effect
                        topbar.hide();
                    };

                    // Watch drama function is only available for testing account.
                    if(data.error && data.message == "restricted to test account at this stage only"){
                        alert("抱歉，觀看劇集功能暫時只提供給以下測試帳戶作為測試用途:\n\n測試帳戶: test@test.com\n\n測試密碼: 12345678");

                        // Remove loading effect
                        topbar.hide();
                    };

                    if(data.ok){
                        // Add the drama video link to the HLS.js
                        if(Hls.isSupported()){
                            const video = $("video").get(0);
                            const hls = new Hls();
                            hls.loadSource("/api/proxy?url=" + e.target.attributes.link.value);
                            hls.attachMedia(video);
                            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                                video.pause();
                                // Add the drama video title to the video navigation bar.
                                $("#videoTitle").text(e.target.attributes.titleJSF.value);
        
                                // Display the drama video player.
                                $("#videoContainer").css("display", "block");
        
                                // Record the video playing time before hide.
                                $("#video").prop("currentTime", currentTime);
        
                                // Disable the scrolling function.
                                $("body").css("overflow", "hidden");
        
                                // Disable mouse right-click function.
                                $(document).on("contextmenu", preventContextMenu);

                                // Remove loading effect
                                topbar.hide();
                            });
                        };
                    };
                })
                .catch(error => {
                    console.log("Error(drama.getEachDramaData.js - 2): " + error);

                    // Remove loading effect
                    topbar.hide();
                });

            });

            // Handle Button Click (User Upload Source)
            $("span.video-btn-user").click((e) => {

                // Add loading effect
                topbar.show();

                async function watchVideoAuth(url){
                    const response = await fetch(url);
                    const data = await response.json();
                    return data;
                };

                watchVideoAuth("/api/video/auth")
                .then(data => {
                    // Watch drama function is only available for user account logged in.
                    if(data.error && data.message == "forbidden"){
                        location.href = "/signin";

                        // Remove loading effect
                        topbar.hide();
                    };

                    // Watch drama function is only available for testing account.
                    if(data.error && data.message == "restricted to test account at this stage only"){
                        alert("抱歉，觀看劇集功能暫時只提供給以下測試帳戶作為測試用途:\n\n測試帳戶: test@test.com\n\n測試密碼: 12345678");

                        // Remove loading effect
                        topbar.hide();
                    };

                    if(data.ok){
                        // Add loading effect
                        topbar.show();

                        // Add the video link to the html DOM.
                        $("#video").attr("src", "/api/video?link=" + e.target.attributes.link.value) // "http://140.238.54.62:3000/server?link="  "/api/video?link="

                        // Add the drama video title to the video navigation bar.
                        $("#videoTitle").text(e.target.attributes.titleChi.value + " - " + e.target.attributes.titleEpisode.value);

                        // Display the drama video player.
                        $("#videoContainer").css("display", "block");

                        // Record the video playing time before hide.
                        $("#video").prop("currentTime", currentTime);

                        // Disable the scrolling function.
                        $("body").css("overflow", "hidden");

                        // Disable mouse right-click function.
                        $(document).on("contextmenu", preventContextMenu);

                        // Remove loading effect
                        topbar.hide();
                    };
                })
                .catch(error => {
                    console.log("Error(drama.getEachDramaData.js - 2): " + error);

                    // Remove loading effect
                    topbar.hide();
                });

            });

            // Video Close Button.
            $("#videoCloseBtn").click(() => {
                // Record the current video playing time before close.
                currentTime = $("#video").prop("currentTime");

                // Pause the video before close.
                $("#video").trigger("pause");

                // Close the video player.
                $("#videoContainer").css("display", "none");

                // Enable the scrolling function.
                $("body").css("overflow", "auto");

                // Enable mouse right-click function.
                $(document).off("contextmenu", preventContextMenu);
            });

            // Cast
            const dramaCastData = data.data.drama;

            // If no cast data
            if(dramaCastData.dramaActor == "None" || dramaCastData.dramaActor == "" || dramaCastData.dramaActor == []){
                $("#castContainer").append(`<div style="font-size:20px;">暫無演員資料</div>`);

                originalActorContent = `<div style="font-size:20px;">暫無演員資料</div>`;
                actorToBeEdit = "暫無演員資料";
            };

            // If cast data is recorded
            let maxNumOfCastPerPage = dramaCastData.dramaActor.length;
    
            for(let i = 0; i < maxNumOfCastPerPage; i ++){
                try{
                    const actorPhoto = dramaCastData.dramaActor[i][0].actorPhoto;
                    const castName = dramaCastData.dramaCast[i].split("/")[0].split("(")[0].split("（")[0];
                    const actorName = dramaCastData.dramaCast[i].split("/").pop();
    
                    $("#castContainer").append(`
                        <div class="cast">
                            <img class="cast-photo" src="${actorPhoto}">
                            <div class="cast-actor">
                                <div class="cast-actor-name">${actorName}</div>
                                <div class="cast-cast-name">${castName}</div>
                            </div>
                        </div>
                    `);

                    if(i !== maxNumOfCastPerPage - 1){
                        actorToBeEdit = actorToBeEdit + actorName.trim() + " / " + castName.trim() + ", ";
                    }
                    else{
                        actorToBeEdit = actorToBeEdit + actorName.trim() + " / " + castName.trim();
                    };

                    originalActorContent +=
                        `<div class="cast">
                            <img class="cast-photo" src="${actorPhoto}">
                            <div class="cast-actor">
                                <div class="cast-actor-name">${actorName}</div>
                                <div class="cast-cast-name">${castName}</div>
                            </div>
                        </div>`
                }
                catch(error){
                    // console.log("Error(drama.getActorData.js - 1): " + error);
                    null
                };


                // if(i !== dramaData.dramaVideo.length - 1){
                //     episodeToBeEdit = episodeToBeEdit + dramaData.dramaVideo[i] + ", ";
                // }
                // else{
                //     episodeToBeEdit = episodeToBeEdit + dramaData.dramaVideo[i];
                // };

            };

            // Drama rating
            if(data.data.drama.dramaRating == "None"){
                $("#dramaRating").append(`<div style="text-align:center; font-size:20px;">暫無收視率資料</div>`);
                $("#myChart").remove();
            }
            else{
                const rating = data.data.drama.dramaRating;
                const maxRating = parseInt(Math.max(...rating));
                const maxRatingisDivisible = (maxRating % 2 === 0) ? maxRating + 6 : maxRating + 5; // Maximum ceiling in y-axis
                const sum = rating.reduce((acc, val) => acc + parseFloat(val), 0);
                const avgRating = (sum / rating.length).toFixed(1);
                const episode = [];
    
                for(let i = 0; i < rating.length; i ++){
                    episode.push(`第${i + 1}話`);
                };
    
                // Callback function
                ratingData(rating, maxRatingisDivisible, avgRating, episode);
            };

            // Media information
            if(dramaData.dramaMedia == "None"){
                $("#dramaMedia").append(`
                    <div style="font-size:20px;">暫無媒體資訊</div>
                `);
            }
            else{
                $("#dramaMedia").append(`
                    <iframe class="media-video" src="${dramaData.dramaMedia}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                `);
            };

            // Show content
            $("#dramaContentContainer").css("visibility", "visible");

            // Remove loading effect
            topbar.hide();
        };
    })
    .catch(error => {
        console.log("Error(drama.getEachDramaData.js - 3): " + error);
        
        // Remove loading effect
        topbar.hide();
    });


    // Handle drama edit button click.

    // Display all the drama edit buttons and hide edit button itself.
    $("#dramaEditBtn").click(() => {

        if($("img.individual-edit-btn").css("display") == "block"){
                $("img.individual-edit-btn").css("display", "none");

                // Clear the photo upload function.
                $("#editDramaCoverPhotoLabel").attr("for", "");

                // Clear the cursor.
                $("#dramaCoverPhoto").css("cursor", "");
            
                // Clear the CSS hover effect.
                $("#dramaCoverPhoto").off("mouseenter mouseleave");

                $("#home-tab").click();
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
            }
            else{
                $("#edit7").css("display", "none");
            };
        };



    });

    // Handle individual drama edit button click.
    $("img.individual-edit-btn").click((e) => {

        const individualBtnID = e.target.attributes.id.value;

        // Store the value to be updated.
        contentToBeEdit = $(`div.drama-details-content-${individualBtnID}`).text().trim();

        // $(`editDramaContent-${e.target.attributes.id.value}`).text("");

        // Hide the drama edit button.
        $("#dramaEditBtn").css("display", "none");

        // Display the yes/no button.
        $(`img.confirm-btn-${individualBtnID}`).css("display", "block");

        // Hide the edit button.
        $("img.individual-edit-btn").css("display", "none");

        // Clear the content to be updated before HTML DOM.
        $(`div.drama-details-content-${individualBtnID}`).text("");

        // Check whether the click button is edit video link button.
        if(individualBtnID != "edit7" && individualBtnID != "edit8"){
            // Change the content to be updated to "edit mode" (e.g. input / textarea tag - depends on the length of content) before HTML DOM.
            if(contentToBeEdit.length > 10){
                $(`div.drama-details-content-${individualBtnID}`).append(`
                    <textarea id="editDramaContent-${individualBtnID}" class="edit-drama-content">${contentToBeEdit}</textarea>
                `);

                // contentToBeEdit = $(`textarea#editDramaContent-${e.target.attributes.id.value}`).text()
            }
            else{
                $(`div.drama-details-content-${individualBtnID}`).append(`
                    <input id="editDramaContent-${individualBtnID}" class="edit-drama-content" value=${contentToBeEdit}></input>
                `);

                // contentToBeEdit = $(`input#editDramaContent-${e.target.attributes.id.value}`).val()
            };
        };

        if(individualBtnID == "edit7"){
            // console.log(episodeToBeEdit)
            // let list = "";
            // for(let i of episodeToBeEdit){
            //     list = list + i + ", "
            // };
            // const finalList = (list)

            $(`div.drama-details-content-${individualBtnID}`).append(`
                <textarea id="editDramaContent-${individualBtnID}" class="edit-drama-content">${episodeToBeEdit}</textarea>
            `);
        };

        if(individualBtnID == "edit8"){
            $(`div.drama-details-content-${individualBtnID}`).append(`
                <textarea id="editDramaContent-${individualBtnID}" class="edit-drama-content">${actorToBeEdit}</textarea>
            `);
        };

    });

    // Handle "no" button click.
    $("img#confirmNo").click((e) => {

        const confirmNoBtnID = e.target.attributes.name.value;

        // Hide the yes/no button.
        $(`img.confirm-btn-${confirmNoBtnID}`).css("display", "none");

        // Clear the content to be updated before HTML DOM.
        $(`div.drama-details-content-${confirmNoBtnID}`).text("");

        // Show the drama edit button.
        $("#dramaEditBtn").css("display", "block");

        // Clear the photo upload function.
        $("#editDramaCoverPhotoLabel").attr("for", "");

        // Clear the cursor.
        $("#dramaCoverPhoto").css("cursor", "");
    
        // Clear the CSS hover effect.
        $("#dramaCoverPhoto").off("mouseenter mouseleave");

        // Check whether the click button is edit video link button, and restore the content to the original one.
        if(confirmNoBtnID != "edit7" && confirmNoBtnID != "edit8"){
            $(`div.drama-details-content-${confirmNoBtnID}`).text(`${contentToBeEdit}`);
        };

        if(confirmNoBtnID == "edit7"){
            // $("#dramaDownloadUpload").text("");

            // Add HTML DOM to the original content.
            $("#dramaDownloadUpload").append(`${originalEpisodeContent}`);

            // handle each episode button click.
            function handleBtnClickAfterDOM(){

                // $("#dramaDownloadUpload").text("");

                // $("#dramaDownloadUpload").append(`${originalEpisodeContent}`);
    
                // Drama Video
                let currentTime = 0;
                const preventContextMenu = function(event){
                    event.preventDefault();
                };
    
                // Handle Button Click (User Upload Source)
                $("span.video-btn-user").click((e) => {
    
                    // Add loading effect
                    topbar.show();
    
                    async function watchVideoAuth(url){
                        const response = await fetch(url);
                        const data = await response.json();
                        return data;
                    };
    
                    watchVideoAuth("/api/video/auth")
                    .then(data => {
                        // Watch drama function is only available for user account logged in.
                        if(data.error && data.message == "forbidden"){
                            location.href = "/signin";
    
                            // Remove loading effect
                            topbar.hide();
                        };
    
                        // Watch drama function is only available for testing account.
                        if(data.error && data.message == "restricted to test account at this stage only"){
                            alert("抱歉，觀看劇集功能暫時只提供給以下測試帳戶作為測試用途:\n\n測試帳戶: test@test.com\n\n測試密碼: 12345678");
    
                            // Remove loading effect
                            topbar.hide();
                        };
    
                        if(data.ok){
                            // Add loading effect
                            topbar.show();
    
                            // Add the video link to the html DOM.
                            $("#video").attr("src", "/api/video?link=" + e.target.attributes.link.value) // "http://140.238.54.62:3000/server?link="
    
                            // Add the drama video title to the video navigation bar.
                            $("#videoTitle").text(e.target.attributes.titleChi.value + " - " + e.target.attributes.titleEpisode.value);
    
                            // Display the drama video player.
                            $("#videoContainer").css("display", "block");
    
                            // Record the video playing time before hide.
                            $("#video").prop("currentTime", currentTime);
    
                            // Disable the scrolling function.
                            $("body").css("overflow", "hidden");
    
                            // Disable mouse right-click function.
                            $(document).on("contextmenu", preventContextMenu);
    
                            // Remove loading effect
                            topbar.hide();
                        };
                    })
                    .catch(error => {
                        console.log("Error(drama.getEachDramaData.js - 2): " + error);
    
                        // Remove loading effect
                        topbar.hide();
                    });
    
                });
                
            };
            handleBtnClickAfterDOM();
        };

        if(confirmNoBtnID == "edit8"){
            // Add HTML DOM to the original content.
            $("#castContainer").append(`${originalActorContent}`);
        };

    });

    // Handle "yes" button click.
    $("img#confirmYes").click((e) => {
        // Add loading effect
        topbar.show();

        // console.log($("#editDramaContent-edit7").val())

        let editDramaContent = null;
        const confirmYesBtnID = e.target.attributes.name.value;
        const updateIndicator = confirmYesBtnID;
        const editDramaID = location.href.split("/").pop();

        if(confirmYesBtnID != "edit7" || confirmYesBtnID != "edit8"){
            if(contentToBeEdit.length > 10){
                editDramaContent = $(`textarea#editDramaContent-${confirmYesBtnID}`).val();
            }
            else{
                editDramaContent = $(`input#editDramaContent-${confirmYesBtnID}`).val();
            };
        };
        
        if(confirmYesBtnID == "edit7"){
            editDramaContent = $(`textarea#editDramaContent-edit7`).val();
        };

        if(confirmYesBtnID == "edit8"){
            editDramaContent = $(`textarea#editDramaContent-edit8`).val();
        };
        
        async function addEditdata(url, method){
            const response = await fetch(url, method);
            const data = await response.json();
            return data;
        };

        addEditdata(`/api/edit/${editDramaID}`, {
            method: "PUT",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({
                editDramaContent: editDramaContent,
                updateIndicator: updateIndicator
            })
        })
        .then(data => {
            if(data.data){
                let updatedDramaContent = data.data;

                $(`div.drama-details-content-${confirmYesBtnID}`).text("");
                $(`img.confirm-btn-${e.target.attributes.name.value}`).css("display", "none");
                $("#dramaEditBtn").css("display", "block");
                $("#editDramaCoverPhotoLabel").attr("for", "");
                $("#dramaCoverPhoto").css("cursor", "");
                $("#dramaCoverPhoto").off("mouseenter mouseleave");

                if(confirmYesBtnID != "edit7" && confirmYesBtnID != "edit8"){
                    const threshold = 65;
                    
                    if(updatedDramaContent.length > threshold){
                        updatedDramaContent = updatedDramaContent.substring(0, threshold) + "…";
                        $(`div.drama-details-content-${confirmYesBtnID}`).text(updatedDramaContent);
                        $(`img.confirm-btn-${confirmYesBtnID}`).css("display", "none");
                        $("#dramaEditBtn").css("display", "block");
                        $("#editDramaCoverPhotoLabel").attr("for", "");
                        $("#dramaCoverPhoto").css("cursor", "");
                        $("#dramaCoverPhoto").off("mouseenter mouseleave");
                    }
                    else{
                        $(`div.drama-details-content-${confirmYesBtnID}`).text(updatedDramaContent);
                        $(`img.confirm-btn-${confirmYesBtnID}`).css("display", "none");
                        $("#dramaEditBtn").css("display", "block");
                        $("#editDramaCoverPhotoLabel").attr("for", "");
                        $("#dramaCoverPhoto").css("cursor", "");
                        $("#dramaCoverPhoto").off("mouseenter mouseleave");
                    };

                    // Remove loading effect
                    topbar.hide();
                };

                if(confirmYesBtnID == "edit7"){
                    // ## Clear the content before adding the new video content.
                    originalEpisodeContent = "";

                    for(let i = 0; i < updatedDramaContent.length; i ++){
                        const episode = i + 1;

                        $("#dramaDownloadUpload").append(`
                            <div class="drama-episode-title">
                                <span class="video-btn-user" id="videoBtn${episode}" titleChi="${dramaVideoTitle}" titleEpisode="第${episode}話" link="${updatedDramaContent[i]}">第${episode}話</span>
                            </div>
                        `);
                        
                        originalEpisodeContent += `<div class="drama-episode-title"><span class="video-btn-user" id="videoBtn${episode}" titleChi="${dramaVideoTitle}" titleEpisode="第${episode}話" link="${updatedDramaContent[i]}">第${episode}話</span></div>`;
                    };

                    // After update the video list, restore the textarea content to the latest content one.
                    let updatedTextarea = "";

                    for(let i = 0; i < updatedDramaContent.length; i ++){
                        if(i !== updatedDramaContent.length - 1){
                            updatedTextarea = updatedTextarea + updatedDramaContent[i] + ", ";
                        }
                        else{
                            updatedTextarea = updatedTextarea + updatedDramaContent[i];
                        };
                    };

                    episodeToBeEdit = updatedTextarea;

                    function handleBtnClickAfterDOM(){

                        // Drama Video
                        let currentTime = 0;
                        const preventContextMenu = function(event){
                            event.preventDefault();
                        };
            
                        // Handle Button Click (User Upload Source)
                        $("span.video-btn-user").click((e) => {
            
                            // Add loading effect
                            topbar.show();
            
                            async function watchVideoAuth(url){
                                const response = await fetch(url);
                                const data = await response.json();
                                return data;
                            };
            
                            watchVideoAuth("/api/video/auth")
                            .then(data => {
                                // Watch drama function is only available for user account logged in.
                                if(data.error && data.message == "forbidden"){
                                    location.href = "/signin";
            
                                    // Remove loading effect
                                    topbar.hide();
                                };
            
                                // Watch drama function is only available for testing account.
                                if(data.error && data.message == "restricted to test account at this stage only"){
                                    alert("抱歉，觀看劇集功能暫時只提供給以下測試帳戶作為測試用途:\n\n測試帳戶: test@test.com\n\n測試密碼: 12345678");
            
                                    // Remove loading effect
                                    topbar.hide();
                                };
            
                                if(data.ok){
                                    // Add loading effect
                                    topbar.show();
            
                                    // Add the video link to the html DOM.
                                    $("#video").attr("src", "/api/video?link=" + e.target.attributes.link.value) // "http://140.238.54.62:3000/server?link="
            
                                    // Add the drama video title to the video navigation bar.
                                    $("#videoTitle").text(e.target.attributes.titleChi.value + " - " + e.target.attributes.titleEpisode.value);
            
                                    // Display the drama video player.
                                    $("#videoContainer").css("display", "block");
            
                                    // Record the video playing time before hide.
                                    $("#video").prop("currentTime", currentTime);
            
                                    // Disable the scrolling function.
                                    $("body").css("overflow", "hidden");
            
                                    // Disable mouse right-click function.
                                    $(document).on("contextmenu", preventContextMenu);
            
                                    // Remove loading effect
                                    topbar.hide();
                                };
                            })
                            .catch(error => {
                                console.log("Error(drama.getEachDramaData.js - 2): " + error);
            
                                // Remove loading effect
                                topbar.hide();
                            });
            
                        });
                        
                    };
                    handleBtnClickAfterDOM();

                    // Remove loading effect
                    topbar.hide();
                };

                if(confirmYesBtnID == "edit8"){
                    // console.log(data.data.dramaActor)
                    // console.log(data.data.dramaCast)
                    // console.log(data.dramaCast)

                    // ## Clear the content before adding the new cast content.
                    originalActorContent = "";

                    // If cast data is recorded
                    let maxNumOfCastPerPage = data.data.dramaCast.length;
            
                    for(let i = 0; i < maxNumOfCastPerPage; i ++){
                        
                        const actorPhoto = data.data.dramaActor[i][0].actorPhoto;
                        const castName = data.data.dramaCast[i].split("/")[0];
                        const actorName = data.data.dramaCast[i].split("/").pop();

                        $("#castContainer").append(`
                            <div class="cast">
                                <img class="cast-photo" src="${actorPhoto}">
                                <div class="cast-actor">
                                    <div class="cast-actor-name">${actorName}</div>
                                    <div class="cast-cast-name">${castName}</div>
                                </div>
                            </div>
                        `);

                        originalActorContent +=
                        `<div class="cast">
                            <img class="cast-photo" src="${actorPhoto}">
                                <div class="cast-actor"><div class="cast-actor-name">${actorName}</div>
                                <div class="cast-cast-name">${castName}</div>
                            </div>
                        </div>`

                    };

                    // After update the video list, restore the textarea content to the latest content one.
                    let updatedTextarea = "";

                    for(let i = 0; i < maxNumOfCastPerPage; i ++){

                        const castName = data.data.dramaCast[i].split("/")[0];
                        const actorName = data.data.dramaCast[i].split("/").pop();

                        if(i !== maxNumOfCastPerPage - 1){
                            updatedTextarea = updatedTextarea + actorName.trim() + " / " + castName.trim() + ", ";
                        }
                        else{
                            updatedTextarea = updatedTextarea + actorName.trim() + " / " + castName.trim();
                        };

                    };

                    actorToBeEdit = updatedTextarea;

                    // Remove loading effect
                    topbar.hide();

                };
            };
        })
        .catch(error => {
            console.log("Error(drama.getEachDramaData.js - ): " + error);

            // Remove loading effect
            topbar.hide();
        });
    })


    // if(tempValue.length > 10){
    //     $(`div.drama-details-brief-${e.target.attributes.id.value}`).append(`
    //         <textarea id="editDramaIntroduction" class="edit-drama-introduction">${tempValue}</textarea>
    //     `);
    // }
    // else{
    //     $(`div.drama-details-brief-${e.target.attributes.id.value}`).append(`
    //         <input id="editDramaIntroduction2" class="edit-drama-introduction" value="${tempValue}"></input>
    //     `);
    // };


    // $("#dramaEditBtn").click(() => {

    //     $("#dramaIntroduction").text("");
    //     $("#dramaIntroduction").append(`
    //         <textarea id="editDramaIntroduction" class="edit-drama-introduction">${string}</textarea>
    //     `);

    // });


    // const editDramaID = location.href.split("/").pop();

    // $("#confirmBtn").click(() => {
    //     // console.log($("#editDramaIntroduction").val())
    //     const editDramaIntroduction = $("#editDramaIntroduction").val();

    //     fetch(`/api/edit/${editDramaID}`, {
    //         method: "PUT",
    //         headers: {"Content-type": "application/json"},
    //         body: JSON.stringify({
    //             editDramaIntroduction: editDramaIntroduction
    //         })
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         $("#dramaIntroduction").text("");

    //         const threshold = 65; // Max no. of wording for introduction
    //         let updatedDramaIntroduction = data.data;
            
    //         if(updatedDramaIntroduction.length > threshold){
    //             updatedDramaIntroduction = updatedDramaIntroduction.substring(0, threshold) + "…";
    //             $("#dramaIntroduction").text(updatedDramaIntroduction);
    //         }
    //         else{
    //             $("#dramaIntroduction").text(updatedDramaIntroduction);
    //         };

    //         string = updatedDramaIntroduction;
    //     })

    // })


    // Drama rating chart setting
    function ratingData(cbRating, cbmaxRatingisDivisible, cbAvgRating, cbEpisode){

        // Get the context of the canvas element we want to select
        const ctx = document.getElementById("myChart").getContext("2d");

        // Data for the chart
        const data = {
            labels: cbEpisode, // ["第一週", "第二週", "第三週", "第四週", "第五週"]
            datasets: [{
                label: "收視率",
                data: cbRating, // [10.5, 7.9, 5.2, 8.1, 6.7]
                backgroundColor: "rgba(135,206,235,0.6)",
                borderColor: "dodgerblue",
                borderWidth: 1
            }]
        };

        // Configuration for the chart
        const options = {
            annotation: {
                annotations: [{
                    type: "line",
                    mode: "horizontal",
                    scaleID: "y-axis-0",
                    value: cbAvgRating,
                    borderColor: "rgba(255, 99, 132, 0.7)",
                    borderWidth: 2,
                    label: {
                        content: `平均: ${cbAvgRating}%`,
                        enabled: true,
                        position: "top"
                    }
                }]
            },        
            responsive: true,
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 16
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 16,
                        stepSize: 2,
                        max: cbmaxRatingisDivisible,
                        callback: function(value, index, values) {
                            if(value !== 0) {
                                return value + "%";
                            };
                        }
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return data.datasets[tooltipItem.datasetIndex].label + ": " + tooltipItem.yLabel + "%";
                    }
                }
            },
            legend: {
                display: false
            },
            plugins: {
                datalabels: {
                    align: "end",
                    anchor: "end",
                    display: false,
                    font: {
                        size: 16
                    },
                    formatter: function(value) {
                        return value + "%";
                    }
                }
            }
        };

        // Create the chart
        let chart = new Chart(ctx, {
            type: "line",
            data: data,
            options: options
        });


        if(window.innerWidth < 600){
            options.scales.yAxes[0].ticks.display = false;
            options.scales.xAxes[0].ticks.fontSize = 15;
            options.plugins.datalabels.font.size = 15;
            chart.destroy();
            chart = new Chart(ctx,{
                type: "line",
                data: data,
                options: options
            });
        };

    };

};