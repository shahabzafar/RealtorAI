import React, { useState } from 'react';
import '../../styles/Home/RealEstateTrends.css';

const RealEstateTrends = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    '/images/trends.jpg',
    '/images/trends2.jpg',
    '/images/trends3.jpg'
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <section className="real-estate-trends">
      <div className="container">
        <h3>Real Estate Trends</h3>
        <div className="trends-carousel">
          <button className="carousel-control prev" onClick={handlePrev}>❮</button>
          <div className="carousel-slide active">
            <img src={images[currentIndex]} alt={`Real Estate Trend ${currentIndex + 1}`} />
          </div>
          <button className="carousel-control next" onClick={handleNext}>❯</button>
        </div>
      </div>
    </section>
  );
};

export default RealEstateTrends;
