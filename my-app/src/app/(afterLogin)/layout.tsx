import React, {ReactNode} from 'react';

interface Props {
    children: ReactNode;
    header: ReactNode;
    nav: ReactNode;
    modal: ReactNode;
}

function Layout({ children, header, nav }: Props) {
    return (
        <div>
            {header}
            <div>
                {children}
            </div>
        </div>
    );
}

export default Layout;