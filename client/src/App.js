import './App.css';
import { Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage/LandingPage';
import Home from './Components/Home/Home';
import RecipeDetail from './Components/RecipeDetail/RecipeDetail';
import CreateRecipe from './Components/Form/Form';
import About from './Components/About/About';

function App() {
  return (
    <div className="App">
      <Route exact path='/' component={LandingPage} />
      <Route path='/home' component={Home} />
      <Route path='/RecipeDetail/:id' component={RecipeDetail}/>
      <Route path='/create' component={CreateRecipe}/>
      <Route path='/About' component={About}/>
    </div>
  );
}

export default App;
