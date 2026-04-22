import React, { useState } from "react";
import PropTypes from "prop-types";
import classes from "./table.module.css";
import { Col, Row } from "react-bootstrap";
import { IconContext } from "react-icons/lib";
import "bootstrap/dist/css/bootstrap.min.css";
import Box from "@mui/material/Box";
import MUITable from "@mui/material/Table/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { CheckBox } from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import TableHead from "@mui/material/TableHead";
import { styled } from "@mui/material/styles";
import SearchBox from "../../NewComponent/SearchBox";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgb(0, 92, 185);",
    color: theme.palette.common.white, 
    border: "1px solid #B1BFC3",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    backgroundColor: "#f2f2f2",
    border: "1px solid #B1BFC3",
  },
}));



const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
    borderBottom: "1px solid #B1BFC3",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
    border: "1px solid #B1BFC3",
  },
}));

const Table = ({
  cols,
  data,
  rows,
  loadDataonPageChange,
  counts,
  className,
  includeCheck,
  checkBoxEvent,
  value, onChange,styles
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rows ? rows : 10);
  const [rowsOptions,setRowsOptions] = React.useState(rows<10 ? [5,10,25,50,100] : [10,25,50,100])
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  data.map(a => {return {...a,randomId: (Math.random()*10000).toFixed(0)}})
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const dynamicStyles = typeof styles === "undefined" ? {} : styles;
  const alignCenter = "center";
  return (
    <IconContext.Provider value={{ color: "#6495ED" }}>
      <Row className={`${classes.tableContainer} ${className}`} style={{
          ...dynamicStyles?.tablehead,
          ...(dynamicStyles?.tablehead ? {} : { background: "transparent" }),
        }}>
        <Paper className={classes.tableContainer} >
        <TableContainer
            className={classes.tableStyles}
            
          >
          <Row className={`justify-content-center align-items-center`} style={{ backgroundColor: 'white', padding:'0 10px 0 10px' }}>
            {value !== undefined && onChange && (
              <Col>
                {/* Use the value and onChange props */}
                <SearchBox value={value} onChange={onChange} />
              </Col>
            )}
<Col>
{ rows &&
            <TablePagination sx={{padding:'0px',margin:'0px',
            '.MuiTablePagination-selectLabel':{margin:'0px'},
        '.MuiTablePagination-displayedRows':{margin:'0px'}
    }}
        rowsPerPageOptions={rowsOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        SelectProps={{
            inputProps: {
              'aria-label': 'rows per page'
            },
            native: true,
          }}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}                                                                                                                                           
        className = {classes.pagination}
      />}
</Col>
            </Row> 
         
          <div style={{
          ...dynamicStyles?.table,
          ...(dynamicStyles?.table ? {} : { background: "transparent" }),
        }}className={classes.tableBody}>
            <MUITable stickyHeader className={`table table-bordered table-striped ${classes.table}`}>
               <TableHead>                <TableRow>
                {includeCheck &&  <StyledTableCell align={alignCenter}>{<input type="checkbox" />}</StyledTableCell>}
                  <StyledTableCell align={alignCenter}>S.No</StyledTableCell>
                  {cols.map((headerItem, index) => (
                    <StyledTableCell key={index} align={alignCenter}>
                      {headerItem.title}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead> 
              {data && (
                  <TableBody >
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => (
                      <StyledTableRow key={(page * rowsPerPage)+index+1}>
                      {includeCheck &&  <StyledTableCell align={alignCenter}>{<input type="checkbox" onClick={e=>{checkBoxEvent(item,e.target.checked) }} id={(page * rowsPerPage)+index+1}/>}</StyledTableCell>}
                        <StyledTableCell>{page * rowsPerPage+index+1}</StyledTableCell>
                        {cols.map((col, key) => (
                          <StyledTableCell
                            key={key}
                            align={col.align}
                            className={col.hover && classes.hoverclass}
                          >
                            {col.render(item)}
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    ))}
                </TableBody>
              )}    
            </MUITable> </div>
            
          </TableContainer>
        </Paper>
      </Row>
      
    </IconContext.Provider>
  );
};

Table.propTypes = {
  cols: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  bordered: PropTypes.bool,
  hoverable: PropTypes.bool,
  striped: PropTypes.bool,
  isDark: PropTypes.bool,
};

Table.defaultProps = {
  bordered: true,
  hoverable: false,
  striped: false,
  isDark: false,
};

export default Table;
