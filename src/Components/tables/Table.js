import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Table as BootstrapTable } from "react-bootstrap";
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
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import LastPageIcon from "@mui/icons-material/LastPage";
import TableHead from "@mui/material/TableHead";
import { styled } from "@mui/material/styles";
import * as FaIcons from 'react-icons/fa';
import { useMediaQuery } from "@mui/material";
import { format } from 'date-fns';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#01495e;",
    color: theme.palette.common.white,
    border: "1px solid #2f62ed",
    fontSize: "1rem"

  },
  [`&.${tableCellClasses.body}`]: {

    "&:odd)": {
      backgroundColor: 'white', // Set the background color for odd rows
      borderBottom: ".2px solid #B1BFC3",
    },
    "&:even)": {
      backgroundColor: '#beeaf7', // Set the background color for even rows
      borderBottom: ".2px solid #B1BFC3",
    },
    border: "1px solid #dedede",
    fontSize: "1rem"

  },
}));



/* const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: 'white', // Set the background color for odd rows
    borderBottom: ".2px solid #B1BFC3",
  },
  "&:nth-of-type(even)": {
    backgroundColor: '#e3e9f4', // Set the background color for even rows
    borderBottom: ".2px solid #B1BFC3",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
    border: "1px solid ##d9e4fc",
  },
}));
 */

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'highlight',
})(({ theme, highlight }) => ({
  backgroundColor: highlight ? '#ffeaa7' : undefined, // Highlight background if needed
  "&:nth-of-type(odd)": {
    backgroundColor: highlight ? '#ffeaa7' : 'white',
  },
  "&:nth-of-type(even)": {
    backgroundColor: highlight ? '#ffeaa7' : '#e3e9f4',
  },
  borderBottom: ".2px solid #B1BFC3",
  "&:last-child td, &:last-child th": {
    border: 0,
    border: "1px solid #d9e4fc",
  },
}));

const StyledPaper = styled(Paper)(({ fullscreen }) => ({
  borderRadius: "1rem 1rem 0 0",
  transition: 'box-shadow 0.3s ease-in-out', // Add transition for a smooth effect
  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
  position: fullscreen ? "fixed" : "relative", // Fix the position when fullscreen is toggled
  top: fullscreen ? "0" : "auto",
  width: fullscreen ? "91%" : "auto",
  maxWidth: '100%',

  '&:hover': {
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',

  },
}));
const StyledCompressIcon = styled(FaIcons.FaCompress)({
  fontSize: "20px",
  color: "#848785 !important",
  transition: "transform 0.2s",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.2)",
  },
});

const StyledExpandIcon = styled(FaIcons.FaExpand)({
  fontSize: "20px",
  color: "#848785 !important",
  transition: "transform 0.2s",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.2)",
  },
});


const Table = ({
  cols,
  data,
  rows,
  loadDataonPageChange,
  counts,
  className,
  includeCheck,
  checkBoxEvent,
  value, onChange, styles, filterFields, onSort, //fetchPaginatedData, // sortedColumn, 
  totalElements,
  sortOrder,
  hideSNo, approvalDate
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rows ? rows : 10);
  const [rowsOptions, setRowsOptions] = React.useState(rows < 10 ? [5, 10, 25, 50, 100] : [10, 25, 50, 100]);
  const [fullscreen, setFullscreen] = useState(false);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    //   fetchPaginatedData (+event.target.value,0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // fetchPaginatedData (rowsPerPage,newPage);
    console.log("rolees", rowsPerPage)
  };

  const handleToggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const dynamicStyles = typeof styles === "undefined" ? {} : styles;
  const alignCenter = "center";

  const [searchQuery, setSearchQuery] = useState("");
  const [colSearchQuery, setColSearchQuery] = useState("");
  const [colVal, setColVal] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [sortedColumn, setSortedColumn] = useState("");
  const [activeSearchColumn, setActiveSearchColumn] = useState("");
  const [searchBoxesVisibility, setSearchBoxesVisibility] = useState({});
  const [filteredData, setFilteredData] = useState([]);

  // Function to toggle the visibility of the search box for a specific column
  const toggleSearchBox = (colVal) => {
    setSearchBoxesVisibility((prevVisibility) => ({
      ...prevVisibility,
      [colVal]: !prevVisibility[colVal],
    }));
  };
  /*   // Function to toggle the visibility of the search box for a specific column
    const toggleSearchBox = (colVal) => {
      setActiveSearchColumn((prev) => (prev === colVal ? "" : colVal));
    }; */


  // Function to handle sorting on Table Header 
  const requestSort = (key) => {
    setSortedColumn(key);
    console.log("key", key)
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  /*
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  }; */




  // Capitalize For Table Data
  /*
  const capitalizedData = data.map((item) =>
    Object.fromEntries(
      Object.entries(item).map(([key, value]) => [
        key,
        typeof value === 'string'
          ? value
              .toLowerCase()
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
          : value,
      ])
    )
  );
  
  */

  // Function to sort the products based on the current sorting configuration
  const sortedProducts = [...data].sort((a, b) => {
    if (sortConfig !== null) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });


  const filteredDataRef = useRef([]);
/* 
  // Function to filter data based on search queries
  const filterData = (sortedProducts, searchQuery, cols, colSearchQuery) => {
    let currentData = sortedProducts;

    if (!cols || !cols.length || (!searchQuery && !Object.values(colSearchQuery).some(query => query))) {
      return currentData;
    }

    const query = searchQuery ? searchQuery.toLowerCase() : '';

    const filteredResult = currentData.filter((item) => {
      let globalFound = true;
      let columnFound = true;

      // Check global search query
      if (query) {
        globalFound = cols.some((col) => {
          const fieldValue = col?.render?.(item)?.props?.children?.toString().toLowerCase();
          return fieldValue && fieldValue.includes(query);
        });
      }

      // Check column-specific search queries
      if (Object.keys(colSearchQuery).length > 0) {
        columnFound = Object.entries(colSearchQuery).every(([colVal, colQuery]) => {
          const colToSearch = cols.find((col) => col.val === colVal);
          const colValue = colToSearch?.render?.(item)?.props?.children?.toString().toLowerCase();
          return colValue && colValue.includes(colQuery.toLowerCase());
        });
      }

      return globalFound && columnFound;
    });

    filteredDataRef.current = filteredResult;

    return filteredResult;
  };
 */

  // Utility function to get a value from a nested object using dot notation
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((value, key) => {
    return value && value[key] !== undefined ? value[key] : null;
  }, obj);
};
/*
// Function to filter data based on search queries
const filterData = (sortedProducts, searchQuery, cols, colSearchQuery) => {
  let currentData = sortedProducts;

  // Return all data if no columns, global search query, or column-specific search query is present
  if (!cols || !cols.length || (!searchQuery && !Object.values(colSearchQuery).some(query => query))) {
    return currentData;
  }

  // Global search query
  const query = searchQuery ? searchQuery.toLowerCase() : '';

  // Filter results based on global and column-specific search queries
  const filteredResult = currentData.filter((item) => {
    let globalFound = true;
    let columnFound = true;

    // Check global search query
    if (query) {
      globalFound = cols.some((col) => {
        const fieldValue = getFieldValue(item, col);
        return fieldValue.includes(query);
      });
    }
/
    // Check global search query
    if (query) {
      globalFound = cols.some((col) => {
        const fieldValue = col?.render?.(item)?.props?.children?.toString().toLowerCase();
        return fieldValue && fieldValue.includes(query);
      });
    } /

    // Check column-specific search queries
    if (Object.keys(colSearchQuery).length > 0) {
      columnFound = Object.entries(colSearchQuery).every(([colVal, colQuery]) => {
        const fieldValue = getFieldValue(item, cols.find(col => col.val === colVal));
        return fieldValue.includes(colQuery.toLowerCase());
      });
    }

    return globalFound && columnFound;
  }); */
  const filterData = (sortedProducts, searchQuery, cols, colSearchQuery) => {
    let currentData = sortedProducts;
  
    // Return all data if no columns, global search query, or column-specific search query is present
    if (!cols || !cols.length || (!searchQuery && !Object.values(colSearchQuery).some(query => query))) {
      return currentData;
    }
  
    // Global search query
    const query = searchQuery ? searchQuery.toLowerCase() : '';
  
    // Filter results based on global and column-specific search queries
    const filteredResult = currentData.filter((item) => {
      let globalFound = true;
      let columnFound = true;
  
      // Check global search query
      if (query) {
        // Search across all fields if `val` is not specified
        globalFound = Object.values(item).some((fieldValue) => {
          if (fieldValue !== null && fieldValue !== undefined) {
            return fieldValue.toString().toLowerCase().includes(query);
          }
          return false;
        });
  
        // Also search in specific columns defined by `cols`
        if (!globalFound) {
          globalFound = cols.some((col) => {
            const fieldValue = getFieldValue(item, col);
            return fieldValue.includes(query);
          });
        }
      }
  
      // Check column-specific search queries
      if (Object.keys(colSearchQuery).length > 0) {
        columnFound = Object.entries(colSearchQuery).every(([colVal, colQuery]) => {
          const fieldValue = getFieldValue(item, cols.find(col => col.val === colVal));
          return fieldValue.includes(colQuery.toLowerCase());
        });
      }
  
      return globalFound && columnFound;
    });
  
    filteredDataRef.current = filteredResult;
  
    return filteredResult;
  };
  

// Helper function to retrieve field value, considering nested objects and TooltipWrapper components
const getFieldValue = (item, col) => {
  let fieldValue = '';

  // Handle TooltipWrapper components or nested objects
  if (col && col.val) {
    const rawValue = getNestedValue(item, col.val);

    // Handle TooltipWrapper - extract text directly if TooltipWrapper is used
    if (rawValue && typeof rawValue === 'object' && rawValue.props && rawValue.props.text) {
      fieldValue = rawValue.props.text;
    } else if (rawValue !== null && rawValue !== undefined) {
      // If rawValue is not TooltipWrapper, use its string value
      fieldValue = rawValue.toString();
    }
  }

  // Return lowercase string for comparison in search
  return fieldValue.toLowerCase();
};



  // Update the search query state based on user input
  const handleSearchInputChange = (query) => {
    setSearchQuery(query);
  };
  const handleSearchcolumn = (query, colVal) => {
    setColSearchQuery((prevSearchQuery) => ({
      ...prevSearchQuery,
      [colVal]: query,
    }));
    setColVal(colVal);
  };


  const filteredOrders = filterData(sortedProducts, searchQuery, cols, colSearchQuery, colVal);

  const isMobile = useMediaQuery('(max-width:600px)');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

/* 
  useEffect(() => {
    // Create a Set for fast lookup of highlighted items
    const highlightedItemsSet = new Set(
      data.filter((d) => d.highlight).map((d) => d)
    );
  
    // Filter out selectedItems that are now highlighted
    const newSelectedItems = selectedItems.filter(item => !highlightedItemsSet.has(item));
  
    // If any items were removed, update state and call checkBoxEvent
    if (newSelectedItems.length !== selectedItems.length) {
      const removedItems = selectedItems.filter(item => highlightedItemsSet.has(item));
      removedItems.forEach(item => checkBoxEvent(item, false));
      setSelectedItems(newSelectedItems);
    }
  }, [data]);
 */  
  
  // Event handler for individual checkbox in table body
  const handleCheckboxChange = (item, isChecked) => {
    const itemIndex = selectedItems.indexOf(item);
    const newSelectedItems = [...selectedItems];

    if (isChecked && itemIndex === -1) {
        newSelectedItems.push(item);
    } else if (!isChecked && itemIndex !== -1) {
        newSelectedItems.splice(itemIndex, 1);
    }
    setSelectedItems(newSelectedItems);
    checkBoxEvent(item, isChecked);
};

  return (
    <IconContext.Provider style={{margin:"0rem"}} value={{ color: "#6495ED" }}>

      <StyledPaper fullscreen={fullscreen}>
      <Row style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", alignItems: "center", minHeight: "2.5rem",margin:"0rem" }}>
         <Col xs={12} md={2} style={{ display: "flex", paddingLeft: "20px", alignItems: "center", }}>
         {rows && data.length > 0 && (<div style={{ width: "35px" }} onClick={handleToggleFullscreen}>
              {fullscreen ? <StyledCompressIcon /> : <StyledExpandIcon />}
            </div>)}
            <div className={classes.searchWrapper}>
              <label htmlFor="searchleft" className={classes.searchLabel}>
                <input
                  className={classes.extand}
                  type="text"
                  placeholder="Search..."
                  id="searchleft"
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                />
                <span className={classes.searchicon}>
                  <FaIcons.FaSearch style={{ color: '#8c8c89' }} />
                </span>
              </label>
            </div>

          </Col>
          {approvalDate && (  <Col xs={12} md={4} style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
          {approvalDate && !isNaN(Date.parse(approvalDate)) && (
  <div>{format(new Date(approvalDate), 'dd-MM-yyyy')}</div>
)}
          </Col> )}
        {/*   <Col xs={12} md={4}> */}
        <Col>
            {rows && (
              <TablePagination
                stickyHeader
                sx={{
                  padding: "0px",
                  margin: "0px",
                  ".MuiTablePagination-selectLabel": { margin: "0px" },
                  ".MuiTablePagination-displayedRows": { margin: "0px" },
                }}
                rowsPerPageOptions={rowsOptions}
                component="div"
                count={totalElements ? totalElements : data.length}
                rowsPerPage={rowsPerPage}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page'
                  },
                  native: true,
                }}
                page={page}
                onRowsPerPageChange={handleChangeRowsPerPage}
                onPageChange={handleChangePage}
                labelRowsPerPage={isMobile ? "" : "rows per page"}
                className={classes.pagination}
              />
            )}
          </Col>
        </Row>


        <TableContainer
          style={{
            maxHeight: "500px", // Adjust the height as needed
            maxWidth: "100%", // Set the maximum width to 200px
            overflowY: "auto",
            overflowX: "auto",
          }}

        >


          <div >
            <MUITable stickyHeader className={`table table-bordered table-striped`}>
              <TableHead>                <StyledTableRow>
                {includeCheck && <StyledTableCell align={alignCenter}>
                  {/* {<input type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll} />} */}</StyledTableCell>}
                {!hideSNo && (<StyledTableCell align={alignCenter}>S.No</StyledTableCell>)}
                {cols.map((headerItem, index) => (
                  <StyledTableCell key={index} align={alignCenter}
                  >


                    <span style={{ padding: "1px", cursor: "pointer" }} onClick={() => requestSort(headerItem.val)}>
                      {headerItem.title} </span>
                    {sortedColumn === headerItem.val && headerItem.val && (
                      <span>{sortConfig.direction === 'ascending' ? <FaIcons.FaSortUp /> : <FaIcons.FaSortDown />}</span>
                    )}
                    {headerItem.val && (
                      <FaIcons.FaSearch
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleSearchBox(headerItem.val)}
                      />
                    )}
                    {searchBoxesVisibility[headerItem.val] && (
                      <input
                        className={classes.extandcolumn}
                        type="text"
                        placeholder={`Search ${headerItem.title}...`}
                        onChange={(e) =>
                          handleSearchcolumn(e.target.value, headerItem.val)
                        }
                      />
                    )}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
              </TableHead>
              {filteredOrders && (
                <TableBody >
                  {filteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => (
                      <StyledTableRow
                     
                      highlight={!!item.highlight}

                    
                     key={index++}

                      /* style ={ index % 2? { backgroundColor : "#fdffe0" }:
                      { backgroundColor : "yellow" }} */>
                        {includeCheck && (
                           <StyledTableCell align={alignCenter}>
                          {!item.highlight && (
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item)}
                            onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                          />)}</StyledTableCell>
                          )}
                        {!hideSNo && (<StyledTableCell style={{ textAlign: "center" }}>
                          {page * rowsPerPage + index + 1}</StyledTableCell>)}
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
                  {cols.some((col) => col.renderTotal) && (
                    <StyledTableRow>
                      <StyledTableCell style={{ textAlign: "center" }}>Total</StyledTableCell>
                      {cols.map((col, key) => (
                        <StyledTableCell
                          key={key}
                          align={col.align}
                          style={col.renderTotal ? { backgroundColor: "#D3D3D3", textAlign: "center" } : { textAlign: "center" }}
                        >
                          {col.renderTotal && col.renderTotal(filteredOrders)}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  )}
                </TableBody>
              )}
            </MUITable> </div>

        </TableContainer>
      </StyledPaper>


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
