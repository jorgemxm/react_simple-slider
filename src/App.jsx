import React from 'react';
import Slider from './Slider';
import SliderClass from './SliderClass';

import './App.css';

function App() {
  return (
    <div className="App">
        <Slider autoPlayTimer={2500} />
        <SliderClass autoPlayTimer={2500} />
    </div>
  );
}

export default App;
