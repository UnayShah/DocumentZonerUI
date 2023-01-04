import './App.css';
import DrawRect from './components/Rect';
import ListFiles from './pages/ListFiles';

const App = () => {
  return (
    <div className="h-full w-full p-11">
      {/* <DrawRect /> */}
      <ListFiles />
    </div>
  );
}

export default App;