import Axios from './Axios';
import { useState, useEffect } from 'react';

////////
export function useDogAPI_Search(query_package) {

    /* API Call for Search Query Object */

    //store query results
    const [query_results, set_query_results] = useState();

    //on search_params changing
    useEffect(() => {

        //early exit
        if (!query_package) return;

        //if search is already present
        if (query_package.search) {

            //paginated api call
            Axios.get(query_package.search)
                .then(response => {

                    //response package
                    set_query_results(response.data);

                })
                .catch(error => {

                    //handle error
                    console.error(error);
                });
        }
        //normal search
        else {
            //api call
            Axios.get('/dogs/search', query_package)
                .then(response => {

                    //response package
                    set_query_results(response.data);

                })
                .catch(error => {

                    //handle error
                    console.error(error);
                });
        }

    }, [query_package]);

    //return response package
    return query_results;

}

export default useDogAPI_Search;