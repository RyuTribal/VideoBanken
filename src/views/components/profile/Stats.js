import React, { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import { Auth } from "aws-amplify";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  statTable: {
    width: "100%",
    overflowX: "auto",
    padding: 20
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
  },
  tableContent: {
    border: "1px solid #dddddd",
    textAlign: "left",
    padding: 8,
  },
  tableContentWrapper: {
    ":nth-child(even)": {
      backgroundColor: "#dddddd",
    },
  },
  statError: {
    fontSize: 20,
    fontStyle: "italic",
    color: "#666666",
    marginTop: 20,
  },
});

// const dummyStats = null;

const dummyStats = [
  {
    year: 2019,
    pts: 25,
    ast: 7,
    reb: 4,
    blk: 1,
    stl: 2,
    pf: 1,
    to: 3,
    min: 36,
    fg: "11-19",
    fgPer: 0.579,
    long: "5-10",
    longPer: 0.5,
    ft: "10-14",
    ftPer: 0.714,
    gs: 76,
    gp: 76,
  },
  {
    year: 2018,
    pts: 20,
    ast: 5,
    reb: 4,
    blk: 1,
    stl: 2,
    pf: 1,
    to: 5,
    min: 40,
    fg: "8-15",
    fgPer: 0.533,
    long: "3-7",
    longPer: 0.429,
    ft: "7-10",
    ftPer: 0.7,
    gs: 76,
    gp: 76,
  },
  {
    year: 2017,
    pts: 17,
    ast: 3,
    reb: 2,
    blk: 1,
    stl: 2,
    pf: 1,
    to: 2,
    min: 20,
    fg: "8-15",
    fgPer: 0.533,
    long: "3-7",
    longPer: 0.429,
    ft: "7-10",
    ftPer: 0.7,
    gs: 76,
    gp: 76,
  },
];

class Stats extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount = async () => {};
  componentDidUpdate = async (prevProps) => {};
  render() {
    return (
      <div className={css(styles.container)}>
        {dummyStats === null ? (
          <div className={css(styles.statError)}>
            Denna profil har ingen statistik att visa
          </div>
        ) : (
          <div className={css(styles.statTable)}>
            <h2>Stats per säsong</h2>
            <table className={css(styles.table)}>
              <tr className={css(styles.tableContentWrapper)}>
                <th className={css(styles.tableContent)}>År</th>
                <th className={css(styles.tableContent)}>GP</th>
                <th className={css(styles.tableContent)}>GS</th>
                <th className={css(styles.tableContent)}>PTS</th>
                <th className={css(styles.tableContent)}>AST</th>
                <th className={css(styles.tableContent)}>REB</th>
                <th className={css(styles.tableContent)}>BLK</th>
                <th className={css(styles.tableContent)}>STL</th>
                <th className={css(styles.tableContent)}>PF</th>
                <th className={css(styles.tableContent)}>TO</th>
                <th className={css(styles.tableContent)}>MIN</th>
                <th className={css(styles.tableContent)}>FG</th>
                <th className={css(styles.tableContent)}>FG%</th>
                <th className={css(styles.tableContent)}>3PT</th>
                <th className={css(styles.tableContent)}>3P%</th>
                <th className={css(styles.tableContent)}>FT</th>
                <th className={css(styles.tableContent)}>FT%</th>
              </tr>
              {dummyStats.map((stats, i) => (
                <tr className={css(styles.tableContentWrapper)}>
                  <td className={css(styles.tableContent)}>{stats.year}</td>
                  <td className={css(styles.tableContent)}>{stats.gp}</td>
                  <td className={css(styles.tableContent)}>{stats.gs}</td>
                  <td className={css(styles.tableContent)}>{stats.pts}</td>
                  <td className={css(styles.tableContent)}>{stats.ast}</td>
                  <td className={css(styles.tableContent)}>{stats.reb}</td>
                  <td className={css(styles.tableContent)}>{stats.blk}</td>
                  <td className={css(styles.tableContent)}>{stats.stl}</td>
                  <td className={css(styles.tableContent)}>{stats.pf}</td>
                  <td className={css(styles.tableContent)}>{stats.to}</td>
                  <td className={css(styles.tableContent)}>{stats.min}</td>
                  <td className={css(styles.tableContent)}>{stats.fg}</td>
                  <td className={css(styles.tableContent)}>{stats.fgPer}</td>
                  <td className={css(styles.tableContent)}>{stats.long}</td>
                  <td className={css(styles.tableContent)}>{stats.longPer}</td>
                  <td className={css(styles.tableContent)}>{stats.ft}</td>
                  <td className={css(styles.tableContent)}>{stats.ftPer}</td>
                </tr>
              ))}
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default Stats;
