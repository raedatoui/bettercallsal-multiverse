import { createBrowserRouter } from 'react-router-dom';

export const isNotNull = <T>(x: T): x is NonNullable<T> => !!x;

export type Router = ReturnType<typeof createBrowserRouter>;

export type CbFn = () => void;

// DOC: this is used for the ClientList and the Unity components.
//   these 2 components need to be rendered and hidden so the switching
//   back to the homepage works (list), and for game switching (unity).
export type VisibleProps = {
    visible: boolean;
};

export * from './content';
export * from './global';
export * from './site';
export * from './sound';
