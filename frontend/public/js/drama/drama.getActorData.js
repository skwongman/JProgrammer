export default function getActorData(){

    const dramaID = location.href.split("/").pop();

    async function getData(url){
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    getData(`/api/drama/${dramaID}`)
    .then(data => {
        if(data.data){
            const dramaCastData = data.data;
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
                                <div>${castName} /</div>
                                <div>${actorName}</div>
                            </div>
                        </div>
                    `);
                }
                catch(error){
                    console.log("Error(drama.getActorData.js - 1): " + error);
                };
            };
        };
    })
    .catch(error => {
        console.log("Error(drama.getActorData.js - 2): " + error);
    });

};