var course = [];
var dataSeries = [];
var uniqueLabels = {};
var distinct = [];

var chart = new CanvasJS.Chart("chartContainer", {
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
            text: "Enrollment Population by Courses/Program 2014-2018"
        }
    ],
    legend: {
        cursor: "pointer",
        fontSize: 10,
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
    url: 'json/courses_program.json',
    contentType: "application/json",
    dataType: 'json', 
    success: function(field) {

        for( var i in field ) {
            //Find all distinct labels in JSON
            if( typeof(uniqueLabels[field[i].course]) == "undefined"){
                distinct.push(field[i].course);          
                dataSeries.push({college: field[i].college, name: field[i].course, type: "stackedColumn", dataPoints: [], showInLegend: true})
            }
            uniqueLabels[field[i].course] = 0;
        }

        for( var i in field) {
            for(var j in dataSeries){
                //push dataPoints to corresponding dataSeries based on label from JSON
                if(dataSeries[j].name === field[i].course) {
                    dataSeries[j].dataPoints.push({label: field[i].year, y: parseInt(field[i].count) })
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


//for the switching of colleges
var college = document.getElementById('college');
college.addEventListener( "change",  function(){
    var dataSeries;    
    chart.options.data = [];
    for(var i= 0; i < data.length; i++){
        if(data[i].college === college.options[college.selectedIndex].value){	
            dataSeries = data[i];
            dataSeries.type = selectedChartType;
            chart.options.data.push(dataSeries);
        }
        else if(college.options[college.selectedIndex].value === ""){
            for(var i = 0; i < data.length; i++){
                data[i].type = selectedChartType;
            }
            chart.options.data = data;    
        }
    }    

    chart.render();
});