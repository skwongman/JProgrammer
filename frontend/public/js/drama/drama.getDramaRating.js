export default function getDramaRating(){

    // Get the context of the canvas element we want to select
    const ctx = document.getElementById("myChart").getContext("2d");

    // Data for the chart
    const data = {
        labels: ["第一週", "第二週", "第三週", "第四週", "第五週"],
        datasets: [{
            label: "收視率",
            data: [10.5, 7.9, 5.2, 8.1, 6.7],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1
        }]
    };


    const avgRating = (data.datasets[0].data.reduce((a, b) => a + b, 0) / data.datasets[0].data.length).toFixed(1);

    // Configuration for the chart
    const options = {
        annotation: {
            annotations: [{
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                value: avgRating,
                borderColor: "dodgerblue",
                borderWidth: 1.5,
                label: {
                    content: `平均收視率: ${avgRating}%`,
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
                display: true,
                formatter: function(value) {
                    return value + "%";
                },
                font: {
                    size: 16
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

};