import ratingData from "./drama.ratingData.js";
import dramaEditBtn from "./drama.editBtn.js";

export default function getEachDramaData(){

    // Global variable for the drama content to be edited.
    let contentToBeEdit = null;
    let episodeToBeEdit = "";
    let originalEpisodeContent = "";
    let actorToBeEdit = "";
    let ratingToBeEdit = "";
    let originalActorContent = "";
    let originalRatingContent = "";
    let originalRating = "";
    let originalRatingMax = "";
    let originalRatingAvg = "";
    let originalRatingEpisode = "";
    let originalMediaContent = "";
    let mediaToBeEdit = "";
    let dramaVideoTitle = null;

    const model = {

        init: function(){

            // Add loading effect
            topbar.show();

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
                    function coverPhotoFunc(){
                        const colorData = data.data; // Get drama photo dominant color
                        $("#dramaCoverPhoto").attr("src", dramaData.dramaCoverPhoto);
                        $("#transparentLayer").css("background-color", colorData.dominantColor);
                        $("#dramaBannerBackgroundPhoto").css("background-image", `url("${dramaData.dramaCoverPhoto}")`);
                        (colorData.isDark) ? $("#dramaDetailsFontColor").css("color", "#fff") : $("#dramaDetailsFontColor").css("color", "#000");    
                        
                        return colorData;
                    };
                    const colorData = coverPhotoFunc();

                    // Title
                    function titleFunc(){
                        const yearOfDrama = ` (${dramaData.dramaDateOfBoardcast.split("-")[0]})`;
                        $("#dramaTitle").text(dramaData.dramaTitle + yearOfDrama);
                        $("#discussCreatePostHeader").text(`發表討論 (${dramaData.dramaTitle})`);
                    };
                    titleFunc();

                    // Category
                    function categoryFunc(){
                        dramaData.dramaCategory.map((result, index) => {
                            $("#dramaCategory").append(result);
                            if(index !== dramaData.dramaCategory.length - 1){
                                $("#dramaCategory").append("、");
                            };
                        });
                    };
                    categoryFunc();

                    // Introduction
                    function introductionFunc(){
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
                    };
                    introductionFunc();

                    // TV station
                    function tvInformationFunc(){
                        $("#dramaTV").text(dramaData.dramaTV);
                        $("#dramaDateOfBoardcast").text(`${dramaData.dramaDateOfBoardcast}`);
                        $("#dramaWeek").text(`${dramaData.dramaWeek}`);
                        $("#dramaTimeOfBoardcast").text(dramaData.dramaTimeOfBoardcast.split("~")[0]);
                    };
                    tvInformationFunc();

                    // Episode
                    function episodeFunc(){
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
                    };
                    episodeFunc();
                    
                    // Drama Video
                    function dramaVideo(){
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
                                            $("#videoTitle").text(e.target.attributes.titleChi.value + " / " + e.target.attributes.titleJp.value);
                                            $("#videoContainer").css("display", "block");
                                            $("#video").prop("currentTime", currentTime);
                                            $("body").css("overflow", "hidden");
                                            $(document).on("contextmenu", preventContextMenu);
            
                                            topbar.hide();
                                        });
                                    };
                                };
                            })
                            .catch(error => {
                                console.log("Error(drama.getEachDramaData.js - 1): " + error);
            
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
            
                                    topbar.hide();
                                };
            
                                // Watch drama function is only available for testing account.
                                if(data.error && data.message == "restricted to test account at this stage only"){
                                    alert("抱歉，觀看劇集功能暫時只提供給以下測試帳戶作為測試用途:\n\n測試帳戶: test@test.com\n\n測試密碼: 12345678");
            
                                    topbar.hide();
                                };
            
                                if(data.ok){
                                    // Add the drama video link to the HLS.js
                                    if(Hls.isSupported()){
                                        const video = $("video").get(0);
                                        const hls = new Hls();
                                        hls.loadSource("/api/video/proxy?url=" + e.target.attributes.link.value);
                                        hls.attachMedia(video);
                                        hls.on(Hls.Events.MANIFEST_PARSED, () => {
                                            video.pause();
                                            $("#videoTitle").text(e.target.attributes.titleJSF.value);
                                            $("#videoContainer").css("display", "block");
                                            $("#video").prop("currentTime", currentTime);
                                            $("body").css("overflow", "hidden");
                                            $(document).on("contextmenu", preventContextMenu);

                                            topbar.hide();
                                        });
                                    };
                                };
                            })
                            .catch(error => {
                                console.log("Error(drama.getEachDramaData.js - 2): " + error);
            
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
            
                                    topbar.hide();
                                };
            
                                // Watch drama function is only available for testing account.
                                if(data.error && data.message == "restricted to test account at this stage only"){
                                    alert("抱歉，觀看劇集功能暫時只提供給以下測試帳戶作為測試用途:\n\n測試帳戶: test@test.com\n\n測試密碼: 12345678");
            
                                    topbar.hide();
                                };
            
                                if(data.ok){
                                    // Add loading effect
                                    topbar.show();

                                    $("#video").attr("src", "/api/video?link=" + e.target.attributes.link.value)
                                    $("#videoTitle").text(e.target.attributes.titleChi.value + " - " + e.target.attributes.titleEpisode.value);
                                    $("#videoContainer").css("display", "block");
                                    $("#video").prop("currentTime", currentTime);
                                    $("body").css("overflow", "hidden");
                                    $(document).on("contextmenu", preventContextMenu);
            
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
                            currentTime = $("#video").prop("currentTime");
                            $("#video").trigger("pause");
                            $("#videoContainer").css("display", "none");
                            $("body").css("overflow", "auto");
                            $(document).off("contextmenu", preventContextMenu);
                        });
                    };
                    dramaVideo();

                    // Cast
                    function castFunc(){
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
                                null;
                            };
                        };
                    };
                    castFunc();

                    // Drama rating
                    function ratingFunc(){
                        if(data.data.drama.dramaRating == "None" || data.data.drama.dramaRating == "" || data.data.drama.dramaRating == []){
                            $("#dramaRating").append(`<div style="text-align:center; font-size:20px;">暫無收視率資料</div>`);
                            $("#myChart").remove();
            
                            originalRatingContent = `<div style="text-align:center; font-size:20px;">暫無收視率資料</div>`
                            ratingToBeEdit = "暫無收視率資料";
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
            
                            originalRating = rating;
                            originalRatingMax = maxRatingisDivisible;
                            originalRatingAvg = avgRating;
                            originalRatingEpisode = episode;
            
                            for(let i = 0; i < rating.length; i ++){
                                if(i !== rating.length - 1){
                                    ratingToBeEdit = ratingToBeEdit + rating[i] + ", ";
                                }
                                else{
                                    ratingToBeEdit = ratingToBeEdit + rating[i];
                                };
                            };
            
                            originalRatingContent = `<canvas id="myChart"></canvas>`;
                        };
                    };
                    ratingFunc();

                    // Discuss.
                    function discussFunc(){
                        const discussPostID = location.href.split("/").pop();
                
                        async function getData(url){
                            const response = await fetch(url);
                            const data = await response.json();
                            return data;
                        };
                    
                        getData(`/api/discuss/${discussPostID}`)
                        .then(data => {
            
                            // If no discuss data.
                            const dramaTitle = $("#dramaTitle").text().split(" (20")[0];
            
                            if(data.error && data.message == "ID not found"){
                                $("#discussNoPostContainer").css("display", "block");
                                $("#discussNoPost").text(dramaTitle);
                            };
                    
                            // If discuss data is found.
                            const discussData = data.data;
                    
                            if(discussData){
                                // Post content.
                                $("#discussContentContainer").css("display", "block");
                                $("#discussPostTitle").text(`[${discussData.discussDramaTitle}] ${discussData.discussHeader}`);
                                $("#discussMemberProfilePicture").attr("src", discussData.discussMemberID[0].memberProfilePicture);
                                $("#discussMemberName").text(discussData.discussMemberID[0].memberName);
                                $("#discussCreatedTime").text(` 於 ${discussData.discussCreatedTime.split(".")[0].replace(" ", ", ")} 發佈`);
                                $("#discussPost").append(discussData.discussContent);
                                $("#discussLikeCount").text(discussData.likePostCount.length);
                            };
                        })
                        .catch(error => {
                            console.log("Error(discuss.post.js - 1): " + error);
                        });
            
                        // Handle full discuss content click if available.
                        $("#discussContentContainer").click(() => {
                            location.href = `/discuss/${discussPostID}?page=1`;
                        });
                    };
                    discussFunc();

                    // Media information
                    function mediaFunc(){
                        if(dramaData.dramaMedia == "None" || dramaData.dramaMedia == "" || dramaData.dramaMedia == null){
                            $("#dramaMedia").append(`
                                <div style="font-size:20px;">暫無媒體資訊</div>
                            `);
            
                            mediaToBeEdit = "暫無媒體資訊";
            
                            originalMediaContent = `<div style="font-size:20px;">暫無媒體資訊</div>`;
                        }
                        else{
                            $("#dramaMedia").append(`
                                <iframe class="media-video" src="${dramaData.dramaMedia}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            `);
            
                            mediaToBeEdit = dramaData.dramaMedia;
            
                            originalMediaContent = `<iframe class="media-video" src="${dramaData.dramaMedia}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                        };
                    };
                    mediaFunc();

                    // Show content
                    $("#dramaContentContainer").css("visibility", "visible");

                    topbar.hide();
                };
            })
            .catch(error => {
                console.log("Error(drama.getEachDramaData.js - 3): " + error);
                
                topbar.hide();
            });

            // Handle drama edit button click.
            dramaEditBtn();

            // Handle individual drama edit button click.
            $("img.individual-edit-btn").click((e) => {

                const individualBtnID = e.target.attributes.id.value;
                contentToBeEdit = $(`div.drama-details-content-${individualBtnID}`).text().trim();

                $("#dramaEditBtn").css("display", "none");
                $(`img.confirm-btn-${individualBtnID}`).css("display", "block");
                $("img.individual-edit-btn").css("display", "none");
                $(`div.drama-details-content-${individualBtnID}`).text("");

                // Check whether the click button is edit video link button.
                if(individualBtnID != "edit7" && individualBtnID != "edit8" && individualBtnID != "edit9" && individualBtnID != "edit10"){
                    // Change the content to be updated to "edit mode" (e.g. input / textarea tag - depends on the length of content) before HTML DOM.
                    if(contentToBeEdit.length > 10){
                        $(`div.drama-details-content-${individualBtnID}`).append(`
                            <textarea id="editDramaContent-${individualBtnID}" class="edit-drama-content">${contentToBeEdit}</textarea>
                        `);
                    }
                    else{
                        $(`div.drama-details-content-${individualBtnID}`).append(`
                            <input id="editDramaContent-${individualBtnID}" class="edit-drama-content" value=${contentToBeEdit}></input>
                        `);
                    };
                };

                if(individualBtnID == "edit7"){
                    $(`div.drama-details-content-${individualBtnID}`).append(`
                        <textarea id="editDramaContent-${individualBtnID}" class="edit-drama-content">${episodeToBeEdit}</textarea>
                    `);
                };

                if(individualBtnID == "edit8"){
                    $(`div.drama-details-content-${individualBtnID}`).append(`
                        <textarea id="editDramaContent-${individualBtnID}" class="edit-drama-content">${actorToBeEdit}</textarea>
                    `);
                };

                if(individualBtnID == "edit9"){
                    $(`div.drama-details-content-${individualBtnID}`).append(`
                        <textarea id="editDramaContent-${individualBtnID}" class="edit-drama-content">${ratingToBeEdit}</textarea>
                    `);
                };

                if(individualBtnID == "edit10"){
                    $(`div.drama-details-content-${individualBtnID}`).append(`
                        <textarea id="editDramaContent-${individualBtnID}" class="edit-drama-content">${mediaToBeEdit}</textarea>
                    `);
                };

            });

            // Handle "no" button click.
            $("img#confirmNo").click((e) => {

                const confirmNoBtnID = e.target.attributes.name.value;

                $(`img.confirm-btn-${confirmNoBtnID}`).css("display", "none");
                $(`div.drama-details-content-${confirmNoBtnID}`).text("");
                $("#dramaEditBtn").css("display", "block");
                $("#editDramaCoverPhotoLabel").attr("for", "");
                $("#dramaCoverPhoto").css("cursor", "");
                $("#dramaCoverPhoto").off("mouseenter mouseleave");
                $("#home-tab").click();

                // Check whether the click button is edit video link button, and restore the content to the original one.
                if(confirmNoBtnID != "edit7" && confirmNoBtnID != "edit8" && confirmNoBtnID != "edit9" && confirmNoBtnID != "edit10"){
                    $(`div.drama-details-content-${confirmNoBtnID}`).text(`${contentToBeEdit}`);
                };

                if(confirmNoBtnID == "edit7"){

                    $("#dramaDownloadUpload").append(`${originalEpisodeContent}`);

                    // handle each episode button click.
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
            
                                    topbar.hide();
                                };
            
                                // Watch drama function is only available for testing account.
                                if(data.error && data.message == "restricted to test account at this stage only"){
                                    alert("抱歉，觀看劇集功能暫時只提供給以下測試帳戶作為測試用途:\n\n測試帳戶: test@test.com\n\n測試密碼: 12345678");
            
                                    topbar.hide();
                                };
            
                                if(data.ok){
                                    // Add loading effect
                                    topbar.show();
            
                                    $("#video").attr("src", "/api/video?link=" + e.target.attributes.link.value)
                                    $("#videoTitle").text(e.target.attributes.titleChi.value + " - " + e.target.attributes.titleEpisode.value);
                                    $("#videoContainer").css("display", "block");
                                    $("#video").prop("currentTime", currentTime);
                                    $("body").css("overflow", "hidden");
                                    $(document).on("contextmenu", preventContextMenu);
            
                                    topbar.hide();
                                };
                            })
                            .catch(error => {
                                console.log("Error(drama.getEachDramaData.js - 2): " + error);
            
                                topbar.hide();
                            });
            
                        });
                        
                    };
                    handleBtnClickAfterDOM();
                };

                if(confirmNoBtnID == "edit8"){
                    $("#castContainer").append(`${originalActorContent}`);
                };

                if(confirmNoBtnID == "edit9"){
                    $("#dramaRating").append(`${originalRatingContent}`);

                    ratingData(originalRating, originalRatingMax, originalRatingAvg, originalRatingEpisode);
                };

                if(confirmNoBtnID == "edit10"){
                    $("#dramaMedia").append(`${originalMediaContent}`);
                };
                
            });

            // Handle "yes" button click.
            $("img#confirmYes").click((e) => {
                // Add loading effect
                topbar.show();

                let editDramaContent = null;
                const confirmYesBtnID = e.target.attributes.name.value;
                const updateIndicator = confirmYesBtnID;
                const editDramaID = location.href.split("/").pop();

                if(confirmYesBtnID != "edit7" || confirmYesBtnID != "edit8" || confirmYesBtnID != "edit9" || confirmYesBtnID != "edit10"){
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

                if(confirmYesBtnID == "edit9"){
                    editDramaContent = $(`textarea#editDramaContent-edit9`).val();
                };

                if(confirmYesBtnID == "edit10"){
                    editDramaContent = $(`textarea#editDramaContent-edit10`).val();
                };

                async function addEditdata(url, method){
                    const response = await fetch(url, method);
                    const data = await response.json();
                    return data;
                };

                addEditdata(`/api/drama/edit/${editDramaID}`, {
                    method: "PATCH",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({
                        editDramaContent: editDramaContent,
                        updateIndicator: updateIndicator
                    })
                })
                .then(data => {

                    if(data.error && data.message == "The category does not match with the designated format"){
                        alert("請輸入正確劇集類別格式！");

                        topbar.hide();
                    }
                    else if(data.error && data.message == "The introduction does not match with the designated format"){
                        alert("請輸入正確劇集概要格式！");

                        topbar.hide();
                    }
                    else if(data.error && data.message == "The tv does not match with the designated format"){
                        alert("請輸入正確播放電視台格式！");

                        topbar.hide();
                    }
                    else if(data.error && data.message == "The date does not match with the designated format"){
                        alert("請輸入正確播放日期格式！");

                        topbar.hide();
                    }
                    else if(data.error && data.message == "The week does not match with the designated format"){
                        alert("請輸入正確播放星期格式！");

                        topbar.hide();
                    }
                    else if(data.error && data.message == "The time does not match with the designated format"){
                        alert("請輸入正確播放時間格式！");

                        topbar.hide();
                    }
                    else if(data.error && data.message == "The video does not match with the designated format"){
                        alert("請輸入正確磁力連結格式！");

                        topbar.hide();
                    }
                    else if(data.error && data.message == "The actor does not match with the designated format"){
                        alert("請輸入正確演員資料格式！");

                        topbar.hide();
                    }
                    else if(data.error && data.message == "The rating does not match with the designated format"){
                        alert("請輸入正確收視率格式！");

                        topbar.hide();
                    }
                    else if(data.error && data.message == "The media does not match with the designated format"){
                        alert("請輸入正確媒體資料格式！");

                        topbar.hide();
                    }

                    if(data.data){
                        let updatedDramaContent = data.data;

                        $(`div.drama-details-content-${confirmYesBtnID}`).text("");
                        $(`img.confirm-btn-${e.target.attributes.name.value}`).css("display", "none");
                        $("#dramaEditBtn").css("display", "block");
                        $("#editDramaCoverPhotoLabel").attr("for", "");
                        $("#dramaCoverPhoto").css("cursor", "");
                        $("#dramaCoverPhoto").off("mouseenter mouseleave");
                        // Return to the first tab of video bar.
                        $("#home-tab").click();

                        if(confirmYesBtnID != "edit7" && confirmYesBtnID != "edit8" && confirmYesBtnID != "edit9" && confirmYesBtnID != "edit10"){
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

                            topbar.hide();
                        };

                        if(confirmYesBtnID == "edit7"){
                            // Clear the content before adding the new video content.
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
                    
                                            topbar.hide();
                                        };
                                    })
                                    .catch(error => {
                                        console.log("Error(drama.getEachDramaData.js - 2): " + error);
                    
                                        topbar.hide();
                                    });
                    
                                });
                                
                            };
                            handleBtnClickAfterDOM();

                            topbar.hide();
                        };

                        if(confirmYesBtnID == "edit8"){
                            if(updatedDramaContent.dramaActor[0] == ""){
                                $("#castContainer").append(`<div style="font-size:20px;">暫無演員資料</div>`);

                                originalActorContent = `<div style="font-size:20px;">暫無演員資料</div>`;

                                // After update the cast list, restore the textarea content to the latest content one.
                                let updatedTextarea = "";

                                actorToBeEdit = updatedTextarea;

                                topbar.hide();
                            }
                            else{
                                // Clear the content before adding the new cast content.
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

                                // After update the cast list, restore the textarea content to the latest content one.
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

                                topbar.hide();
                            };

                        };

                        if(confirmYesBtnID == "edit9"){

                            if(updatedDramaContent == ""){
                                originalRatingContent = `<div style="text-align:center; font-size:20px;">暫無收視率資料</div>`;
                                $("#dramaRating").append(`${originalRatingContent}`);

                                // After update the rating list, restore the textarea content to the latest content one.
                                let updatedTextarea = "";

                                ratingToBeEdit = updatedTextarea;

                                topbar.hide();
                            }
                            else{
                                originalRatingContent = `<canvas id="myChart"></canvas>`;

                                $("#dramaRating").append(`${originalRatingContent}`);

                                const rating = updatedDramaContent;
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
            
                                originalRating = rating;
                                originalRatingMax = maxRatingisDivisible;
                                originalRatingAvg = avgRating;
                                originalRatingEpisode = episode;

                                // After update the rating list, restore the textarea content to the latest content one.
                                let updatedTextarea = "";
            
                                for(let i = 0; i < updatedDramaContent.length; i ++){
                                    if(i !== updatedDramaContent.length - 1){
                                        updatedTextarea = updatedTextarea + updatedDramaContent[i] + ", ";
                                    }
                                    else{
                                        updatedTextarea = updatedTextarea + updatedDramaContent[i];
                                    };
                                };
            
                                ratingToBeEdit = updatedTextarea;
            
                                topbar.hide();

                            };

                        };

                        if(confirmYesBtnID == "edit10"){

                            if(updatedDramaContent == "None"){

                                originalMediaContent = `<div style="text-align:center; font-size:20px;">暫無媒體資訊</div>`;

                                $("#dramaMedia").append(`${originalMediaContent}`);

                                // After update the media list, restore the textarea content to the latest content one.
                                let updatedTextarea = "";

                                updatedTextarea = "暫無媒體資訊";

                                mediaToBeEdit = updatedTextarea;

                                topbar.hide();
                            }
                            else{

                                originalMediaContent = `<iframe class="media-video" src="${updatedDramaContent}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

                                $("#dramaMedia").append(`${originalMediaContent}`);

                                // After update the media list, restore the textarea content to the latest content one.
                                let updatedTextarea = "";

                                updatedTextarea = updatedDramaContent;

                                mediaToBeEdit = updatedTextarea;

                                topbar.hide();
                            };

                        };

                    };
                })
                .catch(error => {
                    console.log("Error(drama.getEachDramaData.js - ): " + error);

                    topbar.hide();
                });
            })

        }

    };

    const controller = {

        init: function(){
            model.init();
        }

    };
    controller.init();

};