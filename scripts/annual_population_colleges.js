var college = []; 
var dataSeries = []; 
var uniqueLabels = {}; 
var distinct = [];
var colorSet = [ 
    "#fe4df5",
    "#00d607", 
    "#e7c403", 
    "#680202", 
    "#565151",
    "#cc6200",
    "#032fe2",
    "#04bccc",
    "#59049f"
];
CanvasJS.addColorSet("customColorSet", colorSet);
var chart = new CanvasJS.Chart("chartContainer", {
    exportFileName: "Annual Population Per College ", 
    exportEnabled: true,
    theme: "light2",
    animationEnabled: true,
    animationDuration: 1000,
    zoomEnabled: true,
    colorSet: "customColorSet",
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
            text: "Population Per College 2014-2018"
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
    data: dataSeries
});

$.ajax({
    type: 'GET',    
    url: 'json/annual_population_colleges.json',
    contentType: "application/json",
    dataType: 'json', 
    success: function(field) {

        for( var i in field ) {
            //Find all distinct labels in JSON
            if( typeof(uniqueLabels[field[i].college]) == "undefined"){
                distinct.push(field[i].college);          
                dataSeries.push({name: field[i].college, type: "stackedColumn", dataPoints: [], showInLegend: true})
            }
            uniqueLabels[field[i].college] = 0;
        }
        for( var i in field) {
            for(var j in dataSeries){
                //push dataPoints to corresponding dataSeries based on label from JSON
                if(dataSeries[j].name === field[i].college) {
                    dataSeries[j].dataPoints.push({label: field[i].year, y: parseInt(field[i].count), exploded: true })
                }
            }
        }

        chart.render();				
    }
});

// for the switching of graphs
var chartOptions = chart.options;
var chartType = document.getElementById('chartType');
var containerId = null;
chartType.addEventListener( "change",  function(){
    if(chartType.options[chartType.selectedIndex].value === "pie" || chartType.options[chartType.selectedIndex].value === "doughnut"){  		
        var charts = [];
        $("#chartContainer").hide();
        for(var i = 0; i < chartOptions.data.length; i++){
            containerId = "chartContainer"+ i;
            if(document.getElementById(containerId) == null)
                $('body').append('<div id='+ containerId + ' style="height: 270px; width: 50%;"></div>');
            else if(document.getElementById(containerId) !== null)
                $("#"+containerId).show();

            charts[i] = new CanvasJS.Chart(containerId, {
                title: {
                    text: chartOptions.data[i].name
                },
                data: [chartOptions.data[i]]
            });
            chartOptions.data[i].type = chartType.options[chartType.selectedIndex].value;
            charts[i].options.data[0].legendText = "{label}";
            charts[i].options.data[0].color = colorSet[i];
            charts[i].render();
            chartOptions.rendered = true;
        }
    }
    else{
        for(var i = 0; i < chartOptions.data.length; i++){
            containerId = "chartContainer" + i;
            $("#"+containerId).hide();
        }

        $("#chartContainer").show();
        for(var i = 0; i < chartOptions.data.length; i++){
            chart.options.data[i].type = chartType.options[chartType.selectedIndex].value;
        }
        chart.render();
    }
});