export default function getEachDramaData(){

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
        };

        if(data.data){
            const dramaData = data.data;
            const yearOfDrama = ` (${dramaData.dramaDateOfBoardcast.split("-")[0]})`;

            // Cover photo
            $("#dramaCoverPhoto").attr("src", dramaData.dramaCoverPhoto);

            // Title
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
                $("#dramaIntroduction").text(dramaData.dramaIntroduction);
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
            for(let i = 0; i < dramaData.dramaDownload.reverse().length; i ++){
                $("#dramaDownload").append(`
                    <div class="drama-episode-title">
                        <a href="${dramaData.dramaDownload[i].downloadLink}">第${i+1}話</a>
                    </div>
                `)
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

            // Get drama photo dominant color
            getDramaPhotoDominantColor(dramaData.dramaCoverPhoto);
        };
    })
    .catch(error => {
        console.log("Error(drama.getEachDramaData.js - 1): " + error);
    });


    // Callback function
    function getDramaPhotoDominantColor(cbPhotoURL){
        async function getData(url, method){
            const response = await fetch(url, method);
            const data = await response.json();
            return data;
        };

        getData("/api/color", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({
                "photoURL": cbPhotoURL
            })
        })
        .then(data => {
            if(data.data){
                document.querySelector("#transparentLayer").style.backgroundColor = `rgba(${data.data.dominantColor[0]}, ${data.data.dominantColor[1]}, ${data.data.dominantColor[2]}, 0.84)`
                document.querySelector("#dramaBannerBackgroundPhoto").style.backgroundImage = `url("${cbPhotoURL}")`;
                document.querySelector("#dramaDetailsFontColor").style.color = `rgba(${data.data.colorPallete[3][0]}, ${data.data.colorPallete[3][1]}, ${data.data.colorPallete[3][2]})`
    
            };
        })
        .catch(error => {
            console.log("Error(drama.getEachDramaData.js - 2" + error);
        });
    };

};