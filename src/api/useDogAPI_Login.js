import Axios from './Axios';
import { useState, useEffect } from 'react';

////////
export function useDogAPI_Login(entered_data) {

    /* Takes Login Data, Returns Login Yes/No and Auth Cookie */

    //response package
    const [login_attempt_info, set_login_attempt_info] = useState(null);

    //on entered_data changing
    useEffect(() => {

        //early exit
        if (!entered_data) return;

        //api call
        Axios.post('/auth/login', entered_data)
            .then(response => {

                //response package
                set_login_attempt_info({
                    is_successful: true,
                    user_name: entered_data.name,
                    user_email: entered_data.email
                });
            })
            .catch(error => {

                //response package
                set_login_attempt_info({
                    is_successful: false,
                    user_name: null,
                    user_email: null
                });

                console.error(error);
            });

    }, [entered_data]);

    //return response package
    return login_attempt_info;
}

export default useDogAPI_Login;