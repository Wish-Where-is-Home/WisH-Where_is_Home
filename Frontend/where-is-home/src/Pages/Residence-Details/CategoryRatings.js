import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar, faStarHalfAlt as fasStarHalfAlt, faStar as farStar } from '@fortawesome/free-solid-svg-icons';
import './CategoryRatings.css';

const CategoryRatings = ({ categoryAverages }) => {
  const renderStars = (rating) => {
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest half
    const fullStars = Math.floor(roundedRating);
    const halfStar = roundedRating - fullStars === 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {Array(fullStars).fill().map((_, index) => (
          <FontAwesomeIcon key={`full-${index}`} icon={fasStar} className="star full" />
        ))}
        {halfStar ? <FontAwesomeIcon icon={fasStarHalfAlt} className="star half" /> : null}
        {Array(emptyStars).fill().map((_, index) => (
          <FontAwesomeIcon key={`empty-${index}`} icon={farStar} className="star empty" />
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
