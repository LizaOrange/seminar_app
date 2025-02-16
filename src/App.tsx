import React from "react";
import SeminarsList from "./SeminarsList";
import './index.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Приложение для семинаров</h1>
      <SeminarsList />
    </div>
  );
};

export default App;
