import "./App.css";
import React from 'react';
import VTKViewer from './components/VTKViewer';

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="h-full w-full border-2 border-gray-400 rounded shadow-lg">
        <VTKViewer />
      </div>
    </div>
  );
};

export default App;
