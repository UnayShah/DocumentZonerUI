import { BrowserRouter } from 'react-router-dom';
import './App.css';
import DrawRect from './components/Rect';
import ListFiles from './pages/ListFiles';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        {/* <DrawRect fileId='69f74315-0862-46aa-b6a2-50897fc06628' /> */}
        <DrawRect fileId='87b9c73c-fe8e-4156-a2d1-1d3ebd18cdb9' />
        {/* <ListFiles /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;