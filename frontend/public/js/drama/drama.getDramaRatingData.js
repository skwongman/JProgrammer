export default function getDramaRatingData(){

    // Fetch drama rating API
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
            if(data.data.dramaRating == "None"){
                $("#dramaRating").append(`<div>暫無收視率資料</div>`);
                $("#myChart").remove();
            }
            else{
                const rating = data.data.dramaRating;
                const sum = rating.reduce((acc, val) => acc + parseFloat(val), 0);
                const avgRating = (sum / rating.length).toFixed(1);
                const episode = [];
    
                for(let i = 0; i < rating.length; i ++){
                    episode.push(`第${i + 1}話`);
                };
    
                // Callback function
                ratingData(rating, avgRating, episode);
            };
        };
    })
    .catch(error => {
        console.log("Error(drama.getEachDramaData.js): " + error);
    });


    // Drama rating chart setting
    function ratingData(cbRating, cbAvgRating, cbEpisode){

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


        // const avgRating = (data.datasets[0].data.reduce((a, b) => a + b, 0) / data.datasets[0].data.length).toFixed(1);

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
        const chart = new Chart(ctx, {
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