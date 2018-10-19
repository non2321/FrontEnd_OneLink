//LocalStorage
exports.localStorageAuth = 'user'

exports.PathBackEnd = 'http://localhost:3000'
// exports.PathBackEnd = 'http://192.168.151.113:3000'

exports.ScreenIDLOGIN = 'LOGIN'
exports.ScreenIDHomePage = 'HomePage'
//SDC Sales
exports.ScreenIDSetupBankAccount = 'S0001'
exports.ScreenIDSetupCompanyAccount = 'S0002'
exports.ScreenIDSetupCompany = 'S0003'
exports.ScreenIDSetupFinancialCode = 'S0004'
exports.ScreenIDSetupStore = 'S0006'
exports.ScreenIDAccountCodeSetupForSale = 'S0007'
exports.ScreenIDBankInAdjustment = 'S0008'
exports.ScreenIDSteampCloseDailyFins = 'S0009'
//SDC Inventory
exports.ScreenIDAccountCodeForInventory = 'S0010'
exports.ScreenIDEndingInventory = 'S0011'
exports.ScreenIDReceipts = 'S0012'
exports.ScreenIDTermClosing = 'S0013'
exports.ScreenIDTransferInventory = 'S0014'
exports.ScreenIDUnitCost = 'S0015'
exports.ScreenIDSteampInventory = 'S0016'

//Report
//SDC Sales
exports.ScreenIDReportRestaurantPettyCashAnanlysis = 'S0017'
exports.ScreenIDReportRestaurantDataAnalysisForMonth = 'S0018'
exports.ScreenIDReportBankInSummaryByBank = 'S0019'
exports.ScreenIDReportSummaryCashReconciliation = 'S0020'
exports.ScreenIDReportTotalPettyCashReimbursementByStore = 'S0021'
exports.ScreenIDReportCashSalesReconcilationByStore = 'S0022'
exports.ScreenIDReportDailyFlashSales = 'S0023'
exports.ScreenIDReportCashSalesReconciliation = 'S0024'
//SDC Inventory
exports.ScreenIDReportReceiptsAllVendorByRegion = 'S0025'
exports.ScreenIDReportDetailStockTransferIn = 'S0026'
exports.ScreenIDReportInventoryCostPerMonth = 'S0027'
exports.ScreenIDReportDetailStockTransferOut = 'S0028'

//Duplicate
exports.ScreenIDReportSummaryStockTransferOut = 'S0029'

exports.ScreenIDReportEndingInventory = 'S0030'
exports.ScreenIDReportReceiptsAllVendor = 'S0031'

//Path Tableau
//SDC Sales
exports.TableauDailyFlashSales = 'http://192.168.151.31/views/ONELINKREPORTSDC/REPORTDAILYFLASHSALES?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauCashSalesReconciliation = 'http://192.168.151.31/views/ONELINKREPORTSDC/REPORTHOTMONTHLYCASHSALESRECONCILIATIONDIFFDBCR?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no#1'
exports.TableauBankInSummaryByBank = 'http://192.168.151.31/views/ONELINKREPORTSDC/REPORTMONTHLYBANKINSUMMARYREPORTBYBANK?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauCashSalesReconcilationByStore = 'http://192.168.151.31/views/ONELINKREPORTSDC/REPORTMONTHLYCASHSALESRECONCILATIONBYSTORE?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauTotalPettyCashReimbursementByStore = 'http://192.168.151.31/views/ONELINKREPORTSDC/REPORTMONTHLYTOTALPETTYCASHREIMBURSEMENTBYSTORE?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauReportRestaurantDataAnalysisForMonth = 'http://192.168.151.31/views/ONELINKREPORTSDC/REPORTRESTAURANTDATAANALYSISFORMONTH?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauReportRestaurantPettyCashAnanlysis = 'http://192.168.151.31/views/ONELINKREPORTSDC/REPORTMONTHLYRESTAURANTPETTYCASHANANLYSIS?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauReportSummaryCashReconciliation = 'http://192.168.151.31/views/ONELINKREPORTSDC/REPORTSUMMARYCASHRECONCILIATION?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
//SDC Inventory
exports.TableauReceiptsAllVendorByRegion = 'http://192.168.151.31/views/ONELINKREPORTSDC/REPORTRECEIPTSALLVENDORBYREGION?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauDetailStockTransferIn = 'http://192.168.151.31/views/ONELINKREPORTSDC/REPORTDETAILSTOCKTRANSFERIN?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauInventoryCostPerMonth = 'http://192.168.151.31/views/ONELINKREPORTSDC/REPORTINVENTORYCOSTPERMONTH?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauDetailStockTransferOut = 'http://192.168.151.31/views/ONELINKREPORTSDC/REPORTDETAILSTOCKTRANSFEROUT?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'

//Duplicate
exports.TableauSummaryStockTransferOut = 'http://192.168.151.31/views/PH_RDS_Financial/1_PettyCash?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'

exports.TableauEndingInventory = 'http://192.168.151.31/views/ONELINKREPORTSDC/ReportEndingInventory?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauReceiptsAllVendor = 'http://192.168.151.31/views/ONELINKREPORTSDC/REPORTRECEIPTSALLVENDOR?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'

exports.DropdownMonth = [
    { "value": "1", "label": "January" },
    { "value": "2", "label": "Februay" },
    { "value": "3", "label": "March" },
    { "value": "4", "label": "April" },
    { "value": "5", "label": "May" },
    { "value": "6", "label": "June" },
    { "value": "7", "label": "July" },
    { "value": "8", "label": "August" },
    { "value": "9", "label": "September" },
    { "value": "10", "label": "October" },
    { "value": "11", "label": "November" },
    { "value": "12", "label": "December" },
]

exports.DropdownActive = [
    { "value": "1", "label": "Active"},
    { "value": "0", "label": "Non Active"}   
]

//Use SteampInventory
exports.DropdownPostDataType = [
    { "value": "receipts", "label": "Stamp Close Receipts" },
    { "value": "transfers_out", "label": "Stamp Close Stock Transfer Out" },    
    { "value": "periodic_inv", "label": "Stamp Close Periodic Ending Inventory" },    
    { "value": "unit_cost", "label": "Stamp Close Unit Cost" },    
]
