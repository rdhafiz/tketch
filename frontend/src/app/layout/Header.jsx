import React from 'react';

const Header = () => {
    return (
        <header className="flex items-center justify-between h-16 px-4 bg-gray-800 text-white">
            <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold">Tketch</span></div>
            <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9" type="button"
                  id="radix-:rk:" aria-haspopup="menu" aria-expanded="false" data-state="closed"><span
                className="flex h-full w-full items-center justify-center rounded-full bg-muted">JP</span></span>
        </header>
    );
};

export default Header;