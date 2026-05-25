import React from 'react';

const ActivityCard = ({ activity }) => {
  return (
    <div className="activity-card">
      <div className="activity-card-image">
        <img src={`/${activity.image.replace('img/', '')}`} alt={activity.title} />
      </div>
      <div className="activity-card-content">
        <h4>{activity.title}</h4>
        <p>{activity.description}</p>
      </div>
    </div>
  );
};

export default ActivityCard;
