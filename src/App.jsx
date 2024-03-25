import ShortOutcome from './components/ShortOutcome'; 
import PassAccu from './components/PassAccu';
import PassByLength from './components/PassByLength';
import ShortsOnTarget from './components/ShortsOnTarget';
import CompletedDribbles from './components/CompletedDribbles';
import DribblesByLength from './components/DribblesByLength';
import DribblePercentage from './components/DribblePercentage';
import DribblesByDirection from './components/DribblesByDirection';
import Fouls from './components/Fouls';
import BookingsGraph from './components/BookingsGraph';
import SavesByType from './components/SavesByType';
import OffsideGraph from './components/OffsideGraph';
import DistributionByType from './components/DistributionByType';
import Corners from './components/Corners';
import CsvProvider from './components/Context';
import GkCompletion from './components/GkCompletion';
import GtCompletion from './components/GtCompletion';






function App() {
  return (
    <CsvProvider>
      <PassByLength />
      <PassAccu />
      <ShortOutcome /> 
      <ShortsOnTarget /> 
      <CompletedDribbles />
      <DribblesByLength />
      <DribblePercentage />
      <DribblesByDirection />
      <Fouls />
      <BookingsGraph />
      <SavesByType />
      <OffsideGraph />
      <DistributionByType />
      <Corners />
      <GkCompletion />
      <GtCompletion />

    </CsvProvider>
  );
}

export default App;