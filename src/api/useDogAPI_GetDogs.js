import Axios from './Axios';
import { useState, useEffect } from 'react';

////////
export function useDogAPI_GetDogs(query_results) {

    /* API Call for using Search Query Object to Return Array of Dog Objects */

    //response package
    const [dog_list_package, set_dog_list_package] = useState();

    //on query results received
    useEffect(() => {

        //early exit
        if (!query_results) return;

        //store from prior call
        const total = query_results.total;
        const next = query_results.next;
        const prev = query_results.prev;

        //api call
        Axios.post('/dogs', query_results.resultIds)
            .then(response => {

                set_dog_list_package({
                    dogs: response.data,
                    total: total,
                    next: next,
                    prev: prev
                });
            })
            .catch(error => {

                //handle error

                console.error(error);
            });

    }, [query_results]);

    //return response package
    return dog_list_package;
   
}

export default useDogAPI_GetDogs;