import React, {useEffect, useRef, useState} from 'react';
import {Link} from "react-router-dom";

function Dropdown({isOpen, options, handleDropDown}) {
    const dropDownRef    = useRef(null);
    const [position, setPosition] = useState({ left: 180 });
    useEffect(() => {
        const dropdown = dropDownRef.current;
        if (dropdown) {
            const rect = dropdown.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                setPosition((prevPosition) => ({
                    ...prevPosition,
                    left: rect.width - 40,
                }));
            }
        }
    }, [isOpen]);
    return (
        <div>
            {isOpen && (
                <ul style={{left: `-${position.left}px`,}} className="absolute z-10 top-full min-w-[200px] bg-white border border-slate-200 p-1 rounded-lg shadow-xl" ref={dropDownRef}>
                    {options.map((option, index) => {
                        return (
                            <li className={`border-b last:border-0`} key={index}>
                                {option.isLink ? (
                                    <Link className="text-cyan-500 hover:bg-slate-100 flex items-center p-2" onClick={() => handleDropDown()} to={option.link}>
                                        {option.icon != null && (
                                            <span className={`me-1`}>{option.icon}</span>
                                        )}
                                        <span className="whitespace-nowrap">{option.name}</span>
                                    </Link>
                                ) : (
                                    <div className="text-cyan-500 hover:bg-slate-100 flex items-center p-2 cursor-pointer" onClick={() => option.action()}>
                                        {option.icon != null && (
                                            <span className={`me-1`}>{option.icon}</span>
                                        )}
                                        <span className="whitespace-nowrap">{option.name}</span>
                                    </div>
                                )}

                            </li>
                        )
                    })
                    }
                </ul>
            )}
        </div>
    );
}

export default Dropdown;