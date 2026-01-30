import React, { ReactNode } from 'react';
import RQProvider from '@/components/RQProvider';
import Header from '@/components/layout/Header';

interface Props {
    children: ReactNode;
}

function Layout({ children }: Props) {
    return (
        <div>
            <Header />
            <RQProvider>{children}</RQProvider>
        </div>
    );
}

export default Layout;
