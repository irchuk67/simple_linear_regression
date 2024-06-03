import React, {useState, useEffect} from 'react';
import * as d3 from 'd3';
import * as ss from 'simple-statistics';
import ScatterPlot from './components/ScatterPlot';
import RegressionPlot from './components/RegressionPlot';
import ConfidenceIntervalPlot from './components/ConfidenceIntervalPlot';

const App = () => {
    const [data, setData] = useState([]);
    const [regressionLine, setRegressionLine] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        d3.csv('data.csv').then((parsedData) => {
            const attendance = parsedData.map(d => parseFloat(d.attendance_percentage));
            const marks = parsedData.map(d => parseFloat(d.mark));
            setData({attendance, marks});

            const regression = ss.linearRegression(attendance.map((x, i) => [x, marks[i]]));
            const regressionLine = ss.linearRegressionLine(regression);
            setRegressionLine(() => regressionLine);

            const rSquared = ss.rSquared(attendance.map((x, i) => [x, marks[i]]), regressionLine);
            const correlation = ss.sampleCorrelation(attendance, marks);

            let adequacy = '';
            if (rSquared > 0.7) {
                adequacy = 'Модель є адекватною';
            } else {
                adequacy = 'Модель потребує покращення';
            }

            const statisticsInfo = {
                slope: regression.m,
                intercept: regression.b,
                rSquared,
                correlation,
                adequacy,
            };

            setStatistics(statisticsInfo);

            // Calculate prediction and confidence interval
            const confidence = 0.95;
            const residuals = marks.map((y, i) => y - regressionLine(attendance[i]));
            const residualStandardError = ss.standardDeviation(residuals);
            const tCritical = getCriticalValue(confidence, attendance.length - 2); // Degrees of freedom = n - 2
            const standardErrorOfPrediction = residualStandardError * Math.sqrt(1 + (1 / attendance.length) + ((Math.pow(70 - ss.mean(attendance), 2)) / (ss.sum(attendance.map(x => Math.pow(x - ss.mean(attendance), 2))))));
            const predictionInterval = tCritical * standardErrorOfPrediction;

            const prediction = {
                prediction: regressionLine(70), // Prediction for 70% attendance
                predictionInterval,
            };

            setPrediction(prediction);
        });
    }, []);

    if (!data.attendance || !regressionLine || !statistics || !prediction) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ScatterPlot x={data.attendance} y={data.marks}/>
            <RegressionPlot x={data.attendance} y={data.marks} regressionLine={regressionLine}/>
            <ConfidenceIntervalPlot x={data.attendance} y={data.marks} regressionLine={regressionLine}/>
            <div>
                <h2>Статистика:</h2>
                <p>Slope: {statistics.slope}</p>
                <p>Intercept: {statistics.intercept}</p>
                <p>R-squared: {statistics.rSquared}</p>
                <p>Correlation: {statistics.correlation}</p>
                <p>{statistics.adequacy}</p>
            </div>
            <div>
                <h2>Прогноз:</h2>
                <p>Прогноз середнього значення залежної змінної з надійністю 0.95: {prediction.prediction}</p>
                <p>Нижня межа довірчого інтервалу: {prediction.prediction - prediction.predictionInterval}</p>
                <p>Верхня межа довірчого інтервалу: {prediction.prediction + prediction.predictionInterval}</p>
            </div>
        </div>
    );
};

// Function to get critical value from t-distribution table
const getCriticalValue = (confidence, degreesOfFreedom) => {
    const alpha = 1 - confidence;
    const tDistributionTable = {
        0.9: [1.833, 1.895, 1.860, 1.812, 1.812, 1.796, 1.782, 1.771, 1.761, 1.753],
        0.95: [1.660, 1.708, 1.684, 1.676, 1.671, 1.664, 1.660, 1.658, 1.646, 1.645],
        0.99: [1.282, 1.341, 1.325, 1.318, 1.312, 1.309, 1.306, 1.303, 1.301, 1.299]
    };
    const index = degreesOfFreedom - 1 < 9 ? degreesOfFreedom - 1 : 9;
    return tDistributionTable[confidence][index];
};

export default App;
