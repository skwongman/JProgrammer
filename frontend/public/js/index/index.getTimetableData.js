export default function getTimetableData(){
        
    const model = {
        init: function(){
            async function getData(url){
                const response = await fetch(url);
                const data = await response.json();
                return data;
            };
        
            getData("/api/timetable")
            .then(data => {
                view.render(data);
            })
            .catch(err => {
                view.renderError(err);
            });
        }
    };

    const view = {
        render: function(data){
            if(data.data){
                data.data.map(result => {
                    const timetableHTML = `
                        <div class="timetable-list-border">
                            <img class="timetable-list-photo" src="${result.dramaCoverPhoto}" title="${result.dramaTimeOfBoardcast.slice(0,5)}">
                            <div class="timetable-list-title">
                                <div id="timetableTest">${result.dramaTitle}</div>
                            </div>
                        </div>
                    `;

                    if(result.dramaWeek == "每週一"){
                        $("#timetableMonContainer").append(timetableHTML);
                    }
                    else if(result.dramaWeek == "每週二"){
                        $("#timetableTueContainer").append(timetableHTML);
                    }
                    else if(result.dramaWeek == "每週三"){
                        $("#timetableWedContainer").append(timetableHTML);
                    }
                    else if(result.dramaWeek == "每週四"){
                        $("#timetableThurContainer").append(timetableHTML);
                    }
                    else if(result.dramaWeek == "每週五"){
                        $("#timetableFriContainer").append(timetableHTML);
                    }
                    else if(result.dramaWeek == "每週六"){
                        $("#timetableSatContainer").append(timetableHTML);
                    }
                    else if(result.dramaWeek == "每週日"){
                        $("#timetableSunContainer").append(timetableHTML);
                    };
                });
            };
        },
        renderError: function(err){
            console.log("JsError(3): " + err);
        }
    };

    const controller = {
        init: function(){
            model.init();
        }
    };
    controller.init();
    
};