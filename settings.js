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
exports.ScreenIDImportToJDE = 'S0015'
exports.ScreenIDSteampInventory = 'S0016'

//Report
//SDC
exports.ScreenIDReportRestaurantPettyCashAnanlysis = 'S0017'
exports.ScreenIDReportRestaurantDataAnalysisForMonth = 'S0018'
exports.ScreenIDReportBankInSummaryByBank = 'S0019'
exports.ScreenIDReportSummaryCashReconciliation = 'S0020'
exports.ScreenIDReportTotalPettyCashReimbursementByStore = 'S0021'
exports.ScreenIDReportCashSalesReconcilationByStore = 'S0022'
exports.ScreenIDReportDailyFlashSales = 'S0023'
exports.ScreenIDReportCashSalesReconciliation = 'S0024'


//Path Tableau
exports.TableauDailyFlashSales = 'http://192.168.151.31/views/PH_RDS_Financial/1_PettyCash?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauCashSalesReconciliation = 'http://192.168.151.31/views/PH_RDS_Financial/1_PettyCash?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauBankInSummaryByBank = 'http://192.168.151.31/views/PH_RDS_Financial/1_PettyCash?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauCashSalesReconcilationByStore = 'http://192.168.151.31/views/PH_RDS_Financial/1_PettyCash?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauTotalPettyCashReimbursementByStore = 'http://192.168.151.31/views/PH_RDS_Financial/1_PettyCash?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauReportRestaurantDataAnalysisForMonth = 'http://192.168.151.31/views/PH_RDS_Financial/1_PettyCash?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauReportRestaurantPettyCashAnanlysis = 'http://192.168.151.31/views/PH_RDS_Financial/1_PettyCash?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'
exports.TableauReportSummaryCashReconciliation = 'http://192.168.151.31/views/PH_RDS_Financial/1_PettyCash?iframeSizedToWindow=true&:embed=y&:showAppBanner=false&:display_count=no&:showVizHome=no'

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

//Use SteampInventory
exports.DropdownPostDataType = [
    { "value": "receipts", "label": "Stamp Close Receipts" },
    { "value": "transfers_out", "label": "Stamp Close Stock Transfer Out" },    
    { "value": "periodic_inv", "label": "Stamp Close Periodic Ending Inventory" },    
    { "value": "unit_cost", "label": "Stamp Close Unit Cost" },    
]
