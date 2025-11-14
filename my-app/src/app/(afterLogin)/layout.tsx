import React, {ReactNode} from 'react';

interface Props {
    children: ReactNode;
    // header: ReactNode;
    // nav: ReactNode;
    // modal: ReactNode;
}

function Layout({ children}: Props) {
    return (
        <div>

            <div>
                {children}
            </div>
        </div>
    );
}

export default Layout;