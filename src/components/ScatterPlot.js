import React from 'react';
import Plot from 'react-plotly.js';

const ScatterPlot = ({ x, y }) => {
    const trace = {
        x: x,
        y: y,
        mode: 'markers',
        type: 'scatter',
    };

    const layout = {
        title: 'Scatter Plot of Attendance vs Marks',
        xaxis: { title: 'Attendance Percentage' },
        yaxis: { title: 'Marks' },
    };

    return <Plot data={[trace]} layout={layout} style={{ width: '1200px', height: '800px' }} />;
};

export default ScatterPlot;