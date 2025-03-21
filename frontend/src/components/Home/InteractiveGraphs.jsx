import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../styles/Home/InteractiveGraphs.css';

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
        })).filter(d => !isNaN(d.Sentiment_Score)); // Filter out invalid data
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
        })).filter(d => !isNaN(d.Date.getTime())); // Filter out invalid dates
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
        borderColor: 'rgba(255, 99, 71, 1)',
        backgroundColor: 'rgba(255, 99, 71, 0.2)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6
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
        borderColor: 'rgba(255, 99, 71, 1)',
        backgroundColor: 'rgba(255, 99, 71, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6
      },
      {
        label: 'Predicted Avg List Price',
        data: priceData.map(d => d.PredictedAvgListPrice),
        borderColor: 'rgba(75, 192, 192, 1)', 
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderDash: [5, 5]
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        cornerRadius: 6,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12
      }
    },
    scales: {
      x: {
        ticks: { 
          autoSkip: true, 
          maxTicksLimit: 15, // Increased from 12 to show more x-axis points
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      }
    },
    elements: {
      line: {
        borderJoinStyle: 'round'
      },
      point: {
        hitRadius: 10 // Increase hit radius for better interaction
      }
    }
  };

  return (
    <section className="graphs-section">
      <div className="graphs-container">
        <div className="graph-card">
          <h2 className="graph-title">Market Sentiment Analysis</h2>
          <p className="graph-subtitle">Tracking real estate market sentiment over time</p>
          <div className="graph-content">
            <Line data={sentimentChartData} options={commonOptions} />
          </div>
        </div>
        
        <div className="graph-card">
          <h2 className="graph-title">Price Trend Analysis</h2>
          <p className="graph-subtitle">Historical and predicted property prices</p>
          <div className="graph-content">
            <Line data={priceChartData} options={commonOptions} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveGraphs;
