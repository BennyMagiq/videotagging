import React from 'react';
import '../styles/DetailView.css';

// Import all stat components
import ShortOutcome from './ShortOutcome';
import PassAccu from './PassAccu';
import PassByLength from './PassByLength';
import ShortsOnTarget from './ShortsOnTarget';
import CompletedDribbles from './CompletedDribbles';
import DribblesByLength from './DribblesByLength';
import DribblePercentage from './DribblePercentage';
import DribblesByDirection from './DribblesByDirection';
import Fouls from './Fouls';
import BookingsGraph from './BookingsGraph';
import SavesByType from './SavesByType';
import OffsideGraph from './OffsideGraph';
import DistributionByType from './DistributionByType';
import Corners from './Corners';
import GkCompletion from './GkCompletion';
import GtCompletion from './GtCompletion';

const STAT_COMPONENTS = {
  'pass-by-length': { title: 'Pass by Length', component: PassByLength },
  'pass-accuracy': { title: 'Pass Accuracy', component: PassAccu },
  'shot-outcome': { title: 'Shot Outcome', component: ShortOutcome },
  'shots-on-target': { title: 'Shots on Target', component: ShortsOnTarget },
  'completed-dribbles': { title: 'Completed Dribbles', component: CompletedDribbles },
  'dribbles-by-length': { title: 'Dribbles by Length', component: DribblesByLength },
  'dribble-percentage': { title: 'Dribble Percentage', component: DribblePercentage },
  'dribbles-by-direction': { title: 'Dribbles by Direction', component: DribblesByDirection },
  'fouls': { title: 'Fouls', component: Fouls },
  'bookings': { title: 'Bookings', component: BookingsGraph },
  'saves-by-type': { title: 'Saves by Type', component: SavesByType },
  'offside': { title: 'Offside', component: OffsideGraph },
  'distribution': { title: 'Distribution by Type', component: DistributionByType },
  'corners': { title: 'Corners', component: Corners },
  'gk-completion': { title: 'GK Completion', component: GkCompletion },
  'gt-completion': { title: 'Goal Threat Completion', component: GtCompletion },
};

export default function DetailView({ statId, onBack }) {
  const stat = STAT_COMPONENTS[statId];

  if (!stat) {
    return (
      <div className="detail-view">
        <button className="back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <p>Statistic not found</p>
      </div>
    );
  }

  const StatComponent = stat.component;

  return (
    <div className="detail-view">
      <button className="back-btn" onClick={onBack}>
        ← Back to Dashboard
      </button>
      <h1 className="detail-title">{stat.title}</h1>
      <div className="detail-content">
        <StatComponent />
      </div>
    </div>
  );
}
