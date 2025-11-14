import React, {ReactNode} from 'react';

interface Props {
    children: ReactNode;
    nav: ReactNode;
    modal: ReactNode;
}

function Layout({ children, nav }: Props) {
    return (
        <div>
            {children}
        </div>
    );
}

export default Layout;