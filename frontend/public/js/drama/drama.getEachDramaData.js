export default function getEachDramaData(){

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
            $("#dramaDateOfBoardcast").text(`首播日期: ${dramaData.dramaDateOfBoardcast}`);

            // Week of broadcast
            $("#dramaWeek").text(`${dramaData.dramaWeek}: `);

            // Time of broadcast
            $("#dramaTimeOfBoardcast").text(dramaData.dramaTimeOfBoardcast);

            // Episode
            for(let i = dramaData.dramaDownload.length - 1; i >=0; i --){
                const episode = dramaData.dramaDownload.length - i;

                $("#dramaDownload").append(`
                    <div class="drama-episode-title">
                        <span class="video-btn" id="videoBtn${episode}" titleChi="${dramaData.dramaDownload[i].downloadTitleChi}" titleJp="${dramaData.dramaDownload[i].downloadTitleJp}" link="${dramaData.dramaDownload[i].downloadLink}">第${episode}話</span>
                    </div>
                `);
            };
            (colorData.isDark) ? $(".video-btn").css("color", "#fff") : $(".video-btn").css("color", "#000");

            // Drama Video
            let currentTime = 0;
            const preventContextMenu = function(event){
                event.preventDefault();
            };

            document.querySelectorAll("span.video-btn").forEach((result) => {
                result.addEventListener("click", (e) => {
                    // Add the drama video link to the HLS.js
                    if(Hls.isSupported()){
                        const video = document.getElementById("video");
                        const hls = new Hls();
                        hls.loadSource(e.target.attributes.link.value);
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED, function(){
                            video.pause();
                            // Add the drama video title to the video navigation bar.
                            $("#videoTitle").text(e.target.attributes.titleChi.value + " / " + e.target.attributes.titleJp.value);

                            // Display the drama video player.
                            $("#videoContainer").css("display", "block");

                            // Record the video playing time before hide.
                            $("#video").prop("currentTime", currentTime);

                            // Disable the scrolling function.
                            document.body.style.overflow = "hidden";

                            // Disable mouse right-click function.
                            document.addEventListener("contextmenu", preventContextMenu, false);
                        });
                    };
                });
            });

            // Video Close Button.
            document.querySelector("#videoCloseBtn").addEventListener("click", () => {
                // Record the current video playing time before close.
                currentTime = $("#video").prop("currentTime");

                // Pause the video before close.
                $("#video").trigger("pause");

                // Close the video player.
                $("#videoContainer").css("display", "none");

                // Enable the scrolling function.
                document.body.style.overflow = "auto";

                // Enable mouse right-click function.
                document.removeEventListener("contextmenu", preventContextMenu, false);
            });

            // Cast
            const dramaCastData = data.data.drama;

            // If no cast data
            if(dramaCastData.dramaActor == "None" || dramaCastData.dramaActor == "" || dramaCastData.dramaActor == []){
                $("#castContainer").append(`<div style="font-size:20px;">暫無演員資料</div>`);
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
                }
                catch(error){
                    console.log("Error(drama.getActorData.js - 1): " + error);
                };
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
        console.log("Error(drama.getEachDramaData.js - 1): " + error);
        
        // Remove loading effect
        topbar.hide();
    });


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