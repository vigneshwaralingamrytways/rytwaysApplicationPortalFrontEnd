import styles from "./SalesBoard.module.css";
import React, { useCallback, useEffect, useState } from "react";
import UploadPayment from "./UploadPayment";
import { useHistory } from "react-router-dom";
import {
  CreateForm,
  api,
  useFetch,
  alertActions,
  modalActions,
  useDispatch,
  useSelector,
  classes,
  Popupcard,
  NewTable,
} from "../../Components/CommonImports/CommonImports";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell, BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import jsPDF from "jspdf";
import { Download } from "lucide-react";

import SalesSummaryTable from "./SalesSummaryTable";
import { FaBackward } from "react-icons/fa";




const COLORS = ["#00d4ff", "#7c3aed", "#ff4ecd"];
const getCurrentFinancialYear = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  return month >= 4
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`;
};
export default function SalesDashboard() {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleBackNavigation = () => {
    history.push("/ManageCompanyBankAccount")

  };



  const [customerCatagoryOptions, setCustomerCatagoryOptions] = useState([]);
  /* Date Inputs */
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* KPI Dynamic State */
  const [kpiData, setKpiData] = useState({});
  const [customerWise, setCustomerWise] = useState(false);
  const [selectedCustomerGroup, setSelectedCustomerGroup] = useState("");

  /* PIE Dynamic State */
  const [pieData, setPieData] = useState([]);

  /* Bank Balance Search State (Independent) */
  const [bankDate, setBankDate] = useState("");
  const [bankBalanceValue, setBankBalanceValue] = useState(920.0);

  /* Graph Data */
  const [lineChartData, setLineChartData] = useState([]);
  const [activeYear, setActiveYear] = useState(getCurrentFinancialYear());
  const [activeGroup, setActiveGroup] = useState("group1");


  const [allPurchases, setAllPurchases] = useState([]);
  const [salesAgingData, setSalesAgingData] = useState([]);
  const [filteredKpiData, setFilteredKpiData] = useState({});
  const [filteredAgingData, setFilteredAgingData] = useState([]);
  const [salesNetTotal, setSalesNetTotal] = useState(0);
  const [salesPaid, setSalesPaid] = useState(0);
  const [salesTds, setSalesTds] = useState(0);
  const [salesBalance, setSalesBalance] = useState(0);
  const [purchaseNetTotal, setPurchaseNetTotal] = useState(0);
  const [agingTableTitle, setAgingTableTitle] = useState("Net Receivable Summary");
  const [purchases, setPurchases] = useState([]);
  const [purchasesPaid, setPurchasesPaid] = useState([]);
  const [purchasesBalance, setPurchasesBalance] = useState([]);


  const [Saless, setSaless] = useState([]);

  const [salesPerformance, setSalesPerformance] = useState([]);

  /* Selected Payment Click */
  const [selectedPayment, setSelectedPayment] = useState("receivable");

  /* Filters */
  const [filterType, setFilterType] = useState("financial");
  const [filterValue, setFilterValue] = useState(getCurrentFinancialYear());



  const { get, post, del, response } = useFetch({ data: [] });



  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);

  const AlertHandler = (msg, type) => {
    dispatch(alertActions.showAlertHandler({
      showAlert: !showAlert,
      alertMessage: msg,
      alertVariant: type
    }));
  };


  const buildChartData = useCallback((selectedYear = null) => {
    const months = [
      "Apr", "May", "Jun", "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"
    ];
    return months.map((m, index) => {
      // const monthNo = index + 1;

      let monthNo;
      if (index <= 8) {
        monthNo = index + 4;
      } else {
        monthNo = index - 8;
      }
      const row = { month: m };
      customerCatagoryOptions.forEach((cat) => {
        const match = salesPerformance.find((d) => {
          const isCategoryMatch = d.customerCategory === cat.label;
          const isMonthMatch = d.month === monthNo;

          if (selectedYear) {
            const [startYear, endYear] = selectedYear.split("-");
            const targetYear = monthNo <= 3 ? parseInt(endYear) : parseInt(startYear);
            return isCategoryMatch && isMonthMatch && d.year === targetYear;
          }

          return isCategoryMatch && isMonthMatch;
        });

        row[cat.label] = match ? match.grossAmount : 0;
      });

      return row;
      // customerCatagoryOptions.forEach((cat) => {
      //   const match = salesPerformance.find(
      //     (d) => d.customerCategory === cat.label && d.month === monthNo

      //   );
      //   row[cat.label] = match ? match.grossAmount : 0;
      // });
      // return row;


      // const match = salesPerformance.find(
      //   d =>
      //     d.customerCategory === category &&
      //     d.month === monthNo
      // );

      // return {
      //   month: m,
      //   value: match ? match.grossAmount : 0
      // };
    });
  }, [salesPerformance, customerCatagoryOptions]);

  const computedBankBalance = () => {
    const received = kpiData.salesPaid || 0;
    const totalTds = kpiData.salesTds || 0
    const purchases = kpiData.purchasePaid || 0;
    const expenses = kpiData.expenses || 0;
    console.log("balance as on date: recived ", received + " -purchase-" + purchases + " expense-- " + expenses)
    const bal = (received) - (purchases + expenses)
    console.log(" bank balanace as on today", bal)
    return bal;
  };

  const loadSalesAging = useCallback(async (type = "SALES") => {
    try {
      const data = await get(`${api}/invoiceHeader/salesAgingReport/${type}`);
      if (response.ok && Array.isArray(data)) {
        console.log("response for aging report:", data)
        const agingOrder = ["0-30", "31-60", "61-90", "91-120", "120+"];
        const formattedData = agingOrder.map((key) => ({
          name: key,
          value: data[0][key] || 0
        }));

        setSalesAgingData(formattedData);
      }
    } catch (err) {
      console.error("Failed to load sales aging:", err);
    }
  }, [get, response]);
  const loadSalesPerformance = useCallback(async () => {
    const data = await get(api + "/invoiceHeader/salesPerformance");
    console.log("data for load sales perf", data)
    if (response.ok && Array.isArray(data)) {
      // setSalesPerformance(data);
      setSalesPerformance(data);
      setCustomerWise(false);
      const currentFY = getCurrentFinancialYear();
      setLineChartData(buildChartData(currentFY));


      console.log("sales performance: month wise", data)

    }
  }, [get, response, buildChartData]);


  const loadServiceBreakdown = useCallback(async (year = null) => {
    const currentYear = year || filterValue || getCurrentFinancialYear();
    const data = await post(api + "/invoiceDetails/getAllServiceTypeByFinancialYeer", {
      type: "SALES",
      year: currentYear
    });
    if (response.ok && Array.isArray(data)) {
      const formattedPieData = data.map(item => ({
        name: item.serviceTypeName,
        value: item.totalValue
      }));
      setPieData(formattedPieData);
    }
  }, [get, response, filterValue]);


  const loadPaymentSummaries = useCallback(async () => {
    const salesSumm = await get(api + "/makePayment/summary/SALES");
    const purchaseSumm = await get(api + "/makePayment/summary/PURCHASE");
    console.log("sales summary", salesSumm)
    console.log("purchase summary", purchaseSumm)
    if (response.ok) {
      setKpiData(prev => ({
        ...prev,
        salesTds: salesSumm?.totalTds || 0,
        salesPaid: salesSumm?.totalPaidAmount || 0,
        salesBalance: salesSumm?.totalBalanceAmount || 0,
        salesNetTotal: salesSumm?.netTotal || 0,
        purchasePaid: purchaseSumm?.totalPaidAmount || 0,
        purchaseBalance: purchaseSumm?.totalBalanceAmount || 0
      }));
      setSalesTds(salesSumm?.totalTds || 0);
      setSalesPaid(salesSumm?.totalPaidAmount || 0);
      setSalesBalance(salesSumm?.totalBalanceAmount || 0)
      setPurchasesBalance(purchaseSumm?.totalBalanceAmount || 0)
      setPurchasesPaid(purchaseSumm?.totalPaidAmount || 0,)
    }
  }, [get, response]);
  // const loadNetTotal = useCallback(async () => {

  //   try {
  //     const SALES = await get(api + "/invoiceHeader/getGrandNetTotal/SALES");
  //     const PURCHASE = await get(api + "/invoiceHeader/getGrandNetTotal/PURCHASE");
  //     const SALES_SUMMARY = await get(api + "/makePayment/summary/SALES");
  //     const PURCHASE_SUMMARY = await get(api + "/makePayment/summary/PURCHASE");
  //     const SALES_PERFORMANCE = await get(api + "/invoiceHeader/salesPerformance");
  //       const TotalNetReveneue = await get(api + "/invoiceHeader/getTotalNetRevenue");
  //     // getAllServiceTypesNetTotal
  //     // getTotalNetRevenue
  //     const SALES_Service = await get(api + "/invoiceDetails/getAllServiceTypesNetTotal/SALES");

  //     const EXPENSES = await get(api + "/manageExpense/getTotalExpense");
  //     console.log("sales nettotal", SALES)
  //     console.log("purchase nettotal", PURCHASE)
  //     console.log(" expenses", EXPENSES)
  //     console.log("Sales service ", SALES_Service)
  //     console.log("sales performance: month wise",salesPerformance)
  //     if (response.ok) {
  //       if (SALES_Service && Array.isArray(SALES_Service)) {
  //         const formattedPieData = SALES_Service.map(item => ({
  //           name: item.serviceTypeName,
  //           value: item.totalValue
  //         }));
  //         setPieData(formattedPieData);
  //       }
  //       if (SALES_PERFORMANCE && Array.isArray(SALES_PERFORMANCE)) {
  //         setSalesPerformance(SALES_PERFORMANCE)
  //         const catagoires = [
  //           ...new Set(SALES_PERFORMANCE.map(i => i.customerCategory))];
  //         setCategories(catagoires);
  //       }
  //       setSalesNetTotal(SALES)
  //       setPurchaseNetTotal(PURCHASE)
  //       setKpiData(prev => ({
  //         ...prev,
  //         sales: SALES,
  //         purchase: PURCHASE,
  //         expenses: EXPENSES,
  //         netRevenue:TotalNetReveneue,
  //         salesTds: SALES_SUMMARY?.totalTds || 0,
  //         salesPaid: SALES_SUMMARY?.totalPaidAmount || 0,
  //         salesBalance: SALES_SUMMARY?.totalBalanceAmount || 0,

  //         purchasePaid: PURCHASE_SUMMARY?.totalPaidAmount || 0,
  //         purchaseBalance: PURCHASE_SUMMARY?.totalBalanceAmount || 0
  //       }));
  //     }
  //   } catch (error) {
  //     console.log("Error loading dashboard data:", error);

  //   }


  // }, [get, response]);

  const loadGrandTotals = useCallback(async () => {
    const salesTotal = await get(api + "/invoiceHeader/getGrandNetTotal/SALES");
    const purchaseTotal = await get(api + "/invoiceHeader/getGrandNetTotal/PURCHASE");
    const revenueTotal = await get(api + "/invoiceHeader/getTotalNetRevenue");
    const expenseTotal = await get(api + "/manageExpense/getTotalExpense");

    if (response.ok) {
       
      setSalesNetTotal(salesTotal);
      setPurchaseNetTotal(purchaseTotal);
      setKpiData(prev => ({
        ...prev,
        sales: salesTotal,
        purchase: purchaseTotal,
        expenses: expenseTotal,
        netRevenue: revenueTotal
      }));
    }
  }, [get, response]);
  useEffect(() => {

    if (salesPerformance.length > 0 && customerCatagoryOptions.length > 0) {

      setLineChartData(buildChartData(filterValue));

    }

  }, [salesPerformance, customerCatagoryOptions, buildChartData, filterValue]);
  useEffect(() => {
    loadSalesPerformance();
    loadServiceBreakdown();
    loadGrandTotals();
    loadPaymentSummaries();
    loadSalesAging();
  }, []);
  /* Download PDF */
  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Business Performance Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`From Date: ${fromDate}`, 20, 35);
    doc.text(`To Date: ${toDate}`, 20, 45);

    doc.text("KPI Summary:", 20, 60);
    doc.text("Sales: 366.0", 30, 70);
    doc.text("Purchases: 155.1", 30, 80);
    doc.text("Expenses: 583.0", 30, 90);
    doc.text("Net Revenue: 628.0", 30, 100);

    doc.save("Sales_Report.pdf");
  };

  const handleSearchGraph = () => {
    if (!filterType || !filterValue) {
      alert("Please select both filter type and option!");
      return;
    }

    if (filterType === "financial") {
      setCustomerWise(false);
      setActiveYear(filterValue);
      setLineChartData(buildChartData(filterValue));
      loadServiceBreakdown(filterValue);

    }

    if (filterType === "customer") {
      // setSelectedCustomerGroup(filterValue); // group1 or group2
      // setCustomerWise(true);
      setCustomerWise(true);
      setSelectedCustomerGroup(filterValue);
      setLineChartData(buildChartData(null));
      loadServiceBreakdown(getCurrentFinancialYear());
    }
  };
  const formatCurrency = (amount) => {
    let value = typeof amount === "object" ? amount?.total : amount;
    const numericValue = Number(value) || 0;
    //rupees Symbol--₹
    const formattedNumber = numericValue.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return formattedNumber
  };


  const loadCustomerCatagory = useCallback(async () => {
    try {
      const data = await get(api + "/customerCatagory/getAll");
      console.log("load customer Catagory,", data)
      if (response.ok) {
        const options = [
          { value: "all", label: "All" },
          ...data.map(item => ({ value: item.customerCatagoryId, label: item.customerCatagory }))
        ];
        setCustomerCatagoryOptions(options);

      }
    } catch (err) {
      console.log("Failed to load catagoires", err);
    }
  }, [get, response]);
  useEffect(() => {
    loadCustomerCatagory();
  }, [loadCustomerCatagory]);


  const handleFilterSubmit = () => {
    if (!fromDate || !toDate) {
      AlertHandler("Please select both From and To dates", "danger");
      return;
    }

    const start = new Date(fromDate).setHours(0, 0, 0, 0);
    const end = new Date(toDate).setHours(23, 59, 59, 999);

    const filteredSalesList = Saless.filter(item => {
      const d = new Date(item.createdOn || item.invoiceDate).getTime();
      return d >= start && d <= end;
    });

    const filteredPurchList = purchases.filter(item => {
      const d = new Date(item.createdOn || item.invoiceDate).getTime();
      return d >= start && d <= end;
    });

    const totalSales = filteredSalesList.reduce((acc, curr) => acc + (curr.netTotal || 0), 0);
    const totalPurch = filteredPurchList.reduce((acc, curr) => acc + (curr.netTotal || 0), 0);
    const netRev = totalSales - totalPurch || 0
    setFilteredKpiData({
      sales: totalSales,
      purchase: totalPurch,
      netRevenue: netRev,
      expenses: kpiData.expenses
    });
    setLineChartData(buildChartData(null, filteredSalesList));

    AlertHandler("Local data filtered successfully", "success");
  };

  const handlePaymentTypeChange = (type) => {
    if (type === "SALES") {
      setSelectedPayment("receivable");
      setAgingTableTitle("Net Receivable Summary");
      loadSalesAging("SALES");
    } else {
      setSelectedPayment("payable");
      setAgingTableTitle("Net Payable Summary")
      loadSalesAging("PURCHASE");
    }
  };
  return (
    <div className={styles.dashboard}>
      <main className={styles.main}>
        {/* HEADER */}
        <div className={styles.header}>
          <h1>Business Performance Dashboard</h1>

          <div className={styles.headerActions}>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />

            <button className={styles.submitBtn} onClick={handleFilterSubmit}>Submit</button>

            <button className={styles.downloadIcon} onClick={handleDownload}>
              <Download size={20} />
            </button>
            <button onClick={handleBackNavigation}>
              <FaBackward size={20} />
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCardPurple}>
            <p>Sales</p>
            <h3>₹ &nbsp;{formatCurrency(filteredKpiData.sales || salesNetTotal || 0)}</h3>
          </div>

          <div className={styles.kpiCardBlue}>
            <p>Purchases</p>
            <h3>₹ &nbsp;{formatCurrency(filteredKpiData.purchase || purchaseNetTotal || 0)}</h3>
          </div>

          <div className={styles.kpiCardRed}>
            <p>Expenses</p>
            <h3>₹ &nbsp;{formatCurrency(kpiData?.expenses || 0)}</h3>
          </div>

          <div className={styles.kpiCardIndigo}>
            <p>Net Revenue</p>
            <h2>₹ &nbsp;{formatCurrency(kpiData?.netRevenue || 0)}</h2>
          </div>

          {/* ? COMMENT THIS IF NOT NEEDED */}
          {/*
          <div className={styles.kpiCardRed}>
            <p>Bank Balance</p>
            <h2>{kpiData.bankBalance}</h2>
          </div>
          */}
        </div>

        {/* CHART GRID */}
        <div className={styles.chartGrid}>
          {/* LINE CHART */}
          <div className={styles.card}>
            <div className={styles.chartHeader}>
              <h3>Monthly Sales Performance</h3>

              <div className={styles.chartFilters}>
                {/* FIRST SELECT */}
                <select
                  value={filterType}
                  onChange={(e) => {
                    const selectedType = e.target.value;
                    setFilterType(selectedType);

                    if (selectedType === "customer") {
                      setFilterValue("All");
                      setCustomerWise(true);
                      setSelectedCustomerGroup("All");
                      setLineChartData(buildChartData(null));
                      loadServiceBreakdown(getCurrentFinancialYear());
                    } else {
                      const currentFY = getCurrentFinancialYear();
                      setFilterValue(currentFY);
                      setCustomerWise(false);
                      setLineChartData(buildChartData(currentFY));
                      loadServiceBreakdown(currentFY);
                    }
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="financial">Financial Year</option>
                  <option value="customer">Customer Wise</option>
                </select>

                {/* SECOND SELECT (Dynamic Options) */}
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value="">Select Option</option>

                  {/* If Financial Selected ? Show Years */}
                  {filterType === "financial" && (
                    <>
                      <option value="2023-2024">2023-2024</option>
                      <option value="2024-2025">2024-2025</option>
                      <option value="2025-2026">2025-2026</option>
                      <option value="2026-2027">2026-2027</option>
                    </>
                  )}

                  {/* If Customer Selected ? Show Groups */}
                  {filterType === "customer" && (
                    // <>
                    //   <option value="group1">Customer Group 1</option>
                    //   <option value="group2">Customer Group 2</option>
                    // </>
                    customerCatagoryOptions.map((cat) => (
                      <option key={cat.value} value={cat.label}>
                        {cat.label}
                      </option>
                    ))
                  )}
                </select>

                <button className={styles.searchBtn} onClick={handleSearchGraph}>
                  Search
                </button>
              </div>

            </div>

            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={lineChartData}>

                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {customerCatagoryOptions.map((cat, index) => {
                  const shouldShow =
                    !customerWise ||
                    selectedCustomerGroup === "All" ||
                    selectedCustomerGroup === cat.label;
                  return (
                    shouldShow && cat.label !== "All" && (
                      <Bar
                        key={cat.value}
                        dataKey={cat.label}
                        name={cat.label}
                        radius={[4, 4, 0, 0]}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  );
                })}
                {/* Show ONLY Group1 */}
                {/* {(!customerWise || selectedCustomerGroup === "group1") && (
                  <Line
                    type="monotone"
                    dataKey="group1"
                    stroke="#00d4ff"
                    strokeWidth={3}
                    dot={{
                      onClick: (e, payload) => handleDotClick(payload.payload),
                    }}
                    activeDot={{
                      onClick: (e, payload) => handleDotClick(payload.payload),
                    }}
                  />
                )} */}

                {/* Show ONLY Group2 */}
                {/* {(!customerWise || selectedCustomerGroup === "group2") && (
                  <Line
                    type="monotone"
                    dataKey="group2"
                    stroke="#ff4ecd"
                    strokeWidth={3}
                    dot={{
                      onClick: (e, payload) => handleDotClick(payload.payload),
                    }}
                    activeDot={{
                      onClick: (e, payload) => handleDotClick(payload.payload),
                    }}
                  />
                )} */}

                {/* Always 12 Months */}

              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* PIE */}
          <div className={styles.card}>
            <h3>Services Breakdown</h3>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  label={({ name }) => name}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PAYMENTS + BANK BALANCE */}
        <div className={styles.bottomGrid}>
          {/* PAYMENTS */}
          <div className={styles.card}>
            <h3>Payments Summary</h3>

            <div className={styles.paymentTables}>
              <div className={styles.paymentTable}>
                <h4>Receivable Details</h4>

                <div className={styles.tableRow}>


                  <div className={styles.tableCol}>
                    <span>Received</span>
                    <b>₹ &nbsp;{formatCurrency(salesPaid || 0)}</b>
                  </div>

                  <div className={styles.tableCol}>
                    <span>TDS Amount</span>
                    <b>₹ &nbsp;{formatCurrency(salesTds || 0)}</b>
                  </div>

                  <div className={styles.tableCol}>
                    <span>Balance</span>
                    <b>₹ &nbsp;{formatCurrency(salesBalance || 0)}</b>
                  </div>
                  <div
                    className={styles.tableCol}
                    style={{ cursor: "pointer" }}
                    onClick={() => handlePaymentTypeChange("SALES")}
                  >
                    <span>Net Receivable</span>
                    <b>₹ &nbsp;{formatCurrency(salesNetTotal || 0)}</b>
                  </div>

                </div>
              </div>

              <div className={styles.paymentTable}>
                <h4>Payable Details</h4>

                <div className={styles.tableRow}>
                  <div className={styles.tableCol}>
                    <span>Total Purchases</span>
                    <b>₹ &nbsp;{formatCurrency(purchasesPaid || 0)}</b>
                  </div>

                  <div className={styles.tableCol}>
                    <span>Balance To Pay</span>
                    <b>₹ &nbsp;{formatCurrency(purchasesBalance || 0)}</b>
                  </div>

                  <div
                    className={styles.tableCol}
                    style={{ cursor: "pointer" }}
                    onClick={() => handlePaymentTypeChange("PURCHASE")}
                  >
                    <span>Net Payable</span>
                    <b>₹ &nbsp;{formatCurrency(kpiData?.purchase || 0)}</b>
                  </div>

                </div>
              </div>
            </div>
          </div>


          {/* BANK BALANCE CARD */}
          <div className={styles.card}>
            <h4>
              Bank Balance as on{" "}
              {bankDate
                ? new Date(bankDate).toLocaleDateString("en-GB")
                : new Date().toLocaleDateString("en-GB")}
              : ₹ &nbsp;{formatCurrency(computedBankBalance())}
            </h4>

            <NewTable
              cols={SalesSummaryTable()}
              data={salesAgingData}
              // title="Sales Summary"
              title={agingTableTitle}
            />

            {/* BAR CHART BELOW HEADING */}
            {/* <ResponsiveContainer width="100%" height={320}>
              <BarChart
                // data={barGraphData[selectedPayment]}
                data={salesAgingData}
                barSize={45}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#00d4ff"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer> */}

          </div>

        </div>
      </main>
    </div>
  );
}
