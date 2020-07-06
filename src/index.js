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
      state.rooms.map((room) => {
        if (room.roomId === action.id) {
          room.subscription.unsubscribe();
        }
      });
    case "CHANGE_ROOM":
      console.log(action.id);
      console.log(state.rooms);
      let selectedRooms = state.rooms;
      let selectedRoom = selectedRooms.filter(
        (room) => room.roomId === action.id
      )[0];
      return { ...state, selectedRoom: selectedRoom };
    case "CLEAR_SELECTED_ROOM":
      return { ...state, selectedRoom: null };
    case "ADD_SUBSCRIPTION":
      console.log("adding subs");
      return {
        ...state,
        messageSubs: [...state.messageSubs, action.subscription],
      };
    case "REMOVE_SUBSCRIPTION":
      console.log(action.id);
      const subscription = state.messageSubs.filter(
        (sub) => sub.id === action.id
      );
      console.log(subscription);
      let messageSubs = state.messageSubs;
      if (subscription[0].subscription) {
        subscription[0].subscription.unsubscribe();
        messageSubs = state.messageSubs.filter((sub) => sub.id !== action.id);
      }
      return { ...state, messageSubs: messageSubs };
    case "SET_MESSAGES":
      let messagesRooms = state.rooms;
      let messageSelectedRoom = state.selectedRoom;
      console.log(messagesRooms);
      if (messagesRooms) {
        messagesRooms.map((room, i) => {
          if (
            action.messages &&
            action.messages[0] &&
            room.roomId === action.messages[0].chatId
          ) {
            messagesRooms[i].messages = action.messages;
            messagesRooms[i].lastMessage = action.messages[0];
          }
        });
      }
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
      if (state.rooms.lengt > 0) {
        state.rooms.map((room) => {
          room.subscription.unsubscribe();
          room.changeSub.unsubscribe();
        });
      }
      return initialState;
    case "SET_NOTIFICATIONS":
      let notificationState = state;
      notificationState.notifications = action.notifications;
      return notificationState;
    case "ADD_NOTIFICATION":
      console.log("adding notification");
      return {
        ...state,
        notifications: [...state.notifications, action.notification],
      };
    case "REMOVE_NOTIFICATIONS":
      console.log(action);
      let notifications = state.notifications.filter(function (el) {
        return JSON.parse(el.recepient_group_id) !== action.id;
      });
      return { ...state, notifications: notifications };
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
