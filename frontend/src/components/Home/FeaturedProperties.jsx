import React, { useState } from 'react';
import { FaHeart, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../../styles/Home/FeaturedProperties.css';

const FeaturedProperties = () => {
  const properties = [
    {
      id: 1,
      address: "123 Maplewood Dr, Beverly Hills, CA 90210",
      title: "Luxury Modern Villa with Pool",
      price: 1850000,
      beds: 5,
      baths: 4.5,
      sqft: 4200,
      type: "House",
      isNew: true,
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2350&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2350&q=80",
        "https://images.unsplash.com/photo-1600607687644-afc93c535695?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2350&q=80"
      ]
    },
    {
      id: 2,
      address: "456 Ocean View Blvd, Malibu, CA 90265",
      title: "Beachfront Contemporary Home",
      price: 3950000,
      beds: 4,
      baths: 5,
      sqft: 3800,
      type: "House",
      isNew: false,
      images: [
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2350&q=80",
        "https://images.unsplash.com/photo-1604014237744-2f4ab7175c87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2350&q=80",
        "https://images.unsplash.com/photo-1600563438938-a9a27216b2d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2350&q=80"
      ]
    },
    {
      id: 3,
      address: "789 Mountain View Rd, Aspen, CO 81611",
      title: "Modern Mountain Retreat",
      price: 2750000,
      beds: 3,
      baths: 3.5,
      sqft: 3200,
      type: "Chalet",
      isNew: true,
      images: [
        "https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2350&q=80",
        "https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2350&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2350&q=80"
      ]
    },
    {
      id: 4,
      address: "1010 Park Avenue, New York, NY 10028",
      title: "Luxurious Central Park Penthouse",
      price: 7500000,
      beds: 4,
      baths: 4.5,
      sqft: 4000,
      type: "Condo",
      isNew: false,
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2350&q=80",
        "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2350&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2350&q=80"
      ]
    }
  ];

  const [activeIndices, setActiveIndices] = useState(properties.map(() => 0));
  const [favorites, setFavorites] = useState([]);

  const handlePrevImage = (index) => {
    setActiveIndices(prevIndices => {
      const newIndices = [...prevIndices];
      newIndices[index] = (newIndices[index] - 1 + properties[index].images.length) % properties[index].images.length;
      return newIndices;
    });
  };

  const handleNextImage = (index) => {
    setActiveIndices(prevIndices => {
      const newIndices = [...prevIndices];
      newIndices[index] = (newIndices[index] + 1) % properties[index].images.length;
      return newIndices;
    });
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="featured-properties">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Properties</h2>
          <p className="section-description">
            Explore our handpicked selection of premium properties
          </p>
        </div>
        
        <div className="property-filters">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">For Sale</button>
          <button className="filter-btn">For Rent</button>
          <button className="filter-btn">New Construction</button>
        </div>
        
        <div className="properties-grid">
          {properties.map((property, index) => (
            <div className="property-card" key={property.id}>
            <div className="property-image-container">
                <div 
                  className="property-image" 
                  style={{ backgroundImage: `url(${property.images[activeIndices[index]]})` }}
                >
                  {property.isNew && <span className="property-badge">New</span>}
                  <button 
                    className={`favorite-btn ${favorites.includes(property.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(property.id)}
                  >
                    <FaHeart />
                  </button>
                  <div className="image-nav">
                    <button className="nav-btn prev" onClick={() => handlePrevImage(index)}>
                      <FaChevronLeft />
                    </button>
                    <div className="image-indicators">
                      {property.images.map((_, imgIndex) => (
                        <span 
                          key={imgIndex} 
                          className={`indicator ${activeIndices[index] === imgIndex ? 'active' : ''}`}
                        />
              ))}
            </div>
                    <button className="nav-btn next" onClick={() => handleNextImage(index)}>
                      <FaChevronRight />
                    </button>
          </div>
                </div>
              </div>
              
              <div className="property-content">
                <div className="property-price">{formatPrice(property.price)}</div>
                <h3 className="property-title">{property.title}</h3>
                <p className="property-address">
                  <FaMapMarkerAlt className="icon" />
                  {property.address}
                </p>
                <div className="property-features">
                  <div className="feature">
                    <FaBed className="feature-icon" />
                    <span>{property.beds} Beds</span>
                  </div>
                  <div className="feature">
                    <FaBath className="feature-icon" />
                    <span>{property.baths} Baths</span>
            </div>
                  <div className="feature">
                    <FaRulerCombined className="feature-icon" />
                    <span>{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>
                <div className="property-footer">
                  <span className="property-type">{property.type}</span>
                  <a href="#" className="view-details">View Details</a>
                </div>
            </div>
            </div>
          ))}
          </div>
        
        <div className="view-all-container">
          <a href="/properties" className="btn-view-all">View All Properties</a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
