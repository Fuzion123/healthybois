import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWrapper } from '_helpers';

// create slice

const name = 'cups';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const cupsActions = { ...slice.actions, ...extraActions };
export const cupsReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        list: null,
        item: null
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_API_URL}/cups`;

    return {
        create: create(),
        getReferenceAll: getReferenceAll(),
        delete: _delete()
    };

    function create() {
        return createAsyncThunk(
            `${name}`,
            async (cupInput) => await fetchWrapper.post(`${baseUrl}`, cupInput.data)
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

    function getReferenceAll() {
        return createAsyncThunk(
            `${name}/getReferenceAll`,
            async () => await fetchWrapper.get(baseUrl)
        );
    }
}

function createExtraReducers() {
    return (builder) => {
        getReferenceAll();
        create();
        _delete();

        function getReferenceAll() {
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

        function create() {
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

        function _delete() {
            var { pending, fulfilled, rejected } = extraActions.delete;
            builder
                .addCase(pending, (state, action) => {
                    const cup = state.list.value.find(x => x.id === action.meta.arg);
                    cup.isDeleting = true;
                })
                .addCase(fulfilled, (state, action) => {
                    state.list.value = state.list.value.filter(x => x.id !== action.meta.arg);
                })
                .addCase(rejected, (state, action) => {
                    const cup = state.list.value.find(x => x.id === action.meta.arg);
                    cup.isDeleting = false;
                });
            }
    }
}
