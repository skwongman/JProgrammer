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

            $("#dramaCoverPhoto").attr("src", dramaData.dramaCoverPhoto);
            $("#dramaTitle").text(dramaData.dramaTitle + yearOfDrama);
            $("#dramaCategory").text(dramaData.dramaCategory);
            (dramaData.dramaIntroduction == "None") ? $("#dramaIntroduction").text("暫無概要") : $("#dramaIntroduction").text(dramaData.dramaIntroduction)
            $("#dramaTV").text(dramaData.dramaTV);
            $("#dramaWeek").text(dramaData.dramaWeek);
            $("#dramaTimeOfBoardcast").text(dramaData.dramaTimeOfBoardcast);
            $("#dramaDateOfBoardcast").text(`首播日期: (${dramaData.dramaDateOfBoardcast})`);
        };
    })
    .catch(error => {
        console.log("Error(drama.getEachDramaData.js): " + error);
    });

};