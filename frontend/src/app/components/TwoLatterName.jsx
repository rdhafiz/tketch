import React, {useEffect, useState} from 'react';

const TwoLatterName = ({name}) => {
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
        <span className="uppercase text-2xl font-bold text-white">
            {showName}
        </span>
    );
};

export default TwoLatterName;