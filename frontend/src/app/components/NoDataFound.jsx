import {AiOutlineDatabase} from "react-icons/ai";

const NoDataFound = ({title = 'No Data Found', subtitle = 'We couldn\'t find any data.'}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-96 gap-4 px-4 md:px-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 className="h-24 w-24 text-gray-500 dark:text-gray-400" data-id="2">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
                <path d="M3 12A9 3 0 0 0 21 12"></path>
            </svg>
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
    );
};

export default NoDataFound;