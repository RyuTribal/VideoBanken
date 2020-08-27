export default function isMobile() {
  if (
    window.matchMedia("(max-width: 813px)").matches ||
    window.matchMedia("(max-width: 1025px) and (orientation: landscape)")
      .matches
  ) {
    return true;
  } else {
    return false;
  }
}
