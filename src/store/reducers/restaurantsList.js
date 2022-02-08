import { GET_BRANCHES, GET_ONE_RESTAURANT, GET_RESTAURANT_LIST } from '../actions/restaurantsList';

const initialState = {
  result: [],
  adminBranches: [],
  singleRestaurant: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_RESTAURANT_LIST.SUCCESS: {
      const { result } = action.payload.data;
      return {
        ...state,
        result,
      };
    }

    case GET_BRANCHES.SUCCESS: {
      const { result } = action.payload.data;

      return {
        ...state,
        adminBranches: result,
      };
    }

    case GET_ONE_RESTAURANT.SUCCESS: {
      const { data: { result } } = action.payload;

      return {
        ...state,
        singleRestaurant: result,
      };
    }

    default: {
      return state;
    }
  }
}
