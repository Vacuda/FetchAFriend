import '../styles/MatchResults.css';
import { useState, useEffect } from 'react';
import { favorites_map } from '../common/utils.js'
import { breed_selection_object } from '../common/utils.js'
import { useDogAPI_FindMatch } from '../api/useDogAPI_FindMatch.js'
import { useDogAPI_GetDogs } from '../api/useDogAPI_GetDogs.js'





//return content
function MatchResults(data) {

    const [trigger_get_matched_dog, set_trigger_get_matched_dog] = useState();
    const matched_dog_object = useDogAPI_FindMatch(trigger_get_matched_dog);

    //dog match triggered
    useEffect(() => {

        //match triggered
        if (data.trigger_matchresults) {

            let favorite_dog_ids = [];

            //loop favorite map
            for (let key of favorites_map.keys()) {
                favorite_dog_ids.push(key);
            }

            //find a match
            set_trigger_get_matched_dog(favorite_dog_ids);


        }

    }, [data.trigger_matchresults]);

    const [matched_dog_query_results, set_matched_dog_query_results] = useState();
    const matched_dog = useDogAPI_GetDogs(matched_dog_query_results);

    //matched dog id found
    useEffect(() => {

        //early exit
        if (!matched_dog_object) return;

        //create query package
        const matched_dog_query_results_package = {

            resultIds: [matched_dog_object.match],
            total: null,
            next: null,
            prev: null
        };

        //find matched dog object
        set_matched_dog_query_results(matched_dog_query_results_package);


    }, [matched_dog_object]);

    const [dog, set_dog] = useState();

    //matched dog found
    useEffect(() => {

        //early exit
        if (!matched_dog) return;

        set_dog(matched_dog.dogs[0]);

    }, [matched_dog]);


    const handleAgainButtonPress = () => {

        data.trigger_adoptagain();

        //clear objects
        breed_selection_object.length = 0;
        favorites_map.delete(dog.id);
        set_dog();

    }


    /* MATCHRESULTS CONTENT */
    return (
        <div className="MatchResultsContainer">

            {dog && (
                <>
                    <div className="match_card">

                        <div className="match_card_header">Congratulations, {data.user_name}</div>

                        <img src={dog.img} className="matched_dog_pic" alt="Dog" />

                        <div className="matched_card_body">You can take {dog.name} home!</div>

                        <div className="matched_card_text">Further information will be sent to your email:<br></br>{data.user_email}</div>
                    </div>

                    <div className="Again_Button_Container">
                        <div className="Again_Button" onClick={handleAgainButtonPress}>Adopt Again!</div>
                    </div>

                </>
            )}

        </div>
    )
}

export default MatchResults;
