import React from 'react';
import './CategoryRatings.css';

const CategoryRatings = ({ categoryAverages }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {Array(fullStars).fill().map((_, index) => (
          <span key={index} className="star full">&#9733;</span>
        ))}
        {halfStar ? <span className="star half">&#9733;</span> : null}
        {Array(emptyStars).fill().map((_, index) => (
          <span key={index} className="star empty">&#9733;</span>
        ))}
      </>
    );
  };

  return (
    <div className="category-ratings-widget">
      {Object.entries(categoryAverages).map(([category, { averageRating, totalReviewCount }]) => (
        <div key={category} className="category-rating-item">
          <div className="category-name">{category}</div>
          <div className="category-rating">
            <div className="stars">{renderStars(averageRating)}</div>
            <div className="rating-count">
              {totalReviewCount} {totalReviewCount === 1 ? 'Rating' : 'Ratings'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
  

export default CategoryRatings;
