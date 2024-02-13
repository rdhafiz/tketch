import React, {useEffect, useRef, useState} from 'react';
import Dropdown from "../components/Dropdown.jsx";
import useClickOutside from "../../hooks/clickOutside.jsx";
import useStore from "../../store/store.js";
import TwoLetterName from "../components/TwoLetterName.jsx";
import AuthService from "../../services/AuthService.js";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";
import {Link} from "react-router-dom";

const Header = () => {
    const {user} = useStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const wrapperRef = useRef("");
    const dropDownOptions = [
        {name: 'Profile', isLink: true, link: '/dashboard/profile', icon: <AiOutlineUser/> },
        {name: 'Logout', isLink: false, action: () => {AuthService.logout()}, icon: <AiOutlineLogout/>}
    ]
    useClickOutside(wrapperRef, () => {
        setIsDropdownOpen(false);
    });
    const handleDropDown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }
    return (
        <>
            {user && (
                <header className="flex items-center justify-between h-16 px-4 bg-gray-800 text-white">
                    <div className="flex items-center space-x-4">
                        <Link to={`/dashboard`} className="text-3xl font-semibold">tketch</Link></div>
                    <span className="relative flex shrink-0 rounded-full h-9 w-9 overflow-visible " ref={wrapperRef} >
                 {user?.avatarFullPath ? (
                     <img className={`cursor-pointer rounded-full`} src={user.avatarFullPath} onClick={() => handleDropDown() } alt=""/>
                 ) : (
                     <span className={`cursor-pointer flex h-full w-full items-center justify-center rounded-full ${user?.color}`} onClick={() => handleDropDown() }><TwoLetterName name={user.name}/></span>
                 )}
                        <Dropdown handleDropDown={handleDropDown} isOpen={isDropdownOpen} options={dropDownOptions}/>
            </span>
                </header>
            )}
        </>
    );
};

export default Header;