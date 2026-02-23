import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'; // Correct import
import axios from 'axios';
import { composeWithDevTools } from 'redux-devtools-extension';
import { cartReducer } from './Reducers/cartReducers'
import { productListReducer, productDetailsReducer } from './Reducers/productReducers'
import {
  userLoginReducer,
  userRegisterReducer,
  userUpdateProfileReducer,
} from './Reducers/userReducers'
import {
  orderListMyReducer,
  orderCreateReducer,
  orderDetailsReducer,
  orderCancelReducer,
   orderDeliverReducer ,
   orderListReducer,
   
} from './Reducers/orderReducers'
import { userListReducer } from './Reducers/userReducers'
import { productUpdateReducer } from './Reducers/productReducers'

import { adminStatsReducer } from './Reducers/adminReducers'



const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userUpdateProfile: userUpdateProfileReducer,
  orderListMy: orderListMyReducer, 
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderCancel: orderCancelReducer,
  orderDeliver: orderDeliverReducer,
  orderList: orderListReducer,
  userList: userListReducer,
  productUpdate: productUpdateReducer,
  adminStats: adminStatsReducer,

})
const cartItemsFromStorage = localStorage.getItem('cartItems')? JSON.parse(localStorage.getItem('cartItems')):[]
const userInfoFromStorage = localStorage.getItem('userInfo')? JSON.parse(localStorage.getItem('userInfo')):null
const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {}
const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod'))
  : 'CashOnDelivery'

const initialState = {
  cart: { cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage, paymentMethod: paymentMethodFromStorage },
  userLogin: { userInfo: userInfoFromStorage },
  
};

// const initialState = {};
const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;


if (userInfoFromStorage) {
  axios.defaults.headers.common['Authorization'] =
    `Bearer ${userInfoFromStorage.token}`
}

