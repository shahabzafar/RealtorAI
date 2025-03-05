import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const InteractiveGraphs = () => {
  const [sentimentData, setSentimentData] = useState([]);
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    // Load and parse sentiment_full.csv
    Papa.parse(`${process.env.PUBLIC_URL}/sentiment_full.csv`, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data.map(d => ({
          Date: new Date(d.Date),
          Sentiment_Score: parseFloat(d.Sentiment_Score),
          Type: d.Type
        }));
        setSentimentData(data);
      }
    });

    // Load and parse historic_and_predicted.csv
    Papa.parse(`${process.env.PUBLIC_URL}/historic_and_predicted.csv`, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data.map(d => ({
          Date: new Date(d.Date),
          AvgListPrice: d['Avg List Price'] ? parseFloat(d['Avg List Price']) : null,
          PredictedAvgListPrice: d.Predicted_Avg_List_Price ? parseFloat(d.Predicted_Avg_List_Price) : null,
          DataType: d.DataType
        }));
        setPriceData(data);
      }
    });
  }, []);

  // Prepare sentiment chart data
  const sentimentChartData = {
    labels: sentimentData.map(d => d.Date.toLocaleDateString()),
    datasets: [
      {
        label: 'Sentiment Score',
        data: sentimentData.map(d => d.Sentiment_Score),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: false,
        tension: 0.1
      }
    ]
  };

  // Prepare price chart data (showing both historical and predicted if available)
  const priceChartData = {
    labels: priceData.map(d => d.Date.toLocaleDateString()),
    datasets: [
      {
        label: 'Avg List Price',
        data: priceData.map(d => d.AvgListPrice),
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Predicted Avg List Price',
        data: priceData.map(d => d.PredictedAvgListPrice),
        borderColor: 'rgba(54,162,235,1)',
        backgroundColor: 'rgba(54,162,235,0.2)',
        fill: false,
        tension: 0.1
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    },
    scales: {
      x: {
        ticks: { autoSkip: true, maxTicksLimit: 10 }
      }
    }
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2 style={{ textAlign: 'center' }}>Sentiment Over Time</h2>
      <Line data={sentimentChartData} options={commonOptions} />
      <h2 style={{ textAlign: 'center', marginTop: '3rem' }}>Average List Price Trends</h2>
      <Line data={priceChartData} options={commonOptions} />
    </div>
  );
};

export default InteractiveGraphs;
