import '../styles/DogResults.css';
import DogWindow from './DogWindow';
import { useState, useEffect } from 'react';
import triangle from '../images/triangle.png'
import { rc_ResultsContext } from '../common/utils.js'
import { determine_page_splits } from '../common/utils.js'

//return content
function DogResults(data) {


    const [dog_window_list, set_dog_window_list] = useState(null);

    const contextbutton_results = "Results";
    const contextbutton_favorites = "Favorites";
    const [contextbutton_text, set_contextbutton_text] = useState();
    const contexttitle_results = " - Search Results -";
    const contexttitle_favorites = "- Favorite Dogs -";
    const [results_context_title, set_results_context_title] = useState();
    const contextbutton_classname_results = "context_button_results";
    const contextbutton_classname_favorites = "context_button_favorites";
    const [contextbutton_classname, set_contextbutton_classname] = useState();

    const L_triangle_active = "navbar_wedge_L";
    const L_triangle_not_active = "navbar_wedge_L_desat";
    const R_triangle_active = "navbar_wedge_R";
    const R_triangle_not_active = "navbar_wedge_R_desat";

    const [L_triangle, set_L_triangle] = useState(L_triangle_not_active);
    const [R_triangle, set_R_triangle] = useState(R_triangle_not_active);

    const [total_number_pages_search, set_total_number_pages_search] = useState(0);
    const [current_page_search, set_current_page_search] = useState(0);

    const [window_context, set_window_context] = useState(rc_ResultsContext.rc_RESULTS);
    const message_noresults = "- Please alter your dog search -";
    const message_nofavorites = "- Click on a dog to set them as a favorite -";
    const [null_message, set_null_message] = useState();

    const [showMatchButton, set_showMatchButton] = useState(false);


    const handleFavoriting = (id) => {

        data.change_dog_as_favorites({
            id: id,
            context: window_context
        })
    }

    //dog list package has changed
    useEffect(() => {

        //early exit
        if (!data.dog_list_package) { 
            set_dog_window_list(null);

            set_total_number_pages_search(0);
            set_current_page_search(0);
            return;
        } 

        //none check
        if (data.dog_list_package.dogs.length === 0) {
            set_L_triangle(L_triangle_not_active);
            set_R_triangle(R_triangle_not_active);
            set_dog_window_list(null);
            set_showMatchButton(false);

            set_total_number_pages_search(0);
            set_current_page_search(0);

            return;
        }
        else {
            if (window_context === rc_ResultsContext.rc_FAVORITES)
                set_showMatchButton(true);
        }

        //determine page splits
        const page_split_object = determine_page_splits(data.dog_list_package);
        set_total_number_pages_search(page_split_object.total_pages);
        set_current_page_search(page_split_object.current_page);

        //set L triangle activity
        set_L_triangle(data.dog_list_package.prev ? L_triangle_active : L_triangle_not_active)

        //set R triangle activity - last page check
        set_R_triangle(page_split_object.total_pages === page_split_object.current_page ? R_triangle_not_active : R_triangle_active);

        //create list according to dog 
        set_dog_window_list(data.dog_list_package.dogs.map(dog =>

            <DogWindow dogdata={dog} handleFavoriting={handleFavoriting} key={dog.id} />
        ));

    }, [data.dog_list_package]);

    const handleContextSwitching = () => {

        //if on search
        if (window_context === rc_ResultsContext.rc_RESULTS) {
            //set to favorites
            set_window_context(rc_ResultsContext.rc_FAVORITES);

            //resubmit with just context
            data.resubmit_search({
                context: rc_ResultsContext.rc_FAVORITES,
            });
        }
        //if on favorites
        else {
            //set to search
            set_window_context(rc_ResultsContext.rc_RESULTS);

            //resubmit with just context
            data.resubmit_search({
                context: rc_ResultsContext.rc_RESULTS,
            });
        }
    }

    //context has changed
    useEffect(() => {


        //if on search
        if (window_context === rc_ResultsContext.rc_RESULTS) {
            set_contextbutton_classname(contextbutton_classname_favorites);
            set_contextbutton_text(contextbutton_favorites);
            set_results_context_title(contexttitle_results);
            set_null_message(message_noresults);
            set_showMatchButton(false);
        }
        //if on favorites
        else {
            set_contextbutton_classname(contextbutton_classname_results);
            set_contextbutton_text(contextbutton_results);
            set_results_context_title(contexttitle_favorites);
            set_null_message(message_nofavorites);
        }


    }, [window_context]);

    /* PAGE MANAGEMENT */

    const handleDirectionalLeft = () => {

        //if active
        if (L_triangle === L_triangle_active) {

            //resubmit search to prev
            data.resubmit_search({
                context: window_context,
                search: data.dog_list_package.prev
            });
        }
    }

    const handleDirectionalRight = () => {

        //if active
        if (R_triangle === R_triangle_active) {

            //resubmit search to next
            data.resubmit_search({
                context: window_context,
                search: data.dog_list_package.next
            });
        }
    }

    const handleMatchSubmit = () => {

        data.match_submit();

    }


    /* DOG RESULTS CONTENT */
    return (

        <div className="DogResultsContainer">


            <div className="navbar">
                <div className="navbar_spacer">
                </div>
                <div className="navbar_directional">
                    <img className={L_triangle} src={triangle} onClick={handleDirectionalLeft} alt="Back Directional Arrow"></img>
                </div>
                <div className="navbar_context">
                    <div className={contextbutton_classname} onClick={handleContextSwitching}>{contextbutton_text}</div>
                </div>
                <div className="navbar_directional">
                    <img className={R_triangle} src={triangle} onClick={handleDirectionalRight} alt="Forward Directional Arrow"></img>
                </div>
                <div className="navbar_spacer">
                    <div className="navbar_page_totals">{current_page_search} / {total_number_pages_search}</div>
                </div>
            </div>

            {showMatchButton && 
                <div className="findmatch_container">
                    <div className="findmatch_button" onClick={handleMatchSubmit}>Adopt A Favorite!</div>
                </div>
            }

            <div className="results_context_title">{results_context_title}
            </div>

            {!dog_window_list && <div className="no_results_message">{null_message}</div>}

            <div>
                {dog_window_list}
            </div>
        </div>
    )
}

export default DogResults;



