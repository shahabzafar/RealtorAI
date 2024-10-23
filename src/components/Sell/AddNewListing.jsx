import React from 'react';
import '../../styles/Sell/AddNewListing.css';

const AddNewListing = () => {
  return (
    <section className="add-new-listing">
      <h3>Add New Property Listing</h3>
      <form>
        <div className="form-group">
          <input type="text" placeholder="Property Name" />
          <input type="text" placeholder="Description" />
        </div>
        <div className="form-group">
          <input type="number" placeholder="Price" />
          <input type="file" placeholder="Upload Image" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </section>
  );
};

export default AddNewListing;
