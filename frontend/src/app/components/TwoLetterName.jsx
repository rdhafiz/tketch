import React, {useEffect, useState} from 'react';

const TwoLetterName = ({name, classes = 'font-bold'}) => {
    const [showName, setShowName] = useState('')
    useEffect(() => {
        let nameArray = name.split(' ')
        if (nameArray.length > 1) {
            setShowName(nameArray[0].charAt(0) + nameArray[1].charAt(0))
        } else {
            setShowName(nameArray[0].charAt(0) + nameArray[0].charAt(1))
        }
    }, [name])
    return (
        <span className={`uppercase text-white ${classes}`}>
            {showName}
        </span>
    );
};

export default TwoLetterName;