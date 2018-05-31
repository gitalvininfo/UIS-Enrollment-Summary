var roomname = []; 
var dataSeries = []; 
var uniqueLabels = {}; 
var distinct = [];

var chart = new CanvasJS.Chart("chartContainer", {
    exportFileName: "Laboratories and Room Weekly Usage",
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
            text: "Weekly Laboratories and Rooms Usage"
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
        title: "Number of Hours",
        labelFontColor: "black",
        interlacedColor: "#faf9f9"
    }, 
    data: dataSeries
});

$.ajax({
    type: 'GET',    
    url: 'json/laboratories_rooms.json',
    contentType: "application/json",
    dataType: 'json', 
    success: function(field) {

        for( var i in field ) {
            //Find all distinct labels in JSON
            if( typeof(uniqueLabels[field[i].roomname]) == "undefined"){
                distinct.push(field[i].roomname);          
                dataSeries.push({building: field[i].building, name: field[i].roomname, type: "stackedColumn", dataPoints: [], showInLegend: true})
            }
            uniqueLabels[field[i].roomname] = 0;
        }
        for( var i in field) {
            for(var j in dataSeries){
                //push dataPoints to corresponding dataSeries based on label from JSON
                if(dataSeries[j].name === field[i].roomname) {
                    dataSeries[j].dataPoints.push({label: field[i].day, y: parseInt(field[i].hours) })
                }
            }
        }
        chart.render();				
    }
});

//for the switching of graphs 3 dimension data
var data = chart.options.data;
var selectedChartType = 'stackedColumn';
var chartType = document.getElementById('chartType');
chartType.addEventListener( "change",  function(){
    selectedChartType = chartType.options[chartType.selectedIndex].value;
    for(var i= 0; i < chart.options.data.length; i++){
        chart.options.data[i].type = chartType.options[chartType.selectedIndex].value;
    }
    chart.render();
});

// for the switching of buildings
var building = document.getElementById('building');
building.addEventListener( "change",  function(){
    var dataSeries;    
    chart.options.data = [];
    for(var i= 0; i < data.length; i++){
        if(data[i].building === building.options[building.selectedIndex].value){
            dataSeries = data[i];
            dataSeries.type = selectedChartType;
            chart.options.data.push(dataSeries);
        }
        else if(building.options[building.selectedIndex].value === ""){
            for(var i = 0; i < data.length; i++){
                data[i].type = selectedChartType;
            }
            chart.options.data = data;    
        }
    }    
    chart.render();
});