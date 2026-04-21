import { createSelector } from 'reselect';
const authSelect = (state) => state.auth;

export const selectAuth = (state) => state.auth;
export const selectCurrentAdmin = createSelector([selectAuth], (auth) => auth.current);
export const selectCurrentCompany = createSelector(
  [selectCurrentAdmin],
  (admin) => admin?.currentCompany || null
);

export const isLoggedIn = createSelector([selectAuth], (auth) => auth.isLoggedIn);
