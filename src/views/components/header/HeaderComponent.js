import React from "react";
import { string } from "prop-types";
import { Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";

const styles = StyleSheet.create({
  avatar: {
    height: 35,
    width: 35,
    borderRadius: 50,
    marginLeft: 14,
    border: "1px solid #bf9c96",
  },
  container: {
    height: 40,
    padding: 30,
    paddingTop: 30,
    color: "#263040"
  },
  cursorPointer: {
    cursor: "pointer",
  },
  name: {
    fontFamily: "Muli",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 14,
    lineHeight: "20px",
    textAlign: "right",
    letterSpacing: 0.2,
    '@media (max-width: 768px)': {
        display: 'none'
    }
  },
  separator: {
    borderLeft: "1px solid #bf9c96",
    marginLeft: 32,
    marginRight: 32,
    height: 32,
    width: 2,
  },
  title: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: "30px",
    letterSpacing: 0.3,
    '@media (max-width: 768px)': {
        marginLeft: 36
    },
    '@media (max-width: 468px)': {
        fontSize: 20
    }
  },
  iconStyles: {
    cursor: 'pointer',
    marginLeft: 25,
    '@media (max-width: 768px)': {
        marginLeft: 12
    }
}
});

function HeaderComponent(props) {
  const { icon, title, usernickname,  ...otherProps } = props;
  return (
    <Row
      className={css(styles.container)}
      vertical="center"
      horizontal="space-between"
      {...otherProps}
    >
      <span className={css(styles.title)}>{title}</span>
      <Row vertical="center">
        <div className={css(styles.iconStyles)}>
          <i className="fas fa-search"></i>
        </div>
        <div className={css(styles.iconStyles)}>
        <i className="fas fa-bell"></i>
        </div>
        <div className={css(styles.separator)}></div>
        <Row vertical="center">
          <span className={css(styles.name, styles.cursorPointer)}>
            {usernickname}
          </span>
          <img
            src="https://avatars3.githubusercontent.com/u/21162888?s=460&v=4"
            alt="avatar"
            className={css(styles.avatar, styles.cursorPointer)}
          />
        </Row>
      </Row>
    </Row>
  );
}

HeaderComponent.propTypes = {
  title: string,
};

export default HeaderComponent;
