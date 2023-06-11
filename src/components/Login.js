import '../styles/Login.css';
import { useDogAPI_Login } from '../api/useDogAPI_Login.js'
import { useState, useEffect, useRef } from 'react';

function Login(data) {

    /* STATE VARIABLES */
    const [entered_data, set_entered_data] = useState();
    const [isLoading, set_isLoading] = useState(false);
    const [isError, set_isError] = useState(false);
    const inputRef = useRef(null);
    const [current_name_text, set_current_name_text] = useState("");
    const [current_email_text, set_current_email_text] = useState("");

    /* API CALL AND RESULTS */
    const login_attempt_info = useDogAPI_Login(entered_data);

    /* API CALL RESPONSE HANDLING */
    useEffect(() => {

        //early exit
        if (!login_attempt_info) return;

        //clear fields
        set_current_name_text("");
        set_current_email_text("");

        //success check
        if (login_attempt_info.is_successful) {
            set_isLoading(false);

            //call parent
            data.successful_login(login_attempt_info);
        }
        else {
            set_isError(true);
            set_isLoading(false);

            //turn focus off button
            inputRef.current.focus();
        }

    }, [login_attempt_info]);

    /* HANDLING SUBMISSION */
    const handleSubmit = (event) => {
        event.preventDefault();

        set_isError(false);
        set_isLoading(true);

        //store data
        set_entered_data({
            name: event.target.user_name.value,
            email: event.target.user_email.value
        });
    }

    /* LOGIN CONTENT */
    return (

        < div >
            <h1>Welcome!</h1>

            <h3>Please log in before searching</h3>

            <div className="login_form_container">
                <form onSubmit={handleSubmit}>

                    <label className="login_info">Name:</label>
                    <input type="text" className="login_textbox" id="user_name" value={current_name_text} onChange={(e) => set_current_name_text(e.target.value)}  ref={inputRef}/>

                    <div className="login_spacer"></div>

                    <label className="login_info">Email:</label>
                    <input type="text" className="login_textbox" id="user_email" value={current_email_text} onChange={(e) => set_current_email_text(e.target.value)} />
                
                    <div className="contextbox">
                        {isLoading && <div className="messagebox"> - - - - - Loading - - - - -</div>}
                        {isError && <div className="errorbox">* Login Error *</div>}
                    </div>

                    <div className="signinbox">
                        <input className="button_signin" type="submit" value="SIGN IN"/>
                    </div>

                </form>

            </div>

        </div >

    )
}

//footer
export default Login;