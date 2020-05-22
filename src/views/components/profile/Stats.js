import React, { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import { Auth } from "aws-amplify";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

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
    padding: 20,
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
            <Table className={css(styles.table)}>
              <Thead>
                <Tr className={css(styles.TableContentWrapper)}>
                  <Th className={css(styles.tableContent)}>År</Th>
                  <Th className={css(styles.tableContent)}>GP</Th>
                  <Th className={css(styles.tableContent)}>GS</Th>
                  <Th className={css(styles.tableContent)}>PTS</Th>
                  <Th className={css(styles.tableContent)}>AST</Th>
                  <Th className={css(styles.tableContent)}>REB</Th>
                  <Th className={css(styles.tableContent)}>BLK</Th>
                  <Th className={css(styles.tableContent)}>STL</Th>
                  <Th className={css(styles.tableContent)}>PF</Th>
                  <Th className={css(styles.tableContent)}>TO</Th>
                  <Th className={css(styles.tableContent)}>MIN</Th>
                  <Th className={css(styles.tableContent)}>FG</Th>
                  <Th className={css(styles.tableContent)}>FG%</Th>
                  <Th className={css(styles.tableContent)}>3PT</Th>
                  <Th className={css(styles.tableContent)}>3P%</Th>
                  <Th className={css(styles.tableContent)}>FT</Th>
                  <Th className={css(styles.tableContent)}>FT%</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dummyStats.map((stats, i) => (
                  <Tr className={css(styles.tableContentWrapper)}>
                    <Td className={css(styles.tableContent)}>{stats.year}</Td>
                    <Td className={css(styles.tableContent)}>{stats.gp}</Td>
                    <Td className={css(styles.tableContent)}>{stats.gs}</Td>
                    <Td className={css(styles.tableContent)}>{stats.pts}</Td>
                    <Td className={css(styles.tableContent)}>{stats.ast}</Td>
                    <Td className={css(styles.tableContent)}>{stats.reb}</Td>
                    <Td className={css(styles.tableContent)}>{stats.blk}</Td>
                    <Td className={css(styles.tableContent)}>{stats.stl}</Td>
                    <Td className={css(styles.tableContent)}>{stats.pf}</Td>
                    <Td className={css(styles.tableContent)}>{stats.to}</Td>
                    <Td className={css(styles.tableContent)}>{stats.min}</Td>
                    <Td className={css(styles.tableContent)}>{stats.fg}</Td>
                    <Td className={css(styles.tableContent)}>{stats.fgPer}</Td>
                    <Td className={css(styles.tableContent)}>{stats.long}</Td>
                    <Td className={css(styles.tableContent)}>
                      {stats.longPer}
                    </Td>
                    <Td className={css(styles.tableContent)}>{stats.ft}</Td>
                    <Td className={css(styles.tableContent)}>{stats.ftPer}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        )}
      </div>
    );
  }
}

export default Stats;