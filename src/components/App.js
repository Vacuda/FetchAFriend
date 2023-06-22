import '../styles/App.css';
import Login from './Login';
import Header from './Header';
import ShelterSearch from './ShelterSearch';
import DogResults from './DogResults';
import MatchResults from './MatchResults';
import Footer from './Footer';
import { breed_selection_object } from '../common/utils.js'
import { favorites_map } from '../common/utils.js'
import { rc_ResultsContext } from '../common/utils.js'
import { useState } from 'react';





//return content
function App() {

    //USER INFO
    const [user_name, set_user_name] = useState("");
    const [user_email, set_user_email] = useState("");
    const [user_is_logged_in, set_user_is_logged_in] = useState(false);

    //show hide modules
    const [showLogin, set_showLogin] = useState(true);
    const [showShelterSearch, set_showShelterSearch] = useState(false);
    const [showDogResults, set_showDogResults] = useState(false);
    const [showMatchResults, set_showMatchResults] = useState(false);

    //successful login function
    const successful_login = (login_attempt_info) => {

        //double check
        if (login_attempt_info.is_successful) {
            set_user_is_logged_in(true);
            set_user_email(login_attempt_info.user_email);
            set_user_name(login_attempt_info.user_name);

            set_showLogin(false);
            set_showShelterSearch(true);
            set_showDogResults(true);
        }
    }

    //log out
    const handleLogOut = () => {

        set_user_is_logged_in(false);
        set_user_email("");
        set_user_name("");

        //clear objects
        breed_selection_object.length = 0;
        favorites_map.clear();

        set_showLogin(true);
        set_showShelterSearch(false);
        set_showDogResults(false);
        set_showMatchResults(false);
        set_trigger_matchresults(false);
    }

    //successful search query
    const successful_dog_list_package = (dog_list_package) => {

        set_dog_list_package(dog_list_package);
    }

    //search query
    const [dog_list_package, set_dog_list_package] = useState();

    //ADD TO FAVORITES
    const change_dog_as_favorites = (data) => {

        //already favorited
        if (favorites_map.has(data.id)) {
            favorites_map.delete(data.id);
        }
        //not favorited
        else {
            favorites_map.set(data.id, true);
        }

        //if on favorites
        if (data.context === rc_ResultsContext.rc_FAVORITES) {

            //resubmit search object
            set_resubmit_search({ context: data.context });
        }

    }

    //Resubmit Search
    const [resubmit_search, set_resubmit_search] = useState();

    const handleResubmitSearch = (data) => {

        set_resubmit_search({
            context: data.context,
            search: data.search
        });

    }

    //FIND A MATCH TRIGGER
    const [trigger_matchresults, set_trigger_matchresults] = useState();
    const match_submit = () => {

        set_trigger_matchresults(true);
        set_showShelterSearch(false);
        set_showDogResults(false);
        set_showMatchResults(true);

        //scroll top
        document.documentElement.scrollTop = 0;

    }

    //Adopt Again
    const trigger_adoptagain = () => {

        set_trigger_matchresults(false);
        set_showShelterSearch(true);
        set_showDogResults(true);
        set_showMatchResults(false);

        //scroll top
        document.documentElement.scrollTop = 0;

    }

    /* APP CONTENT */
    const AppContent =

            <div className="mycontainer">

                <>
                    <Header handleLogOut={handleLogOut} user_is_logged_in={user_is_logged_in} user_name={user_name} trigger_matchresults={trigger_matchresults} />
                </>

                <>
                    {showLogin && (<Login successful_login={successful_login} />)}
                    {showShelterSearch && (<ShelterSearch successful_dog_list_package={successful_dog_list_package} resubmit_search={resubmit_search} />)}
                    {showDogResults && (<DogResults dog_list_package={dog_list_package} change_dog_as_favorites={change_dog_as_favorites} resubmit_search={handleResubmitSearch} match_submit={match_submit} />)}
                    {showMatchResults && (<MatchResults trigger_matchresults={trigger_matchresults} trigger_adoptagain={trigger_adoptagain} user_email={user_email} user_name={user_name}/>)}
                </>  

                <>
                    <Footer />
                </>
            </div>


    return (AppContent)
}

export default App;
