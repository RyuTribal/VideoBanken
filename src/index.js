import React from "react";
import ReactDOM from "react-dom";
import "./commercial/font-awesome/css/all.min.css";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createStore } from "redux";
import { Provider } from "react-redux";
const initialState = {
  rooms: [],
  messageSubs: [],
  selectedRoom: null,
  user: null,
  notifications: [],
};
const states = (state = initialState, action) => {
  let currentState = state;
  let updatedState = {};
  switch (action.type) {
    case "SET_ROOMS":
      let rooms = state.rooms;
      rooms = action.rooms;
      const newState = { ...state, rooms };
      return newState;
    case "ADD_ROOM":
      state.rooms.push(action.room);
      return state;
    case "REMOVE_ROOM":
      state.rooms = state.rooms.filter((room) => room.roomId !== action.id);
      return state;
    case "CHANGE_ROOM":
      console.log(action.id);
      console.log(state.rooms);
      let selectedRooms = state.rooms;
      let selectedRoom = selectedRooms.filter(
        (room) => room.roomId === action.id
      )[0];
      const selectedState = { ...state, selectedRoom: selectedRoom };
      return selectedState;
    case "CLEAR_SELECTED_ROOM":
      const clearedRoomState = { ...state, selectedRoom: null };
      return clearedRoomState;
    case "ADD_SUBSCRIPTION":
      state.messageSubs.push(action.subscription);
      return state;
    case "REMOVE_SUBSCRIPTION":
      const subscription = state.messageSubs.filter(
        (sub) => sub.id === action.id
      );
      subscription.subscription.unsubscribe();
      state.messageSubs = state.messageSubs.filter(
        (sub) => sub.id !== action.id
      );
    case "SET_MESSAGES":
      let messagesRooms = state.rooms;
      let messageSelectedRoom = state.selectedRoom;
      console.log(action.messages);
      messagesRooms.map((room, i) => {
        if (action.messages[0] && room.roomId === action.messages[0].chatId) {
          messagesRooms[i].messages = action.messages;
          messagesRooms[i].lastMessage = action.messages[0];
        }
      });
      if (messageSelectedRoom) {
        messageSelectedRoom.messages = action.messages;
      }
      console.log(messageSelectedRoom);
      const newMessagesState = {
        ...state,
        rooms: messagesRooms,
        selectedRoom: messageSelectedRoom,
      };
      return newMessagesState;
    case "ADD_MESSAGE":
      console.log(action.message);
      let messageRooms = state.rooms;
      messageRooms.map((room, i) => {
        if (room.roomId === action.message.chatId) {
          if (!room.messages) {
            room.messages = [];
          }
          if (action.settingLast === true) {
            room.messages.unshift(action.message);
          }
          room.lastMessage = action.message;
        }
      });
      console.log(messageRooms);
      const newMessageState = { ...state, rooms: messageRooms };
      return newMessageState;
    case "ADD_USER":
      const newUserState = { ...state, user: action.user };
      return newUserState;
    case "CLEAR_STATE":
      if (state.messageSubs.length > 0) {
        state.messageSubs.map((sub) => {
          sub.subscription.unsubscribe();
        });
      }
      return initialState;
    case "SET_NOTIFICATIONS":
      let notificationState = state;
      notificationState.notifications = action.notifications;
      return notificationState;
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.notification],
      };
    case "REMOVE_NOTIFICATIONS":
      console.log(action);
      currentState.notifications = currentState.notifications.filter(function (
        el
      ) {
        return JSON.parse(el.recepient_group_id) !== action.id;
      });
      console.log(currentState);
      return currentState;
    default:
      return state;
  }
};

const store = createStore(states);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
