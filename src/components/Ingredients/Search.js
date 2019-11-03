import React,{useState,useEffect,useRef} from 'react';

import Card from '../UI/Card';
import useHttp from '../../hooks/http-hook';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

const Search = React.memo(props => {
  const { onIngredientLoaded } = props;
  const inputRef = useRef()
  const [ filterValue , setFilterValue ] = useState('');
  const [{ isLoading , error , data , callbackFn ,clearError } , sendRequest ] = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if(filterValue === inputRef.current.value) {
        const query = filterValue.length === 0 ? '' : `?orderBy="title"&equalTo="${filterValue}"`;

        sendRequest('https://pwagram-e77c1.firebaseio.com/ingredients.json'+query , 'GET',null, (resData) => {
          const ingListData = Object.keys(resData).map(key => {
            return { id:key , ...resData[key]}
          });
         onIngredientLoaded(ingListData);
        });
      }
    },500);
    return () => {
      clearTimeout(timer);
    }
  },[filterValue,onIngredientLoaded,sendRequest]);

  useEffect(() => {
    if(callbackFn) {
      callbackFn(data);
    }
  },[data,callbackFn])

  return (
    <section className="search">
      {error && <ErrorModal onClose = {clearError}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading..</span>}
          <input type="text" 
            value={filterValue} 
            ref={inputRef}
            onChange={e => setFilterValue(e.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
