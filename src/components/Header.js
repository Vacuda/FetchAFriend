import '../styles/Header.css';
import logo_pic from '../images/logo_pic.png'
import logo_text from '../images/logo_text.png'
import { useState, useEffect } from 'react';



//return content
function Header(data) {

    //TEXT VARIABLES
    const title_search = "- Search our Friends -";
    const title_login = "- Log In -";
    const title_matched = "- Match Found! -";
    const greeting_blank = "";
    const greeting_hello = "Hello, ";


    //TEXT CONTAINERS
    const [greeting, set_greeting] = useState(greeting_blank);
    const [title, set_title_name] = useState(title_login);

    //LOGIN CHANGES
    useEffect(() => {

        //logged out
        if (!data.user_is_logged_in) {
            return;
        }

        //logged in
        set_title_name(title_search);

    }, [data.user_is_logged_in]);

    //GREETING CHANGES
    useEffect(() => {

        //logged out
        if (data.user_name === "") {
            set_greeting(greeting_blank);
            return;
        }

        //logged in
        set_greeting(greeting_hello + data.user_name);

    }, [data.user_name]);

    //Match Found
    useEffect(() => {

        //headline change
        if (data.trigger_matchresults) {
            set_title_name(title_matched);
        }
        else if (title == title_matched) {
            set_title_name(title_search);
        }

    }, [data.trigger_matchresults]);

    //HANDLE LOGOUT
    const handleLogOut = () => {

        data.handleLogOut();
        set_greeting(greeting_blank);
        set_title_name(title_login);
    }


    /* Header CONTENT */
    const HeaderContent =

        <div className="HeaderArea">

            <div className="LogoArea">
                <img className="logo_pic_img" alt="Framed Picture Of Dog" src={logo_pic} ></img>
                <img className="logo_text_img" alt ="Fetch A Friend Logo" src={logo_text} ></img>
            </div>

            <div className="MenuArea">
                <div className="greeting_container">
                    <div className="greeting_box_rightleaning">
                        <div className="greeting">{greeting}</div>
                        {greeting && (<button className="logout_button" onClick={handleLogOut}>LOG OUT</button>)}
                    </div>
                </div>

            </div>

            <div className="TitleArea">
                <div className="division"></div>
                <div className="title_wrap">
                    <div className="title">{title}</div>
                </div>
                <div className="division"></div>
            </div>


        </div>

    return (HeaderContent);

    
}




//footer
export default Header;
