import React, { ReactNode } from 'react';
import RQProvider from '@/components/RQProvider';

interface Props {
    children: ReactNode;
    // header: ReactNode;
    // nav: ReactNode;
    // modal: ReactNode;
}

function Layout({ children }: Props) {
    return (
        <div>
            <RQProvider>{children}</RQProvider>
        </div>
    );
}

export default Layout;
