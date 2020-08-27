import { SET_USER, SET_PROFILE_IMG } from "../constants/action-types";
export function set_user(payload) {
  return { type: SET_USER, payload };
}

export function set_profile_img(payload) {
    return { type: SET_PROFILE_IMG, payload };
  }