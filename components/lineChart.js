import React, { useRef, useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default function LineChart({ data }) {
    const lineDom = useRef(null);
    useEffect(() => {
        let chart = am4core.create("linechartdiv", am4charts.XYChart);

        // Add data
        chart.data = data;

        // Set input format for the dates
        chart.dateFormatter.inputDateFormat = "dd-mm-yyyy";

        // Create axes
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // Create series
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.tooltipText = "{value}"
        series.strokeWidth = 2;
        series.minBulletDistance = 15;

        // Drop-shaped tooltips
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.strokeOpacity = 0;
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.label.minWidth = 40;
        series.tooltip.label.minHeight = 40;
        series.tooltip.label.textAlign = "middle";
        series.tooltip.label.textAlign = "middle";

        // Make bullets grow on hover
        let bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");

        let bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;

        // Make a panning cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "panXY";
        chart.cursor.xAxis = dateAxis;
        chart.cursor.snapToSeries = series;

        // // Create vertical scrollbar and place it before the value axis
        // chart.scrollbarY = new am4core.Scrollbar();
        // chart.scrollbarY.parent = chart.leftAxesContainer;
        // chart.scrollbarY.toBack();

        // // Create a horizontal scrollbar with previe and place it underneath the date axis
        // chart.scrollbarX = new am4charts.XYChartScrollbar();
        // chart.scrollbarX.series.push(series);
        // chart.scrollbarX.parent = chart.bottomAxesContainer;

        dateAxis.start = 0.79;
        dateAxis.keepSelection = true;

        lineDom.current = chart;
        return () => {
            chart.dispose();
        }
    }, [data])
    return (
        <div>
            <div id="linechartdiv" style={{ width: "100%", height: "500px", marginTop: "20px", marginBottom: "20px" }}></div>
        </div>
    )
}
