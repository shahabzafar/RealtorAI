import React, { useState, useEffect } from 'react';
import '../../styles/Home/FeaturedProperties.css';

const FeaturedProperties = () => {
  const properties = [
    {
      images: [
        process.env.PUBLIC_URL + '/images/image1.jpg',
        process.env.PUBLIC_URL + '/images/image2.jpg',
        process.env.PUBLIC_URL + '/images/image3.jpg'
      ],
      details: [
        { title: '3 Bedroom Modern House', price: '$800,000' },
        { title: '4 Bedroom Luxury Villa', price: '$1,200,000' },
        { title: '3 Bedroom Smart Home', price: '$950,000' },
      ]
    },
    {
      images: ['/images/image4.jpg', '/images/image5.jpg', '/images/image6.jpg'],
      details: [
        { title: '2 Bedroom Cottage', price: '$650,000' },
        { title: '2 Bedroom Condo', price: '$550,000' },
        { title: '2 Bedroom Townhouse', price: '$600,000' },
      ]
    },
    {
      images: ['/images/image7.jpg', '/images/image1.jpg', '/images/image2.jpg'],
      details: [
        { title: '5 Bedroom Estate', price: '$1,300,000' },
        { title: '4 Bedroom Manor', price: '$1,100,000' },
        { title: '5 Bedroom Mansion', price: '$1,500,000' },
      ]
    }
  ];

  // Separate state for each card
  const [firstCardIndex, setFirstCardIndex] = useState(0);
  const [secondCardIndex, setSecondCardIndex] = useState(0);
  const [thirdCardIndex, setThirdCardIndex] = useState(0);

  // Staggered intervals for each card
  useEffect(() => {
    // First card starts immediately and changes every 4 seconds
    const firstInterval = setInterval(() => {
      setFirstCardIndex(prev => (prev + 1) % 3);
    }, 4000);

    // Second card starts after 2 seconds delay
    const secondStart = setTimeout(() => {
      setSecondCardIndex(1); // Start with second image
      // Then continue every 4 seconds
      const secondInterval = setInterval(() => {
        setSecondCardIndex(prev => (prev + 1) % 3);
      }, 4000);
      
      return () => clearInterval(secondInterval);
    }, 2000);

    // Third card starts after 4 seconds delay
    const thirdStart = setTimeout(() => {
      setThirdCardIndex(2); // Start with third image
      // Then continue every 4 seconds
      const thirdInterval = setInterval(() => {
        setThirdCardIndex(prev => (prev + 1) % 3);
      }, 4000);
      
      return () => clearInterval(thirdInterval);
    }, 4000);

    return () => {
      clearInterval(firstInterval);
      clearTimeout(secondStart);
      clearTimeout(thirdStart);
    };
  }, []);

  return (
    <section className="featured-properties">
      <div className="containerProp">
        <h3>Featured Properties</h3>
        <div className="property-grid">
          <div className="property">
            <div className="property-image-container">
              {properties[0].images.map((img, imgIndex) => (
                <div
                  key={imgIndex}
                  className={`property-image ${imgIndex === firstCardIndex ? 'active' : ''}`}
                >
                  <img src={img} alt={`Property 1`} />
                </div>
              ))}
            </div>
            <div className="property-details">
              <p>{properties[0].details[firstCardIndex].title}</p>
              <p className="price">{properties[0].details[firstCardIndex].price}</p>
            </div>
          </div>

          <div className="property">
            <div className="property-image-container">
              {properties[1].images.map((img, imgIndex) => (
                <div
                  key={imgIndex}
                  className={`property-image ${imgIndex === secondCardIndex ? 'active' : ''}`}
                >
                  <img src={img} alt={`Property 2`} />
                </div>
              ))}
            </div>
            <div className="property-details">
              <p>{properties[1].details[secondCardIndex].title}</p>
              <p className="price">{properties[1].details[secondCardIndex].price}</p>
            </div>
          </div>

          <div className="property">
            <div className="property-image-container">
              {properties[2].images.map((img, imgIndex) => (
                <div
                  key={imgIndex}
                  className={`property-image ${imgIndex === thirdCardIndex ? 'active' : ''}`}
                >
                  <img src={img} alt={`Property 3`} />
                </div>
              ))}
            </div>
            <div className="property-details">
              <p>{properties[2].details[thirdCardIndex].title}</p>
              <p className="price">{properties[2].details[thirdCardIndex].price}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
