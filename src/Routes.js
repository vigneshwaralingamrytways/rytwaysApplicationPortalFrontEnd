import React from 'react';
import { Route } from 'react-router-dom';





const Modules = React.lazy(() => import('./pages/Modules/Modules'));
const Login = React.lazy(() => import('./pages/Login'));

const QueryAndSolution = React.lazy(() => import('./pages/QueryAndSolution/QueryAndSolution'));
const ProcessQuery = React.lazy(() => import('./pages/QueryAndSolution/ProcessQuery'));
const ProcessMasterQuery = React.lazy(() => import('./pages/QueryAndSolution/ProcessMasterQuery'));
const ProcessMasterSearch = React.lazy(() => import('./pages/QueryAndSolution/ProcessMasterSearch'));
const MenuMasterSearch = React.lazy(() => import('./pages/QueryAndSolution/MenuMaster/MenuMasterSearch'));


const SlidingMenu = React.lazy(() => import('./Components/SlidingMenu/SlidingMenu'));
const SlidingMenu2 = React.lazy(() => import('./Components/NewHomePage/Contacts'));

const ReleaseInfo = React.lazy(() => import('./pages/Release/ReleaseInformation'));

const CurrencyMaster = React.lazy(() => import('./pages/Master/CurrencyMaster'));
const CountryNameMaster = React.lazy(() => import(`./pages/Master/CountryNameMaster`))
const StateMaster = React.lazy(() => import('./pages/Master/StateMaster'))

const DepMasterSearch = React.lazy(() => import('./pages/Master/DepMasterSearch'));

const ExpenseCatogory = React.lazy(() => import('./pages/Manages/ExpenseCatagory'));
const ExpenseSubCatogory = React.lazy(() => import('./pages/Manages/ExpenseSubCatagory'));
// const BookExpense = React.lazy(() => import('./pages/Manages/BookExpense'));
const BookExpense = React.lazy(() => import('./pages/Manages/BookExpense'));
const ExpenseManage = React.lazy(() => import('./pages/Manages/ExpenseManage'));

const ManageSuppliers = React.lazy(() => import('./pages/Manages/ManageSuppliers'));
const ManageCustomer = React.lazy(() => import('./pages/Manages/ManageCustomer'));

const ManagePurchase = React.lazy(() => import('./pages/Manages/ManagePurchase'));
const ManageSales = React.lazy(() => import('./pages/Manages/ManageSales'));
const MakePaymentExpense = React.lazy(() => import('./pages/Manages/MakePaymentExpense'));
const MakePaymentPurchase = React.lazy(() => import('./pages/Manages/MakePaymentPurchase'));
const MakePaymentSales = React.lazy(() => import('./pages/Manages/MakePaymentSales'));

const SalesPayment = React.lazy(() => import('./pages/Manages/InvoiceMapping/AddNewInvoice'));
const MakePayment = React.lazy(() => import('./pages/Manages/MakePaymentExpense'));
const AttendenceTypesMaster = React.lazy(() => import('./pages/Master/AttendenceTypesMaster'));







const BookProject = React.lazy(() => import('./pages/Manages/BookProject'));
const ManageAMC = React.lazy(() => import('./pages/Manages/ManageAMC'));
const ManageEmployee = React.lazy(() => import('./pages/Manages/ManageEmployee'));
const MakeRequest = React.lazy(() => import('./pages/Manages/MakeRequest'));
const MakeEmpRequest = React.lazy(() => import('./pages/Manages/MakeEmpRequest'));
const ApproveRequest = React.lazy(() => import('./pages/Manages/ApproveRequest'));
const DailyAttendence = React.lazy(() => import('./pages/Manages/DailyAttendence'));

const ViewAttendence = React.lazy(() => import('./pages/Manages/ViewAttendence'));

const ViewEmpAttendence = React.lazy(() => import('./pages/Manages/DailyEmpAttendence'));
const ManageBankAccounts = React.lazy(() => import('./pages/Manages/ManageBankAccounts'));
const ManageEmployeeRole = React.lazy(() => import('./pages/Manages/ManageEmployeeRole'));
const DefineSalaryStructure = React.lazy(() => import('./pages/Manages/DefineSalaryStructure'));
const AssignSalaryStructure = React.lazy(() => import('./pages/Manages/AssignSalaryStructure'));
const SalaryUpgrade = React.lazy(() => import('./pages/Manages/SalaryUpdate'));
const CreateDocuments = React.lazy(() => import('./pages/Manages/CreateDocuments'));
const StatusMaster = React.lazy(() => import('./pages/Master/StatusMaster'));
const MarkAttendence = React.lazy(() => import('./pages/Manages/MarkAttendence'));
const ManageUsers = React.lazy(() => import('./pages/Manages/ManageUsers'));
const InvoiceTypeMaster = React.lazy(() => import('./pages/Manages/InvoiceTypeMaster'));
const ServiceTypeMaster = React.lazy(() => import('./pages/Manages/ServiceTypeMaster'));
const HsnCodeMaster = React.lazy(() => import('./pages/Manages/HsnCodeMaster'));

const ManageActivity = React.lazy(() => import('./pages/Master/ManageActivity/ManageActivity'));

const ViewTransaction = React.lazy(() => import('./pages/BankAccounts/ViewTransaction'));
const RegionMaster = React.lazy(() => import('./pages/Manages/RegionMaster'));
const ManageCompanyBankAccount = React.lazy(() => import('./pages/Manages/ManageCompanyBankAccount'));
const ManageVendorBankAccount = React.lazy(() => import('./pages/Manages/ManageVendorBankAccounts'));

const BookEnquiry = React.lazy(() => import('./pages/Manages/BookEnquiry'));
const ManageBookEnquiry = React.lazy(() => import('./pages/Manages/ManageBookEnquiry'));
const ManageCustomerCatagory = React.lazy(() => import('./pages/Manages/ManageCustomerCatagory'));

const ManageBankStatements= React.lazy(() => import('./pages/Manages/ManageBankStatements'));

const ViewDocuments= React.lazy(() => import('./pages/Manages/ViewDocuments'));
const ManageGstReports= React.lazy(() => import('./pages/Manages/ManageGstReports'));
const ReconsileTransaction= React.lazy(() => import('./pages/Manages/ReconsileTransaction'));
const ReportDashBoard=React.lazy(() => import('./pages/Manages/SalesBoard'));
const BookTicket=React.lazy(() => import('./pages/Manages/BookTicket'));
const ManageTicket=React.lazy(() => import('./pages/Manages/ManageTicket'));
const AssignTicketView=React.lazy(() => import('./pages/Manages/AssignTicketView'));

const IssueTypeMaster=React.lazy(() => import('./pages/Master/IssueType'));

const SacCodeMaster=React.lazy(() => import('./pages/Manages/SacCodeMaster'));

export default [


    <Route path='/login' exact component={Login} />,
    <Route path='/modules' exact component={Modules} />,
    <Route path='/StateMaster' exact component={StateMaster} />,
    <Route path='/currencyMaster' exact component={CurrencyMaster} />,
    <Route path='/CountryNameMaster' exact component={CountryNameMaster} />,
    <Route path='/DepMasterSearch' exact component={DepMasterSearch}></Route>,
    <Route path='/ManageSuppliers' exact component={ManageSuppliers} />,
    <Route path='/ExpenseCatagory' exact component={ExpenseCatogory} />,
    <Route path='/ExpenseSubCatagory' exact component={ExpenseSubCatogory} />,
    <Route path='/BookExpense' exact component={BookExpense} />,
    <Route path='/ManageCustomer' exact component={ManageCustomer} />,
    <Route path='/ExpenseManage' exact component={ExpenseManage} />,
    <Route path='/ManageSales' exact component={ManageSales} />,
    <Route path='/MakePaymentExpense' exact component={MakePaymentExpense} />,
    <Route path='/MakePaymentPurchase' exact component={MakePaymentPurchase} />,
    <Route path='/ManagePurchase' exact component={ManagePurchase}></Route>,
    // <Route path='/processModule' exact component={SlidingMenu} /> ,
    <Route path='/processModule' exact component={SlidingMenu2} />,
    <Route path='/released' exact component={ReleaseInfo} />,
    <Route path='/MakePayment' exact component={MakePayment} />,
    <Route path='/BookProject' exact component={BookProject} />,

    <Route path='/ManageAMC' exact component={ManageAMC} />,
    <Route path='/ManageEmployee' exact component={ManageEmployee} />,
    <Route path='/MakeRequest' exact component={MakeRequest} />,
     <Route path='/MakeEmpRequest' exact component={MakeEmpRequest} />,

    <Route path='/ApproveRequest' exact component={ApproveRequest} />,

    <Route path='/DailyAttendence' exact component={DailyAttendence} />,

    <Route path='/ViewAttendence' exact component={ViewAttendence} />,

    <Route path='/ViewEmpAttendence' exact component={ViewEmpAttendence} />,
    <Route path='/ManageBankAccounts' exact component={ManageBankAccounts} />,

    <Route path='/ManageEmployeeRole' exact component={ManageEmployeeRole} />,

    <Route path='/DefineSalaryStructure' exact component={DefineSalaryStructure} />,

    <Route path='/AssignSalaryStructure' exact component={AssignSalaryStructure} />,

    <Route path='/SalaryUpgrade' exact component={SalaryUpgrade} />,
    <Route path='/AttendenceTypeMaster' exact component={AttendenceTypesMaster} />,
    <Route path='/MarkAttendence' exact component={MarkAttendence} />,
    <Route path='/ManageUsers' exact component={ManageUsers} />,
    <Route path='/ManageActivity' exact component={ManageActivity} />,


    <Route path='/CreateDocuments' exact component={CreateDocuments} />,
    <Route path='/ViewTransaction' exact component={ViewTransaction} />,
       <Route path='/SacCodeMaster' exact component={SacCodeMaster} />,

    <Route path='/MakePaymentSales' exact component={MakePaymentSales} />,

    <Route path='/SalesPayment' exact component={SalesPayment} />,
    <Route path='/StatusMaster' exact component={StatusMaster} />,
    <Route path='/HsnCodeMaster' exact component={HsnCodeMaster} />,
    <Route path='/ServiceTypeMaster' exact component={ServiceTypeMaster} />,
    <Route path='/InvoiceTypeMaster' exact component={InvoiceTypeMaster} />,

    <Route path='/RegionMaster' exact component={RegionMaster} />,
    <Route path='/ManageCompanyBankAccount' exact component={ManageCompanyBankAccount} />,
    <Route path='/ManageVendorBankAccount' exact component={ManageVendorBankAccount} />,
    <Route path='/BookEnquiry' exact component={BookEnquiry} />,
<Route path='/ManageBookEnquiry' exact component={ManageBookEnquiry} />,
<Route path='/ManageCustomerCatagory' exact component={ManageCustomerCatagory} />,
<Route path='/ManageBankStatements' exact component={ManageBankStatements} />,
<Route path='/ViewDocuments' exact component={ViewDocuments} />,

    <Route path='/process/querySolutions' exact component={QueryAndSolution} />,
    <Route path='/FunctionMaster' exact component={ProcessQuery} />,
    <Route path='/ProcessMaster' exact component={ProcessMasterQuery} />,
    <Route path='/processSearch' exact component={ProcessMasterSearch} />,
    <Route path='/Activityearch' exact component={MenuMasterSearch} />,
     <Route path='/ManageGstReports' exact component={ManageGstReports} />,
      <Route path='/ReconsileTransaction' exact component={ReconsileTransaction} />,

      <Route path='/ReportDashboard' exact component={ReportDashBoard} />,
         <Route path='/BookTicket' exact component={BookTicket} />,
 
          <Route path='/ManageTicket' exact component={ManageTicket} />,
          <Route path='/AssignTicketView' exact component={AssignTicketView} />,

           <Route path='/IssueType' exact component={IssueTypeMaster} />,




];       
