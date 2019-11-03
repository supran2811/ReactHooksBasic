import { useReducer , useCallback } from 'react';

function httpReducer(state,action) {
    switch(action.type) {
      case 'PENDING':
        return {...state , isLoading:true , data: null ,callbackFn:null};
      case 'SUCCESS':
        return {...state , isLoading:false , data: action.response ,callbackFn: action.callbackFn };
      case 'ERROR':
        return {error: action.message , isLoading: false};
      case 'CLEAR':
        return {...state , error: null};
      default:
          throw new Error('Invalid action type!!');
    }
  }

export default function useHttp() {
    const [{isLoading,error,data,callbackFn} , dispatchHttp] 
        = useReducer(httpReducer,
                {   isLoading:false , 
                    error:null,
                    data:null,
                    callbackFn: null
                });
    const clearError = useCallback(() => {
        dispatchHttp({type:'CLEAR'});
    },[])            
    const sendRequest = useCallback((url,method,body,callbackFn) => {
        dispatchHttp({type:'PENDING'});
        fetch(url , {
            method,
            body,
            headers:{
                'Content-Type' : 'application/json'
            }
        }).then(r => r.json())
        .then(response => {
          dispatchHttp({type:'SUCCESS', response ,callbackFn})
        }).catch(error => {
          dispatchHttp({type:'ERROR',message:'Unable to load data!!'});
        });
    },[]);

    return [{ isLoading , error , data , callbackFn ,clearError} , sendRequest ];

}