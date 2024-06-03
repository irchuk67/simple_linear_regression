import React from 'react';
import Plot from 'react-plotly.js';

const RegressionPlot = ({ x, y, regressionLine }) => {
    const predictions = x.map(regressionLine);

    const trace1 = {
        x: x,
        y: y,
        mode: 'markers',
        type: 'scatter',
        name: 'Data Points',
    };

    const trace2 = {
        x: x,
        y: predictions,
        mode: 'lines',
        name: 'Regression Line',
    };

    const layout = {
        title: 'Linear Regression',
        xaxis: { title: 'Attendance Percentage' },
        yaxis: { title: 'Marks' },
    };

    return <Plot data={[trace1, trace2]} layout={layout} style={{ width: '1200px', height: '800px' }} />;
};

export default RegressionPlot;