// Core
import { put, apply } from 'redux-saga/effects';
import { replace } from 'react-router-redux';

// Instruments
import { api } from "../../../../REST";
import { authActions } from "../../../auth/actions";
import { uiActions } from "../../../ui/actions";
import { profileActions } from "../../../profile/actions";
import { postActions } from "../../../posts/actions";
import { book } from '../../../../navigation/book';

export function* logout () {
    try {
        yield put(uiActions.startFetching());

        const response = yield apply(api, api.auth.logout);

        if (response.status !== 204) {
            const { message } = yield apply(response, response.json);

            throw new Error(message);
        }

    } catch (error) {
        yield put(uiActions.emitError(error, 'logout worker'));
    } finally {
        yield apply(localStorage, localStorage.removeItem, ['token']);
        yield apply(localStorage, localStorage.removeItem, ['remember']);
        yield put(profileActions.clearProfile());
        yield put(postActions.clearPosts());
        yield put(uiActions.stopFetching());
        yield put(authActions.logout());
        yield put(replace(book.login));
    }
}
