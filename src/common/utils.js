

export function Build_PossibleBreedArray(data) {

    /* This determines the possible breeds to list in the scrollbox */

    //early exit
    if (data.input === "") {
        return data.all_breeds;
    }

    //conversion
    const input_arr = data.input.split("");

    //response package
    let breed_array = [];

    //start matching trigger
    let matching_starts_trigger = false;


    //loop all breeds
    for (const breed of data.all_breeds) {

        //conversion
        const breed_string_array = breed.split("");

        //find minimum check length
        const lenth_to_loop = breed_string_array.length <= input_arr.length ? breed_string_array.length : input_arr.length;

        //set false_trigger
        let false_trigger = false;

        //loop minimum check length
        for (let i = 0; i < lenth_to_loop; i++) {

            //if not a match
            if (breed_string_array[i].toLowerCase() !== input_arr[i].toLowerCase()) {

                false_trigger = true;
                break;
            }
        }

        //if did NOT survived
        if (false_trigger) {

            if (matching_starts_trigger) {
                //end whole search
                break;
            }

            //move on
            continue;
        }

        //if did survive
        {
            //set matching starts trigger
            matching_starts_trigger = true;

            //push breed
            breed_array.push(breed);
        }
    }

    return breed_array;
}

export function create_possible_breed_list(breed_selection_object) {

    let response = [];

    //loop
    for (const item of breed_selection_object) {

        //if should be included
        if (item.possible_breed) {

            //get info
            const checked_status = item.chosen_breed ? true: false;
            const name = item.name;

            //push html
            response.push(
                <li key={name}>
                    <label>
                        <input key={Math.random()} type="checkbox" name={name} defaultChecked={checked_status} onChange={(e) => item.on_change_function_ref.current(e.target)} />
                        <span className="breed_list_name">{name}</span>
                    </label>
                </li>
            )
        }
    }

    return response;

}

export function determine_page_splits(dog_list_package) {

    const total_pages = Math.ceil(dog_list_package.total / number_of_results_per_page);

    let current_page;

    if (dog_list_package.prev) {

        //split into single character arrays
        let string_array = dog_list_package.prev.split("");

        let backwards_digit_array = [];

        //loop backwards
        for (let i = (string_array.length - 1); i >= 0; i--){

            //if =, then stop
            if (string_array[i] === "=") {
                break;
            }

            //add to digit_array
            backwards_digit_array.push(parseInt(string_array[i]));
        }

        //initialize
        let prev_element_start_int = 0;
        let multiplier = 1;

        //loop backwards_digit_array forwards
        for (let i = 0; i < backwards_digit_array.length; i++){

            //add to prev_element with multiplier
            prev_element_start_int = prev_element_start_int + (backwards_digit_array[i] * multiplier);

            //increment multiplier
            multiplier *= 10;
        }

        //get current page number
        current_page = 2 + (Math.floor(prev_element_start_int / number_of_results_per_page));
    }
    else {
        current_page = 1;
    }

    return ({
        current_page: current_page,
        total_pages: total_pages,
    })

}


//global array
export const breed_selection_object = [];

//global map
export const favorites_map = new Map();

//enum for context button
export const rc_ResultsContext = Object.freeze({
    rc_RESULTS: Symbol(0),
    rc_FAVORITES: Symbol(1)
})

//set number of results per page
export const number_of_results_per_page = 12;
