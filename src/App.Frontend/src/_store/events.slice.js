import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWrapper } from '_helpers';

// create slice

const name = 'events';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const eventsActions = { ...slice.actions, ...extraActions };
export const eventsReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        list: null,
        item: null
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_API_URL}/events`;

    return {
        get: _get(),
        create: _create(),
        getReferenceAll: _getReferenceAll(),
        delete: _delete()
    };

    function _get() {
        return createAsyncThunk(
            `${name}/get`,
            async (id) => await fetchWrapper.get(`${baseUrl}/${id}`)
        );
    }

    function _create() {
        return createAsyncThunk(
            `${name}`,
            async (eventInput) => await fetchWrapper.post(`${baseUrl}`, eventInput.data)
        );
    }

    function _delete() {
        return createAsyncThunk(
            `${name}/delete`,
            async function (id, { getState, dispatch }) {
                await fetchWrapper.delete(`${baseUrl}/${id}`);
            }
        );
    }

    function _getReferenceAll() {
        return createAsyncThunk(
            `${name}/getReferenceAll`,
            async () => await fetchWrapper.get(baseUrl)
        );
    }
}

function createExtraReducers() {
    return (builder) => {
        _get();
        _create();
        _getReferenceAll();
        _delete();

        function _get() {
            var { pending, fulfilled, rejected } = extraActions.get;
            builder
                .addCase(pending, (state) => {
                    state.item = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.item = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.item = { error: action.error };
                });            
        }

        function _create() {
            var { pending, fulfilled, rejected } = extraActions.create;
            builder
                .addCase(pending, (state) => {
                    state.item = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.item = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.item = { error: action.error };
                });            
        }

        function _getReferenceAll() {
            var { pending, fulfilled, rejected } = extraActions.getReferenceAll;
            builder
                .addCase(pending, (state) => {
                    state.list = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.list = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.list = { error: action.error };
                });
        }

        function _delete() {
            var { pending, fulfilled, rejected } = extraActions.delete;
            builder
                .addCase(pending, (state, action) => {
                    const event = state.list.value.find(x => x.id === action.meta.arg);
                    event.isDeleting = true;
                })
                .addCase(fulfilled, (state, action) => {
                    state.list.value = state.list.value.filter(x => x.id !== action.meta.arg);
                })
                .addCase(rejected, (state, action) => {
                    const event = state.list.value.find(x => x.id === action.meta.arg);
                    event.isDeleting = false;
                });
            }
    }
}
