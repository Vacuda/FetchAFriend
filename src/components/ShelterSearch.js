import '../styles/ShelterSearch.css';
import { useDogAPI_Breeds } from '../api/useDogAPI_Breeds.js'
import { useDogAPI_Search } from '../api/useDogAPI_Search.js'
import { useDogAPI_GetDogs } from '../api/useDogAPI_GetDogs.js'
import { Build_PossibleBreedArray } from '../common/utils.js'
import { create_possible_breed_list } from '../common/utils.js'
import { breed_selection_object } from '../common/utils.js'
import { number_of_results_per_page } from '../common/utils.js'
import { favorites_map } from '../common/utils.js'
import { rc_ResultsContext } from '../common/utils.js'
import { useState, useEffect, useRef } from 'react';
import triangle from '../images/triangle.png'

////////
function ShelterSearch(data) {

    //stored breed list
    const [possible_breed_list, set_possible_breed_list] = useState();

    /* API CALL AND RESULTS */
    const all_breeds = useDogAPI_Breeds(null);

    //on startup, once
    useEffect(() => {

        if (!all_breeds) return;

        //fill object
        for (const breed of all_breeds) {

            //build and add to object
            breed_selection_object.push(
                {
                    name: breed,
                    possible_breed: true,
                    chosen_breed: false,
                    on_change_function_ref: on_change_function_ref
                }
            );
        }

        //set new list
        set_possible_breed_list(create_possible_breed_list(breed_selection_object));

    }, [all_breeds]);

    //when a search is resubmitted
    useEffect(() => {


        //early exit
        if (!data.resubmit_search) return;

        //if query package already present
        if (data.resubmit_search.search) {

            set_query_package({
                search: data.resubmit_search.search
            })
            return;
        } 

        //if on results
        if (data.resubmit_search.context === rc_ResultsContext.rc_RESULTS) {
            handleSearchSubmit();
        }
        //if on favorites
        else {
            handleSearchSubmit_Favorites();
        }


    }, [data.resubmit_search]);

    //checkbox change
    const on_checkbox_change_function = (data) => {

        //loop breed_selection_object
        for (const obj of breed_selection_object) {

            if (obj.name === data.name) {
                obj.chosen_breed = data.checked;
            }

        }

        //submit search
        handleSearchSubmit();
    }

    //store reference to this state's function to use in building breed list
    const on_change_function_ref = useRef();
    on_change_function_ref.current = on_checkbox_change_function;

    //handle closing search
    const size_open = '390px';
    const size_closed = '50px';
    const caret_open = 'translateY(-50%) rotate(0deg)'
    const caret_closed_L = 'translateY(-50%) rotate(-90deg)'
    const caret_closed_R = 'translateY(-50%) rotate(90deg)'
    const [search_bar_size, set_search_bar_size] = useState(size_open);
    const [caret_rotation_L, set_caret_rotation_L] = useState(caret_open);
    const [caret_rotation_R, set_caret_rotation_R] = useState(caret_open);

    const handleShelterBarClick = () => {
        //toggle
        set_search_bar_size(search_bar_size === size_open ? size_closed : size_open);
        set_caret_rotation_L(caret_rotation_L === caret_open ? caret_closed_L : caret_open);
        set_caret_rotation_R(caret_rotation_R === caret_open ? caret_closed_R : caret_open);
    }

    //search textbox handling
    const [breed_search_input, set_breed_search_input] = useState("");
    useEffect(() => {

        //get list
        const PossibleBreedArray = Build_PossibleBreedArray({ input: breed_search_input, all_breeds: all_breeds });

        //early exit
        if (!PossibleBreedArray) return;

        //loop breed_selection_object
        for (const obj of breed_selection_object) {

            let match_trigger = false;

            //loop possible breed array
            for (const breed of PossibleBreedArray) {

                //if matched
                if (breed === obj.name) {

                    match_trigger = true;
                    break;
                }
            }

            //match found
            if (match_trigger) {
                obj.possible_breed = true;
            }
            //not matched
            else {
                obj.possible_breed = false;
            }
        }

        //set new list
        set_possible_breed_list(create_possible_breed_list(breed_selection_object));

    }, [breed_search_input]);

    /* AGE CULTIVATION */
    const [min_age_input, set_min_age_input] = useState("");
    const [max_age_input, set_max_age_input] = useState("");

    //when age inputs are changed
    useEffect(() => {

        //early exit
        if (!min_age_input) return;

        handleSearchSubmit();

    }, [min_age_input]);

    //when age input is changed
    useEffect(() => {

        //early exit
        if (!max_age_input) return;

            handleSearchSubmit();

    }, [max_age_input]);



    /* SORT CULTIVATION */

    const search_sort_age_asc = "age:asc";
    const search_sort_age_desc = "age:desc";
    const search_sort_breed_asc = "breed:asc";
    const search_sort_breed_desc = "breed:desc";
    const search_sort_name_asc = "name:asc";
    const search_sort_name_desc = "name:desc";
    const wedge_up_deactive = "SortWedge_Up_Deactive";
    const wedge_down_deactive = "SortWedge_Down_Deactive";
    const wedge_up_active = "SortWedge_Up";
    const wedge_down_active = "SortWedge_Down";
    const [wedge_age_up, set_wedge_age_up] = useState(wedge_up_deactive);
    const [wedge_age_down, set_wedge_age_down] = useState(wedge_down_deactive);
    const [wedge_breed_up, set_wedge_breed_up] = useState(wedge_up_deactive);
    const [wedge_breed_down, set_wedge_breed_down] = useState(wedge_down_deactive);
    const [wedge_name_up, set_wedge_name_up] = useState(wedge_up_deactive);
    const [wedge_name_down, set_wedge_name_down] = useState(wedge_down_deactive);
    const [search_sort, set_search_sort] = useState(search_sort_breed_asc);

    const handleSearchSorting = (search_pressed) => {
        set_search_sort(search_pressed);
    }

    //this causes
    useEffect(() => {

        //early exit
        if (!search_sort) return;

        //set wedges state
        set_wedge_age_up(search_sort === search_sort_age_asc ? wedge_up_active : wedge_up_deactive);
        set_wedge_age_down(search_sort === search_sort_age_desc ? wedge_down_active : wedge_down_deactive);
        set_wedge_breed_up(search_sort === search_sort_breed_asc ? wedge_up_active : wedge_up_deactive);
        set_wedge_breed_down(search_sort === search_sort_breed_desc ? wedge_down_active : wedge_down_deactive);
        set_wedge_name_up(search_sort === search_sort_name_asc ? wedge_up_active : wedge_up_deactive);
        set_wedge_name_down(search_sort === search_sort_name_desc ? wedge_down_active : wedge_down_deactive);

        handleSearchSubmit();
      
    }, [search_sort]);

    /* HANDLING SUBMISSION FLOW */

    const handleSearchSubmit = () => {

        //get agemin and agemax
        let ageMin = 0;
        let ageMax = 30;

        //get ageMin
        if (parseInt(min_age_input)) {
            let possible_num = parseInt(min_age_input);
            possible_num = possible_num < 0 ? 0 : possible_num;
            possible_num = possible_num > 30 ? 30 : possible_num;
            ageMin = possible_num;
        }

        //get ageMax
        if (parseInt(max_age_input)) {
            let possible_num = parseInt(max_age_input);
            possible_num = possible_num < 0 ? 0 : possible_num;
            possible_num = possible_num > 30 ? 30 : possible_num;
            ageMax = possible_num;
        }

        //array to build
        let breeds_to_search = [];

        //loop breed_selection_object
        for (const obj of breed_selection_object) {

            //if open for selecting
            if (obj.chosen_breed) {
                breeds_to_search.push(obj.name);
            }
        }

        //create query package
        const local_query_package = {
            params: {
                breeds: breeds_to_search,
                size: number_of_results_per_page,
                ageMin: ageMin,
                ageMax: ageMax,
                sort: search_sort
            }
        };

        set_query_package(local_query_package);
    }

    const handleClearSearchSubmit_ButtonPress = () => {

        //clear search sort
        set_search_sort("");

        //set wedges state to deactive
        set_wedge_age_up(wedge_up_deactive);
        set_wedge_age_down(wedge_down_deactive);
        set_wedge_breed_up(wedge_up_deactive);
        set_wedge_breed_down(wedge_down_deactive);
        set_wedge_name_up(wedge_up_deactive);
        set_wedge_name_down(wedge_down_deactive);

        //clear age limits
        set_min_age_input("");
        set_max_age_input("");

        //clear breed search input
        set_breed_search_input("");

        //loop breed_selection_object
        for (const obj of breed_selection_object) {

            //make all breeds possible
            obj.possible_breed = true;

            //make no breeds chosen
            obj.chosen_breed = false;
        }

        //set new list
        set_possible_breed_list(create_possible_breed_list(breed_selection_object));

        //clear dog list
        set_dog_list_package();
    }

    const handleSearchSubmit_Favorites = () => {

        let favorite_dog_ids = [];

        //loop favorite map
        for (let key of favorites_map.keys()) {

            favorite_dog_ids.push(key);
        }

        //create query package
        const local_query_results_package = {

            resultIds: favorite_dog_ids,
            total: favorite_dog_ids.length,
            next: null,
            prev: null
        };

        set_query_results_to_use(local_query_results_package);
    }

    const [query_package, set_query_package] = useState();
    const query_results = useDogAPI_Search(query_package);

    //query results has changed
    useEffect(() => {

        set_query_results_to_use(query_results);

    }, [query_results]);


    const [query_results_to_use, set_query_results_to_use] = useState();
    const raw_dog_list_package = useDogAPI_GetDogs(query_results_to_use);

    //raw_dog_list_package has changed
    useEffect(() => {

        /* This list needs to be appended to add the isFavorited property */

        //early exit
        if (!raw_dog_list_package) return;

        //loop dogs
        for (let dog of raw_dog_list_package.dogs) {

            //find if favorite
            const ThisDogIsFavorited = favorites_map.has(dog.id);

            //add favorite property to object
            Object.assign(dog, { isFavorited: ThisDogIsFavorited });
        }

        //send in altered list
        set_dog_list_package(raw_dog_list_package);

    }, [raw_dog_list_package]);


    const [dog_list_package, set_dog_list_package] = useState();

    //dog list package has changed
    useEffect(() => {

        if (!dog_list_package) {
            data.successful_dog_list_package(null);
            return;
        } 

        //send up
        data.successful_dog_list_package(dog_list_package);

    }, [dog_list_package]);


    /* SHELTERSEARCH CONTENT */
    return (
        <div className="ShelterContainer" style={{height: search_bar_size}}>
            <div className="ShelterBar" onClick={handleShelterBarClick}>
                <div className="ShelterWedge">
                    <img className="Wedge_L" src={triangle} style={{ transform: caret_rotation_L }} alt="Navigation Triangle"></img>
                </div>
                <div className="ShelterTitle">- Search Parameters -</div>
                <div className="ShelterWedge">
                    <img className="Wedge_R" src={triangle} style={{ transform: caret_rotation_R }} alt="Navigation Triangle"></img>
                </div>
            </div>
            <div className="ShelterSearchContent">
                <div className="ShelterSearchColumn_L">
                    <div className="breed_textbox_container">
                        <label>
                            <input type="text" className="breed_textbox" placeholder="Search Breeds" id="user_email" value={breed_search_input} onChange={(e) => set_breed_search_input(e.target.value)} />
                        </label>
                    </div>
                    <div className="breed_scroll_container">
                        <div className="breed_scrollbox">
                            <ul className="breed_list">{possible_breed_list}</ul>
                        </div>
                    </div>

                </div>
                <div className="ShelterSearchColumn_R">
                    <div className="age_textbox_container">
                        <div className="smaller_age_textbox_container">
                            <label>
                                <div className="age_text">Min.</div>
                                <input type="text" className="age_textbox" placeholder="Age" id="min_age" value={min_age_input} onChange={(e) => set_min_age_input(e.target.value)} />
                            </label>
                        </div>
                        <div className="smaller_age_textbox_container">
                            <label>
                                <div className="age_text">Max.</div>
                                <input type="text" className="age_textbox" placeholder="Age" id="max_axe" value={max_age_input} onChange={(e) => set_max_age_input(e.target.value)} />
                            </label>
                        </div>
                    </div>
                    <div className="sort_container">
                        <div className="sort_title">- SORT RESULTS -</div>
                        <div className="sort_body_container">
                            <div className="sort_body_row">
                                <div className="sort_text">Age</div>
                                <div className="sort_button_space">
                                    <img className={wedge_age_up} src={triangle} alt="Triangle Sort Age Ascending" onClick={(e) => handleSearchSorting(search_sort_age_asc)}></img>
                                </div>
                                <div className="sort_button_space">
                                    <img className={wedge_age_down} src={triangle} alt="Triangle Sort Age Descending" onClick={(e) => handleSearchSorting(search_sort_age_desc)}></img>
                                </div>
                            </div>
                            <div className="sort_body_row">
                                <div className="sort_text">Breed</div>
                                <div className="sort_button_space">
                                    <img className={wedge_breed_up} src={triangle} alt="Triangle Sort Breed Ascending" onClick={(e) => handleSearchSorting(search_sort_breed_asc)}></img>
                                </div>
                                <div className="sort_button_space">
                                    <img className={wedge_breed_down} src={triangle} alt="Triangle Sort Breed Descending" onClick={(e) => handleSearchSorting(search_sort_breed_desc)}></img>
                                </div>
                            </div>
                            <div className="sort_body_row">
                                <div className="sort_text">Name</div>
                                <div className="sort_button_space">
                                    <img className={wedge_name_up} src={triangle} alt="Triangle Sort Name Ascending" onClick={(e) => handleSearchSorting(search_sort_name_asc)}></img>
                                </div>
                                <div className="sort_button_space">
                                    <img className={wedge_name_down} src={triangle} alt="Triangle Sort Name Descending" onClick={(e) => handleSearchSorting(search_sort_name_desc)}></img>
                                </div>
                            </div>
                        </div>
                        <div className="Clear_Search_Button_Container">
                            <div className="Clear_Search_Button" onClick={handleClearSearchSubmit_ButtonPress}>CLEAR</div>
                        </div>
                    </div>



                </div>
            </div>
                
        </div>

    )




}

export default ShelterSearch;


