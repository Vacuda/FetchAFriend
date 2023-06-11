import Axios from './Axios';
import { useState, useEffect } from 'react';

////////
export function useDogAPI_Breeds() {

    /* Returns Array of All Breeds */

    //response package
    const [breeds, set_breeds] = useState(null);

    //on startup, once
    useEffect(() => {

        //api call
        Axios.get('/dogs/breeds')
            .then(response => {
                set_breeds(response.data);
            })
            .catch(error => {
                console.error(error);
            });

    }, []);

    //return breeds
    return breeds;
}

export default useDogAPI_Breeds;