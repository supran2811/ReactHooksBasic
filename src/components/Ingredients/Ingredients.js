import React , { useState , useReducer ,useCallback , useMemo , useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http-hook';

function ingredientReducer(currentIngredients , action) {
  switch(action.type) {
    case 'SET':
      return [...action.ingredients];
    case 'ADD':
      return [...currentIngredients,action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(({id}) => id !== action.id);
    default:
        throw new Error('Invalid action type!!');
  }
}

function Ingredients() {
  // const [ingredients , setIngredients ] = useState([]);
  // const [isLoading , setLoading] = useState(false);
  // const [error , setError ] = useState(null);

  const [ingredients , dispatch ] = useReducer(ingredientReducer,[]);
  const [ { isLoading , error , data , callbackFn ,clearError } , submitRequest ] = useHttp();
  
  useEffect(() => {
    if(callbackFn) {
      callbackFn(data);
    }
  } , [data,callbackFn])

  const addIngredient = useCallback((ingredient) => {
    submitRequest('https://pwagram-e77c1.firebaseio.com/ingredients.json','POST' , JSON.stringify(ingredient) , (resData) => {
      dispatch({type:'ADD',ingredient:{id:resData.name,...ingredient}});
    });
  },[submitRequest]);

  const setIngredientData = useCallback((ingredients) => {
    dispatch({type:'SET',ingredients});
  },[])

  const removeIngredient = useCallback((ingId) => {
    submitRequest(`https://pwagram-e77c1.firebaseio.com/ingredients/${ingId}.json`,'DELETE',null , () => {
      dispatch({type:'DELETE',id:ingId});
    })
  },[submitRequest]);

  const ingredientList = useMemo(() => {
    return  <IngredientList ingredients = {ingredients} onRemoveItem = {removeIngredient}/>
  },[ingredients,removeIngredient])
  console.log("Loading...",isLoading);
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm addIngredient = {addIngredient} loading = {isLoading}/>

      <section>
        <Search onIngredientLoaded = {setIngredientData}/>
       {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
