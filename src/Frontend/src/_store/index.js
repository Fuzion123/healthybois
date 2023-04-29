import { configureStore } from '@reduxjs/toolkit';

import { alertReducer } from './alert.slice';
import { authReducer } from './auth.slice';
import { usersReducer } from './users.slice';
import { cupsReducer } from './cups.slice';

export * from './alert.slice';
export * from './auth.slice';
export * from './users.slice';
export * from './cups.slice';

export const store = configureStore({
    reducer: {
        alert: alertReducer,
        auth: authReducer,
        users: usersReducer,
        cups: cupsReducer
    },
});