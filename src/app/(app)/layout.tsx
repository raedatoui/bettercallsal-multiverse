import React from 'react';
import Shell from '../shell';

// DOC: route group, so it adds no URL segment. linktree and privacy sit outside it because
//  they render their own chrome instead of the header/nav/footer shell.
const AppLayout = ({ children }: { children: React.ReactNode }) => <Shell>{children}</Shell>;

export default AppLayout;
