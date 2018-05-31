var year = [];
var chart = new CanvasJS.Chart("chartContainer", {
    exportFileName: "Annual Population",
    exportEnabled: true,
    theme: "light2",
    animationEnabled: true,
    animationDuration: 1000,
    zoomEnabled: true,
    zoomType: "x",
    panEnabled: true,
    toolTip: {
        shared: true,
        animationEnabled: true
    },
    title: {
        text: "University of Negros Occidental - Recoletos",
        fontSize: 17
    },
    subtitles:[
        {
            text: "Enrollment Population 2014-2018"
        }
    ],
    legend: {
        cursor: "pointer",
        itemclick: function (e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        },
        itemmouseover: function(e) {
            e.dataSeries.lineThickness = e.chart.data[e.dataSeriesIndex].lineThickness * 2;
            e.dataSeries.markerSize = e.chart.data[e.dataSeriesIndex].markerSize + 2;
            e.chart.render();
        },
        itemmouseout: function(e) {
            e.dataSeries.lineThickness = e.chart.data[e.dataSeriesIndex].lineThickness / 2;
            e.dataSeries.markerSize = e.chart.data[e.dataSeriesIndex].markerSize - 2;
            e.chart.render();
        }
    },
    axisX: {
        title: "Year",
        interval: 1,
        gridDashType: "dot",
        gridThickness: 1,
        labelFontColor: "black"
    },
    axisY: { 
        includeZero: false,
        title: "Number of Enrollees",
        labelFontColor: "black",
        interlacedColor: "#faf9f9"
    }, 
    data: [{
        type: "column",
        showInLegend: true,
        legend: "Total Population",
        name: "Total Population",
        dataPoints: year
    }
          ]
});

$.ajax({
    type: 'GET',    
    url: 'json/annual_population.json',
    contentType: "application/json",
    dataType: 'json', 
    success: function(field) {
        for (var i = 0; i < field.length; i++) {
            year.push({
                label: field[i].year,
                y: field[i].count
            });
        }
        chart.render();
    }
});

//for the switching of graphs 2 dimension data
var chartType = document.getElementById('chartType');
chartType.addEventListener( "change",  function(){
    chart.options.data[0].type = chartType.options[chartType.selectedIndex].value;
    chart.render();
});