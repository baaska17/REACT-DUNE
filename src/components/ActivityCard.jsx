import React from 'react';

const ActivityCard = ({ activity }) => {
  return (
    <div className="activity-card">
      <img src={`/${activity.image.replace('img/', '')}`} alt={activity.title} />
      <div className="activity-info">
        <h4>{activity.title}</h4>
        <p>{activity.description}</p>
      </div>
    </div>
  );
};

export default ActivityCard;
