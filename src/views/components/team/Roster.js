import React, { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Auth } from "aws-amplify";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",

    display: "flex",
    flexDirection: "row",
    "@media (max-width: 1300px)": {
      flexDirection: "column"
    },
  },
  rosterWrapper: {
    background: "white",


    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gridAutoRows: "min-content",
    gridGap: 0,
    width: "100%",

    padding: 5,
    "@media (max-width: 1300px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    },
    "@media (max-width: 820px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(205px, 1fr))",
    },
    "@media (max-width: 510px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
    },
  },
  
  associatedWrapper: {
    width: 360,
    height: "auto",

    padding: 10,
    paddingBottom: 200,

    background: "#f3f3f3ff",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "@media (max-width: 1300px)": {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gridAutoRows: "min-content",
    gridGap: 0,
    width: "100%",
    },
    "@media (max-width: 820px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(205px, 1fr))",
    },
    "@media (max-width: 510px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
    },
  },
  profileWrapper: {
    height: "auto",
    width: "100%",
    padding: 5,
    position: "relative",

  },
  profileImg: {
    paddingTop: "100%",
    background: "gray",


    display: "flex",
    flexDirection: "row",
  },
  profileName: {
    position: "absolute",
    bottom: 27,
    left: 10,
    
    fontWeight: 700,
    color: "white",

    fontSize: 16,

    "@media (max-width: 1300px)": {
      fontSize: "1.1vw",
    },
    "@media (max-width: 1145px)": {
      fontSize: "1.6vw",
    },
    "@media (max-width: 1065px)": {
      fontSize: "1.3vw",
    },
    "@media (max-width: 924px)": {
      fontSize: "1.8vw",
    },
    "@media (max-width: 625px)": {
      fontSize: "2.5vw",
    },
    
 
  },
  profilePosition: {
    position: "absolute",
    bottom: 10,
    left: 10,

    fontSize: 14,
    color: "white",
    "@media (max-width: 625px)": {
      fontSize: "2.5vw",
    },
  },
  profileNumber: {
    position: "absolute",
    bottom: 2,
    right: 10,

    fontSize: 38,
    color: "white",
  },
  profileInfoBackground: {
    height: 50,
    width: "calc(100% - 10px)",
    
    position: "absolute",
    bottom: 5,
    right: 5,

    fontSize: 30,
    background: "rgba(0,0,0,0.4)",
  },


});
class Roster extends Component {
  constructor() {
    super();

  }
  componentDidMount = async () => {

  };
  componentDidUpdate = async (prevProps) => {

  };
  changeCover = async () => {};
  render() {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.rosterWrapper)}>
          <div className={css(styles.profileWrapper)}><div className={css(styles.profileImg)}></div>
            <div className={css(styles.profileInfoBackground)}></div><div className={css(styles.profileName)}>Giannis Antentokounmpo</div>
            <div className={css(styles.profilePosition)}>Power-Forward</div><div className={css(styles.profileNumber)}>83</div>
          </div>
          <div className={css(styles.profileWrapper)}><div className={css(styles.profileImg)}></div>
            <div className={css(styles.profileInfoBackground)}></div><div className={css(styles.profileName)}>Giannis Antentokounmpo</div>
            <div className={css(styles.profilePosition)}>Power-Forward</div><div className={css(styles.profileNumber)}>83</div>
          </div>
          <div className={css(styles.profileWrapper)}><div className={css(styles.profileImg)}></div>
            <div className={css(styles.profileInfoBackground)}></div><div className={css(styles.profileName)}>Giannis Antentokounmpo</div>
            <div className={css(styles.profilePosition)}>Power-Forward</div><div className={css(styles.profileNumber)}>83</div>
          </div>
          <div className={css(styles.profileWrapper)}><div className={css(styles.profileImg)}></div>
            <div className={css(styles.profileInfoBackground)}></div><div className={css(styles.profileName)}>Giannis Antentokounmpo</div>
            <div className={css(styles.profilePosition)}>Power-Forward</div><div className={css(styles.profileNumber)}>83</div>
          </div>
          <div className={css(styles.profileWrapper)}><div className={css(styles.profileImg)}></div>
            <div className={css(styles.profileInfoBackground)}></div><div className={css(styles.profileName)}>Giannis Antentokounmpo</div>
            <div className={css(styles.profilePosition)}>Power-Forward</div><div className={css(styles.profileNumber)}>83</div>
          </div>
          <div className={css(styles.profileWrapper)}><div className={css(styles.profileImg)}></div>
            <div className={css(styles.profileInfoBackground)}></div><div className={css(styles.profileName)}>Giannis Antentokounmpo</div>
            <div className={css(styles.profilePosition)}>Power-Forward</div><div className={css(styles.profileNumber)}>83</div>
          </div>
          <div className={css(styles.profileWrapper)}><div className={css(styles.profileImg)}></div>
            <div className={css(styles.profileInfoBackground)}></div><div className={css(styles.profileName)}>Giannis Antentokounmpo</div>
            <div className={css(styles.profilePosition)}>Power-Forward</div><div className={css(styles.profileNumber)}>83</div>
          </div>
          <div className={css(styles.profileWrapper)}><div className={css(styles.profileImg)}></div>
            <div className={css(styles.profileInfoBackground)}></div><div className={css(styles.profileName)}>Giannis Antentokounmpo</div>
            <div className={css(styles.profilePosition)}>Power-Forward</div><div className={css(styles.profileNumber)}>83</div>
          </div>

        </div> 

        <div className={css(styles.associatedWrapper)}>
          <div className={css(styles.profileWrapper)}><div className={css(styles.profileImg)}></div>
            <div className={css(styles.profileInfoBackground)}></div><div className={css(styles.profileName)}>Giannis Antentokounmpo</div>
            <div className={css(styles.profilePosition)}>Head Coach</div>
          </div>
          <div className={css(styles.profileWrapper)}><div className={css(styles.profileImg)}></div>
            <div className={css(styles.profileInfoBackground)}></div><div className={css(styles.profileName)}>Giannis Antentokounmpo</div>
            <div className={css(styles.profilePosition)}>Power-Forward</div>
          </div>
          <div className={css(styles.profileWrapper)}><div className={css(styles.profileImg)}></div>
            <div className={css(styles.profileInfoBackground)}></div><div className={css(styles.profileName)}>Giannis Antentokounmpo</div>
            <div className={css(styles.profilePosition)}>Power-Forward</div>
          </div>
          
        </div> 
      
      
      </div> 









    );
  }
}

export default Roster;
