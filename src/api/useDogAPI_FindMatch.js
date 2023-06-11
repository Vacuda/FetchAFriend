import Axios from './Axios';
import { useState, useEffect } from 'react';

////////
export function useDogAPI_FindMatch(query_package) {

    /* API Call To Match A Dog To Adoption */

    //store query results
    const [query_results, set_query_results] = useState();

    //on search_params changing
    useEffect(() => {

        //early exit
        if (!query_package) return;

        //api call
        Axios.post('/dogs/match', query_package)
            .then(response => {

                //response package
                set_query_results(response.data);
            })
            .catch(error => {

                //handle error
                console.error(error);
            });

    }, [query_package]);

    //return response package
    return query_results;

}

export default useDogAPI_FindMatch;