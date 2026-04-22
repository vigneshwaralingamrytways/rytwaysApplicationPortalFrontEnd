import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Table as BootstrapTable, Button } from "react-bootstrap";
import classes from "./NewTable.module.css";
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
import { CheckBox, Height } from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import LastPageIcon from "@mui/icons-material/LastPage";
import TableHead from "@mui/material/TableHead";
import { styled } from "@mui/material/styles";
import * as FaIcons from 'react-icons/fa';
import { MenuItem, Popover, TextField, useMediaQuery } from "@mui/material";
import { format } from 'date-fns';
import { useDispatch } from "react-redux";
import { filterActions } from "../../store/filter-slice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#01495e;",
    color: theme.palette.common.white,
    border: "1px solid #2f62ed",
    fontSize: "14px",
    fontFamily: 'Arial',
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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
    fontSize: "13px",
    fontFamily: 'Arial',
    height: "1vh"
  },
}));



const StyledTableRow = styled(TableRow)(({ theme }) => ({
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
    border: "1px solid #d9e4fc",
  },

}));

const StyledPaper = styled(Paper)(({ fullscreen }) => ({
  borderRadius: "1rem 1rem 0 0",
  transition: 'box-shadow 0.3s ease-in-out', // Add transition for a smooth effect
  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
  position: fullscreen ? "fixed" : "relative", // Fix the position when fullscreen is toggled
  top: fullscreen ? "0" : "auto",
  width: fullscreen ? "90%" : "auto",
  maxWidth: '102%',

  '&:hover': {
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',

  },
}));
const StyledCompressIcon = styled(FaIcons.FaCompress)({
  fontSize: "20px",
  color: "black !important",
  transition: "transform 0.2s",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.2)",
  },
});

const StyledExpandIcon = styled(FaIcons.FaExpand)({
  fontSize: "20px",
  color: "black !important",
  transition: "transform 0.2s",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.2)",
  },
});

const Table = ({
  searchFields,
  handleDealerChange,
  anchorEl,
  handleClose,
  filters,
  setFilters,
  handleApplyFilter,
  handleFilterChange,
  handleFilterClick,
  filterColor,
  title,
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
  enableSearch =  false,
  hideSNo, approvalDate, showPlusCircle = false, handleAddClick,showPrintIcon = false,handlePrintIcon,showExcelIcon=false,handleExcelIcon
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rows ? rows : 10);
  const [rowsOptions, setRowsOptions] = React.useState(rows < 10 ? [5, 10, 25, 50, 100] : [10, 25, 50, 100]);
  const [fullscreen, setFullscreen] = useState(false);
   const dispatch = useDispatch()
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

    function extractValues(obj) {
  let values = [];

  for (let key in obj) {
    const value = obj[key];

    if (value && typeof value === "object") {
      values = values.concat(extractValues(value)); // recurse for nested objects
    } else {
      values.push(value);
    }
  }

  return values;
}

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
        globalFound = extractValues(item).some((fieldValue) => {
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


  const filteredOrders = enableSearch? filterData(sortedProducts, searchQuery, cols, colSearchQuery, colVal):sortedProducts;

  const isMobile = useMediaQuery('(max-width:600px)');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Event handler for header checkbox
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    // Filter out items that are already present in selectedItems
    const newSelectedItems = checked ? data.filter(item => !selectedItems.includes(item)) : [];

    // Add new items to selectedItems
    setSelectedItems(prevSelectedItems => [...prevSelectedItems, ...newSelectedItems]);

    // Call checkBoxEvent for each new item
    newSelectedItems.forEach((item) => {
      checkBoxEvent(item, checked);
    });
  };



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

  const [errors, setErrors] = useState({})
  const handleApply = () => {
    const newErrors = {};

    searchFields?.forEach((field) => {
      if (field.required && !filters?.[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleApplyFilter?.(); // only call if no errors
    }
  };

  return (
    <IconContext.Provider style={{ margin: "0rem" }} value={{ color: "#6495ED" }}>

      <StyledPaper fullscreen={fullscreen}>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "center",
            flexWrap: "wrap",
            backgroundColor: "white",
            color: "black",
            padding: "0.5rem 1rem",
            margin: 0,
            minHeight: "3rem",
            width: "100%",
            borderRadius: "1rem 1rem 0 0",
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          }}
        >
          {/* Left Section: Fullscreen toggle + Search */}
          <Col xs={12} md={3} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {rows && (
              <div onClick={handleToggleFullscreen} style={{ cursor: "pointer" }}>
                {fullscreen ? (
                  <StyledCompressIcon style={{ fontSize: "20px" }} />
                ) : (
                  <StyledExpandIcon style={{ fontSize: "20px" }} />
                )}
              </div>
            )}

            {/* Search input */}
            {enableSearch && (
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              className={classes.searchBar}
            />)}
          </Col>

          {/* Title */}
          <Col xs={12} md={6} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h4 className={classes.title} style={{ margin: 0 }}>{title || ""}</h4>
          </Col>

          {/* Approval Date */}
          {approvalDate && (
            <Col xs={12} md={3} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              {!isNaN(Date.parse(approvalDate)) && (
                <div>{format(new Date(approvalDate), 'dd-MM-yyyy')}</div>
              )}
            </Col>
          )}



          {/* Filter icon */}
          <Col xs={12} md={3} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center",gap:"10px" }}>
              {showExcelIcon && (
              <FaIcons.FaFileExcel
                color="red"
                className={classes.showExcelIcon}
                onClick={handleExcelIcon || (() => { })}
                // style={{ fontSize: "20px", cursor: "pointer" }}
              />
            )}
             {showPrintIcon && (
              <FaIcons.FaPrint
                color="blue"
                className={classes.showPrintIcon}
                onClick={handlePrintIcon || (() => { })}
                // style={{ fontSize: "20px", cursor: "pointer" }}
              />
            )}
           {showPlusCircle && (
              <FaIcons.FaPlusCircle
                color="#000"
                className={classes.showPlusCircle}
                onClick={handleAddClick || (() => { })}
                // style={{ fontSize: "20px", cursor: "pointer" }}
              />
            )}
            {filters && (
              <FaIcons.FaFilter
                title="Filter"
                className={classes.showFilter}
                color={filterColor || "green"}
                onClick={handleFilterClick}
                // style={{ fontSize: "20px", cursor: "pointer" }}
              />
            )}
          </Col>
        </Row>
        <TableContainer
          style={{
            maxHeight: "550px", // Adjust the height as needed
            width: "100%", // Set the maximum width to 200px
            overflowY: "auto",
            overflowX: "auto",
          }}

        >

          <div >
            <MUITable stickyHeader className={`table table-bordered table-striped`}>
              <TableHead>                <StyledTableRow>
                {includeCheck && <StyledTableCell align={alignCenter}>
                  {<input type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll} />}</StyledTableCell>}
                {!hideSNo && (<StyledTableCell align={alignCenter}>S.No</StyledTableCell>)}
                {cols.map((headerItem, index) => (
                  <StyledTableCell key={index} align={alignCenter}
                  >


                    <span style={{ padding: "1px", cursor: "pointer" }} onClick={() => requestSort(headerItem.val)}>
                      {headerItem.title} </span>
                    {sortedColumn === headerItem.val && headerItem.val && (
                      <span>{sortConfig.direction === 'ascending' ? <FaIcons.FaSortUp /> : <FaIcons.FaSortDown />}</span>
                    )}
                    {headerItem.val && enableSearch&&(
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
              {filteredOrders && (<>
                <TableBody >
                  {filteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => (
                      <StyledTableRow key={index++}

                      /* style ={ index % 2? { backgroundColor : "#fdffe0" }:
                      { backgroundColor : "yellow" }} */>
                        {includeCheck && <StyledTableCell align={alignCenter}>
                          {<input
                            type="checkbox"
                            checked={selectedItems.includes(item)}
                            onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                          />}</StyledTableCell>}
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

              </>
              )}

            </MUITable>

          </div>
          {rows && (
            <>
              <TablePagination

                // sx={{
                //   padding: "0px",
                //   margin: "0px",
                //   ".MuiTablePagination-selectLabel": { margin: "0px" },
                //   ".MuiTablePagination-displayedRows": { margin: "0px" },
                // }}
                sx={{
                  display: "block",
                  minHeight: "32px",
                  height: "32px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  "& .MuiTablePagination-toolbar": {
                    minHeight: "32px",
                    height: "32px",
                    paddingTop: 0,
                  },
                  "& .MuiInputBase-root": {
                    fontSize: "12px",
                    height: "32px",
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                    margin: 0,
                    fontSize: "12px",
                  },
                  "& .MuiTablePagination-actions": {
                    height: "32px",
                    marginBottom: "10px"
                  },
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
            </>
          )}
        </TableContainer>

      </StyledPaper>
      {/* <Col style={{backgroundColor:"red",paddingTop:"8px",display:"block"}}> */}

      {/* </Col>  */}

      <Popover
        open={Boolean(anchorEl || false)}
        anchorEl={anchorEl || ""}
        onClose={handleClose || (() => { })}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, width: 250 }}>
          {/* {searchFields?.map((field) => {
            const value = filters?.[field.name] || '';
            const showError = errors[field.name];

            const commonProps = {
              key: field.name,
              label: field.label,
              name: field.name,
              value,
              onChange: handleFilterChange || (() => { }),
              size: "small",
              error: Boolean(showError),
              helperText: showError,
            };

            return field.type === "select" ? (
              <TextField {...commonProps} select>
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                {...commonProps}
                type={field.type}
                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
              />
            );
          })} */}
          {searchFields?.filter(field => field.type !== "hidden")
          ?.map((field) => {
            const value = filters?.[field.name] || '';
            const showError = errors[field.name];

            // Default onChange
            let onChange = handleFilterChange || (() => { });

            // Custom onChange for "dealerDirectCustomer"
            if (field.name === "dealerDirectCustomer") {
              onChange = (e) => {
                const dealerId = e.target.value;
                handleDealerChange(dealerId); // <-- your async fetch for customers
                handleFilterChange(e); // <-- update form filters as usual
              };
            }

            const commonProps = {
              key: field.name,
              label: field.label,
              name: field.name,
              value,
              onChange,
              size: "small",
              error: Boolean(showError),
              helperText: showError,
            };

            return field.type === "select" ? (
              <TextField {...commonProps} select>
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                {...commonProps}
                type={field.type}
                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
              />
            );
          })}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="primary"
              size="small"
              onClick={handleApply || (() => { })}
            >
              Apply
            </Button>

            <FaIcons.FaUndo
              title="Reset Filters"
              style={{
                color: '#555',
                cursor: 'pointer',
                fontSize: '18px',
                transition: 'transform 0.2s'
              }}
              onClick={() => {
                dispatch(
                  filterActions.removeFilters({
                    ...filters
                  })
                )
                const reset = {};
                searchFields?.forEach(field => reset[field.name] = '');
                setFilters(reset);
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
        </div>
      </Popover>
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

