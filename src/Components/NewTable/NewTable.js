// import React, { useEffect } from "react";
///
import { Popover, useMediaQuery } from "@mui/material";
import Paper from "@mui/material/Paper";
import MUITable from "@mui/material/Table/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import "bootstrap/dist/css/bootstrap.min.css";
import { format } from 'date-fns';
import PropTypes from "prop-types";
import React, { useRef, useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as FaIcons from 'react-icons/fa';
import { IconContext } from "react-icons/lib";
import { useDispatch } from "react-redux";
import { filterActions } from "../../store/filter-slice";
import classes from "./NewTable.module.css";
import { FaSync } from 'react-icons/fa';
import { FaRedo } from "react-icons/fa";



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
      backgroundColor: 'white',
      borderBottom: ".2px solid #B1BFC3",
    },
    "&:even)": {
      backgroundColor: '#beeaf7',
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
    backgroundColor: 'white',
    borderBottom: ".2px solid #B1BFC3",
  },
  "&:nth-of-type(even)": {
    backgroundColor: '#e3e9f4',
    borderBottom: ".2px solid #B1BFC3",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
    border: "1px solid ##d9e4fc",
  },
}));

const StyledPaper = styled(Paper)(({ fullscreen }) => ({
  borderRadius: "1rem 1rem 0 0",
  transition: 'box-shadow 0.3s ease-in-out',
  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
  position: fullscreen ? "fixed" : "relative",
  top: fullscreen ? "0" : "auto",
  width: fullscreen ? "90%" : "auto",
  maxWidth: '102%',
  marginTop: '15px',
  marginLeft: '20px',
  marginRight: '20px',
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
const FilterIcon = styled(FaIcons.FaFilter)({
  fontSize: "20px",
  cursor: "pointer",
  marginLeft: "8px",
});

const Table = ({
  template,
  onRowClick,
  selectedRowId,
  
  rowwise,
  validate,
  onCancel,
  buttonName,
  btButtons,
  defaultValues,
  onSubmit,
  title,
  cols,
  data,
  rows,
  showFilterIcon = true,
  loadDataonPageChange,
  counts,
  className,
  includeCheck,
  checkBoxEvent,
  value, onChange, styles, filterFields, onSort,
  totalElements,
  sortOrder,
  enableSearch = true,
  hideSNo, approvalDate, showPlusCircle = false, showPrintIcon = false, showprExcelIcon = false, showExcelIcon = false, handleAddClick, handleExcelIcon, handlePrintIcon
  , handlePrExcelIcon }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rows ? rows : 10);
  const [rowsOptions, setRowsOptions] = React.useState(rows < 10 ? [5, 10, 25, 50, 100] : [10, 25, 50, 100]);
  const [fullscreen, setFullscreen] = useState(false);
  const [filtersAnchorEl, setFiltersAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [colSearchQuery, setColSearchQuery] = useState({});
  const [colVal, setColVal] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [searchBoxesVisibility, setSearchBoxesVisibility] = useState({});
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortedColumn, setSortedColumn] = useState('');
  // const filtersActive = Object.values(colSearchQuery).some(value => value && value.trim() !== "");
  const [filtersActive, setFiltersActive] = useState(false);
  //filter  icon showing
  // const [showFilterIcon, SetshowFilterIcon] = useState(true);


  const filterIconStyle = {
    cursor: "pointer",
    fontSize: "30px",
    color: filtersActive ? "red" : "green",
  };


  useEffect(() => {

    if (selectedRowId && data.length > 0) {
      const preSelected = data.find(
        item => String(item.transactionId) === String(selectedRowId)
      );

      if (preSelected) {
        setSelectedItems([preSelected]);
      }

    } else {
      setSelectedItems([]);

    }
  }, [selectedRowId, data]);

  const requestSort = (key) => {
    setSortedColumn(key);
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };



  const toggleSearchBox = (colVal) => {
    setSearchBoxesVisibility(prev => ({
      ...prev,
      [colVal]: !prev[colVal],
    }));
  };



  const filteredOrders = (() => {
    // Start with sorted products based on current sortConfig and sortedColumn
    const sortedProducts = [...data].sort((a, b) => {
      if (sortConfig !== null && sortConfig.key) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
      }
      return 0;
    });

    // Extract all values recursively for global search
    const extractValues = (obj) => {
      let values = [];
      for (let key in obj) {
        const value = obj[key];
        if (value && typeof value === "object") {
          values = values.concat(extractValues(value));
        } else {
          values.push(value);
        }
      }
      return values;
    };

    // Function to get nested value for column-based search
    const getFieldValue = (item, col) => {
      if (!col || !col.val) return '';
      const path = col.val;
      const fieldValue = path.split('.').reduce((val, key) => val && val[key] !== undefined ? val[key] : null, item);
      if (fieldValue && typeof fieldValue === 'object' && fieldValue.props && fieldValue.props.text) {
        return fieldValue.props.text.toLowerCase();
      }
      return fieldValue ? fieldValue.toString().toLowerCase() : '';
    };

    // Filter based on global search and column specific searches
    return sortedProducts.filter(item => {
      let globalFound = true;
      let columnFound = true;

      // Global search query
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        globalFound = extractValues(item).some(val =>
          val !== null && val !== undefined && val.toString().toLowerCase().includes(lowerQuery)
        );
      }

      // Column search queries
      if (Object.keys(colSearchQuery).length > 0) {
        columnFound = Object.entries(colSearchQuery).every(([colVal, colQuery]) => {
          const col = cols.find(c => c.val === colVal);
          if (!col) return true; // skip unknown columns
          const fieldValue = getFieldValue(item, col);
          return fieldValue.includes(colQuery.toLowerCase());
        });
      }

      return globalFound && columnFound;
    });
  })();

  // Handlers for pagination
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const { register, handleSubmit, reset, setValue, getValues, watch, formState: { errors }, clearErrors } = useForm({ defaultValues: { ...defaultValues } });

  //   const onSubmit = (values) => {
  //   // For each filter field, update the relevant filter state
  //   setColSearchQuery(values); 
  //   // Optionally also set global searchQuery or other special states
  // };

  const handleRefreshFilters = () => {
    reset(defaultValues); // reset filters to initial values
    setColSearchQuery({});
    setFiltersActive(false);
   if (onSubmit) {
  onSubmit({});
}
  };
  // const watchedFilters = watch(); // watch all filter fields

  // const [filtersActive, setFiltersActive] = useState(false);

  // useEffect(() => {
  //   const isActive = Object.entries(watchedFilters).some(([key, value]) => {
  //     if (value === undefined || value === null) return false;
  //     // Compare with defaultValues to detect changes:
  //     return value !== defaultValues[key] && value !== "" && value !== "0";
  //   });
  //   setFiltersActive(isActive);
  // }, [watchedFilters, defaultValues]);


  // Sorting handlers omitted for brevity...

  const handleToggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // --- Filter popup handlers ---
  const handleFilterIconClick = (event) => {
    setFiltersAnchorEl(event.currentTarget);
  };
  const handleFilterPopoverClose = () => {
    setFiltersAnchorEl(null);
  };
  const isFilterPopoverOpen = Boolean(filtersAnchorEl);

  const handleFilterSubmit = (values) => {
    setColSearchQuery(values);
    const hasActiveFilters = Object.values(values).some(val => val && val.toString().trim() !== "");
    setFiltersActive(hasActiveFilters);
    if (onSubmit) {

      onSubmit(values);

    }
  }

  // --- Render function for filter fields ---
  const renderFilterField = (field) => {
    const name = field.name;
    const title = field.title;
    const options = field.options || [];
    const registerOptions = {
      required: field.validationProps || false,
      validate: (value) => {
        if (field.inpprops?.isAvailable) {
          return field.inpprops?.errorMsg || "Please select a valid option.";
        }
        return true;
      },
    };
    switch (field.type) {
      case "select":
        return (
          <Form.Select
            id={name}
            {...register(name, registerOptions)}
            className={field.dynamicclassname ? classes[field.dynamicclassname] : classes.formBorder}
          >
            {/* <option value="">-- Select {title} --</option> */}
            {options.map(({ value, label, group }, index) => {
              if (group) {
                const isGroupRendered = options.slice(0, index).some((opt) => opt.group === group);
                if (isGroupRendered) return null;
                return (
                  <optgroup label={group} key={group}>
                    {options.filter(opt => opt.group === group).map(opt => (
                      <option value={opt.value} key={opt.value}>{opt.label}</option>
                    ))}
                  </optgroup>
                );
              }
              return <option value={value} key={index}>{label}</option>;
            })}
          </Form.Select>
        );
      case "date":
        return (
          <Form.Control
            type="date"
            id={name}
            {...register(name, registerOptions)}
            className={field.dynamicclassname ? classes[field.dynamicclassname] : classes.formBorder}
          />
        );
      case "text":
      default:
        return (
          <Form.Control
            type={field.type || "text"}
            id={name}
            {...register(name, registerOptions)}
            className={field.dynamicclassname ? classes[field.dynamicclassname] : classes.formBorder}
          />
        );
    }
  };

  return (
    <IconContext.Provider value={{ color: "#6495ED" }}>
      <StyledPaper fullscreen={fullscreen}>
        {/* Header row with search, title, icons */}
        <Row style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "center",
          backgroundColor: "white",
          color: "black",
          padding: "0.5rem 1rem",
          margin: 0,
          minHeight: "3rem",
          width: "100%",
          borderRadius: "1rem 1rem 0 0",
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        }}>
          {/* Left: fullscreen toggle + search */}
          <Col xs={12} md={3} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {rows && (
              <div onClick={handleToggleFullscreen} style={{ cursor: "pointer" }}>
                {fullscreen ? <StyledCompressIcon /> : <StyledExpandIcon />}
              </div>
            )}
            {enableSearch && (<input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={classes.searchBar}
            />)}
          </Col>
          {/* Center: Title */}
          <Col xs={12} md={6} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h4 className={classes.title} style={{ margin: 0 }}>{title || ""}</h4>
          </Col>
          {/* Right: icons + filter icon */}
          <Col xs={12} md={3} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px" }}>
            {showExcelIcon && (
              <FaIcons.FaFileExcel color="red" className={classes.showExcelIcon} onClick={handleExcelIcon || (() => { })} />
            )}
            {showprExcelIcon && (
              <FaIcons.FaFileExcel color="blue" className={classes.showExcelIcon} onClick={handlePrExcelIcon || (() => { })} />
            )}
            {showPrintIcon && (
              <FaIcons.FaPrint color="blue" className={classes.showPrintIcon} onClick={handlePrintIcon || (() => { })} />
            )}
            {showPlusCircle && (
              <FaIcons.FaPlusCircle color="#000" className={classes.showPlusCircle} onClick={handleAddClick || (() => { })} />
            )}
            {/* Filter icon */}
            {showFilterIcon && (
              <FaIcons.FaFilter
                onClick={handleFilterIconClick}
                style={filterIconStyle}
                title={filtersActive ? "Filters applied" : "No filters applied"}
              />
            )}
          </Col>
        </Row>

        {/* Data Table */}
        <TableContainer style={{ maxHeight: "650px", width: "100%", overflowY: "auto", overflowX: "auto" }}>
          <div>
            <MUITable stickyHeader className={`table table-bordered table-striped`}>
              <TableHead>
                <StyledTableRow>
                  {includeCheck && <StyledTableCell align="center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectAll(checked);
                        // const newSelected = checked ? data.filter(i => !selectedItems.includes(i)) : [];
                        // setSelectedItems(prev => [...prev, ...newSelected]);
                        // newSelected.forEach(i => checkBoxEvent(i, checked));


                        if (checked) {

                          setSelectedItems(data);
                          data.forEach(item => checkBoxEvent(item, true));
                        } else {

                          setSelectedItems([]);
                          data.forEach(item => checkBoxEvent(item, false));
                        }
                      }}
                    />
                  </StyledTableCell>}
                  {!hideSNo && (<StyledTableCell align="center">S.No</StyledTableCell>)}
                  {cols.map((headerItem, index) => (
                    <StyledTableCell key={index} align="center" style={{ cursor: 'pointer', position: "relative" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span onClick={() => requestSort(headerItem.val)}>{headerItem.title}</span>
                        {sortedColumn === headerItem.val && (
                          <span>{sortConfig.direction === 'ascending' ? <FaIcons.FaSortUp /> : <FaIcons.FaSortDown />}</span>
                        )}
                        {headerItem.val && enableSearch && (
                          <FaIcons.FaSearch style={{ cursor: "pointer", marginLeft: "8px" }} onClick={() => toggleSearchBox(headerItem.val)} />
                        )}
                      </div>
                      {searchBoxesVisibility[headerItem.val] && (
                        <input
                          className={classes.extandcolumn}
                          type="text"
                          placeholder={`Search ${headerItem.title}...`}
                          onChange={(e) => {
                            setColSearchQuery(prev => ({ ...prev, [headerItem.val]: e.target.value }));
                            setColVal(headerItem.val);
                          }}
                        />
                      )}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              {filteredOrders && (
                <TableBody>
                  {filteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => {
                      // Correct Syntax: ID matching logic
                      const isRowSelected = selectedRowId && String(item.transactionId) === String(selectedRowId);

                      return (
                        <StyledTableRow
                          key={index}
                          onClick={() => onRowClick && onRowClick(item)}
                          style={{
                            cursor: "pointer",
                            // Selection highlight logic
                            backgroundColor: isRowSelected ? "#fff9c4" : undefined,
                            border: isRowSelected ? "2px solid #ffd600" : "inherit",
                          }}
                        >
                          {includeCheck && (
                            <StyledTableCell align="center">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item)}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  const idx = selectedItems.indexOf(item);
                                  const newSelected = [...selectedItems];
                                  if (isChecked && idx === -1) newSelected.push(item);
                                  else if (!isChecked && idx !== -1) newSelected.splice(idx, 1);
                                  setSelectedItems(newSelected);
                                  checkBoxEvent(item, isChecked);
                                }}
                              />
                            </StyledTableCell>
                          )}
                          {!hideSNo && (
                            <StyledTableCell style={{ textAlign: "center" }}>
                              {page * rowsPerPage + index + 1}
                            </StyledTableCell>
                          )}
                          {cols.map((col, key) => (
                            <StyledTableCell
                              key={key}
                              align={col.align}
                              className={col.hover && classes.hoverclass}
                              style={{ fontWeight: isRowSelected ? "bold" : "normal" }}
                            >
                              {col.render(item)}
                            </StyledTableCell>
                          ))}
                        </StyledTableRow>
                      );
                    })}

                  {/* Total Row Logic */}
                  {cols.some((col) => col.renderTotal) && (
                    <StyledTableRow>
                      {!hideSNo && <StyledTableCell style={{ textAlign: "center" }}>Total</StyledTableCell>}
                      {includeCheck && <StyledTableCell />}
                      {cols.map((col, key) => (
                        <StyledTableCell
                          key={key}
                          align={col.align}
                          style={
                            col.renderTotal
                              ? { backgroundColor: "#D3D3D3", textAlign: "center", fontWeight: "bold" }
                              : { textAlign: "center" }
                          }
                        >
                          {col.renderTotal && col.renderTotal(filteredOrders)}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  )}
                </TableBody>
              )}
            </MUITable>
          </div>
          {rows && (
            <TablePagination
              rowsPerPageOptions={rowsOptions}
              component="div"
              // mx={{
              //   display: 'flex',
              //   justifyContent: 'space-between',
              //   alignItems: 'center',
              //   px: 2,
              // }}
              count={totalElements ? totalElements : data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onRowsPerPageChange={handleChangeRowsPerPage}
              onPageChange={handleChangePage}
              labelRowsPerPage={isMobile ? "" : "Rows per page"}
              className={classes.pagination}

            />
          )}
        </TableContainer>

        {/* Filter Popover */}
        <Popover
          open={isFilterPopoverOpen}
          anchorEl={filtersAnchorEl}
          onClose={handleFilterPopoverClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <form onSubmit={handleSubmit(handleFilterSubmit)}>
              {template?.fields?.filter((field) => field.type !== "hidden")?.map((field) => (
                <Col key={field.name} style={{ marginBottom: "10px" }}>
                  <Form.Label htmlFor={field.name}>{field.title}</Form.Label>
                  {renderFilterField(field)}
                </Col>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button type="submit" className={classes.btn}>Apply</Button>
                <FaRedo
                  title="Refresh Filters"
                  onClick={handleRefreshFilters}
                  style={{ cursor: "pointer", fontSize: "20px", color: "gray" }}
                />
              </div>

            </form>
          </div>
        </Popover>
      </StyledPaper>
    </IconContext.Provider>
  );
}

export default Table;
