import './App.css';
import { Page } from './components/Page';
import { loadLanguage } from './helpers/multilang';
import translationFile from './translate.json'

function App() {
  loadLanguage(translationFile)
  return (
    <div className="App">
      <Page />
    </div>
  );
}

export default App;
