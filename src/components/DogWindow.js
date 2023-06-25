import '../styles/DogWindow.css';
import { useState, useEffect } from 'react';


function DogWindow(data) {

    //condense
    const name = data.dogdata.name;
    const breed = data.dogdata.breed;
    const pic = data.dogdata.img;
    const age = data.dogdata.age;
    const id = data.dogdata.id;
    const zipcode = data.dogdata.zip_code;

    const header_tag_regular = "card-header";
    const header_tag_favorited = "card-header card-header-favorited";
    const [header_tag, set_header_tag] = useState(header_tag_regular);
    const [favorited_state, set_favorited_state] = useState();

    //on startup
    useEffect(() => {

        set_favorited_state(data.dogdata.isFavorited);

    }, []);

    //on state change
    useEffect(() => {

        //if favorited
        if (favorited_state) {
            set_header_tag(header_tag_favorited);
        }
        //if not favorited
        else {
            set_header_tag(header_tag_regular);
        }

    }, [favorited_state]);


    const handleFavoriting = (id) => {

        set_favorited_state(!favorited_state);


        data.handleFavoriting(id)
    }

    return (
        <div className="card" onClick={() => handleFavoriting(id)}>
        
            <div className={header_tag} >{name} - {age}</div>

            <img src={pic} className="dog_pic" alt="Dog" />

            <div className="card-body">
                    <p className="card-text">{breed}</p>
                    <p className="card-text">{zipcode}</p>
            </div>
        
        </div>

    );

    
}

export default DogWindow;
