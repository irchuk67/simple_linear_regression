import React from 'react';
import Plot from 'react-plotly.js';
import * as ss from 'simple-statistics';

const ConfidenceIntervalPlot = ({ x, y, regressionLine }) => {
    const predictions = x.map(regressionLine);
    const n = x.length;
    const meanX = ss.mean(x);
    const t = 1.96; // 95% довірчий інтервал для великої вибірки
    const s = Math.sqrt(ss.variance(y) * (1 - ss.sampleCorrelation(x, y) ** 2));

    const intervals = x.map((xi) => {
        const se = s * Math.sqrt(1 / n + (Math.pow(xi - meanX, 2) / (n * ss.variance(x))));
        return [regressionLine(xi) - t * se, regressionLine(xi) + t * se];
    });

    const lowerBound = intervals.map(d => d[0]);
    const upperBound = intervals.map(d => d[1]);

    const trace1 = {
        x: x,
        y: y,
        mode: 'markers',
        type: 'scatter',
        name: "Data points"
    };

    const trace2 = {
        x: x,
        y: predictions,
        mode: 'lines',
        name: 'Regression Line',
    };

    const trace3 = {
        x: x,
        y: upperBound,
        fill: 'tonexty',
        mode: 'lines',
        line: { color: 'rgba(0,0,0,0)' },
        name: 'Upper Confidence Interval',
    };

    const trace4 = {
        x: x,
        y: lowerBound,
        fill: 'tonexty',
        mode: 'lines',
        line: { color: 'rgba(0,0,0,0)' },
        name: 'Lower Confidence Interval',
    };

    const layout = {
        title: 'Linear Regression with Confidence Interval',
        xaxis: { title: 'Attendance Percentage' },
        yaxis: { title: 'Marks' },
    };

    return <Plot data={[trace1, trace2, trace3, trace4]} layout={layout} style={{ width: '1200px', height: '800px' }} />;
};

export default ConfidenceIntervalPlot;