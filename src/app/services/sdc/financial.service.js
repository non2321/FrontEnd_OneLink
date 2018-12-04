import { authHeader } from '../../store';
import { localStorageAuth, PathBackEnd } from '../../../../settings'
import 'isomorphic-fetch'
import dateFormat from 'dateformat'


export const financialService = {
    addfinancialcode,
    editfinancialcode,

    addbankaccount,
    editbankaccount,
    deletebankcode,

    addaccountforsale,
    editaccountforsale,

    downloadtemplatebankin,
    editbankinadjustment,
    importbankinadjustment,
    glprocessbankinadjustment,

    stampclosedailyfins,

    addgendatafilePL,
    genfileBAL,
    genfileBAL_ADJ,
    genfileBAL_ACTUAL,
    genfileBAL_ACTUAL_ADJ,
    genfileBAL_NetSales,
    genfileBAL_ACTUAL_SPA_AND_ACTUAL_ADJ_SPA,
    // genfileBAL_ACTUAL_ADJ_SPA
}

function addfinancialcode(prm) {
    const fin_code = prm.fin_code
    const fin_name = prm.fin_name
    const active = prm.active
    const show = prm.show
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ fin_code, fin_name, active, show, screen_id })
    };

    return fetch(`${PathBackEnd}/api/financialcodeconfig`, requestOptions)
        .then(response => {
            return handleResponse(response)
        })
        .then(user => {
            if (user && user.status == 'Y') {
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }
            return user;
        });
}

function editfinancialcode(obj) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ obj })
    };

    return fetch(`${PathBackEnd}/api/financialcodeconfig`, requestOptions)
        .then(response => {
            return handleResponse(response)
        })
        .then(user => {
            if (user && user.status == 'Y') {
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }
            return user;
        });
}

function addbankaccount(prm) {
    const bank_code = prm.bank_code
    const bank_name = prm.bank_name
    const bank_branch = prm.bank_branch
    const account_code = prm.account_code
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank_code, bank_name, bank_branch, account_code, screen_id })
    };

    return fetch(`${PathBackEnd}/api/bankaccountconfig`, requestOptions)
        .then(response => {
            return handleResponse(response)
        })
        .then(user => {
            if (user && user.status == 'Y') {
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }
            return user;
        });
}

function editbankaccount(prm) {
    const bank_code = prm.bank_code
    const bank_name = prm.bank_name
    const bank_branch = prm.bank_branch
    const account_code = prm.account_code
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank_code, bank_name, bank_branch, account_code, screen_id })
    };

    return fetch(`${PathBackEnd}/api/bankaccountconfig`, requestOptions)
        .then(response => {
            return handleResponse(response)
        })
        .then(user => {
            if (user && user.status == 'Y') {
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }
            return user;
        });
}

function deletebankcode(prm) {
    const bank_code = prm.bank_code
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank_code, screen_id })
    };

    return fetch(`${PathBackEnd}/api/bankaccountconfig`, requestOptions)
        .then(response => {
            return handleResponse(response)
        })
        .then(user => {
            if (user && user.status == 'Y') {
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }
            return user;
        });
}

function addaccountforsale(prm) {
    const formular_name = prm.formular_name
    const account_code = prm.account_code
    const bu_type = prm.bu_type
    const type = prm.type
    const subledger_type = prm.subledger_type
    const subledger = prm.subledger
    const fincode = prm.fincode
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ formular_name, account_code, bu_type, type, subledger_type, subledger, fincode, screen_id })
    };

    return fetch(`${PathBackEnd}/api/accountcodeconfigforsale`, requestOptions)
        .then(response => {
            return handleResponse(response)
        })
        .then(user => {
            if (user && user.status == 'Y') {
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }
            return user;
        });
}

function editaccountforsale(prm) {
    const formular_id = prm.formular_id
    const formular_name = prm.formular_name
    const account_code = prm.account_code
    const bu_type = prm.bu_type
    const type = prm.type
    const subledger_type = prm.subledger_type
    const subledger = prm.subledger
    const fincode = prm.fincode
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ formular_id, formular_name, account_code, bu_type, type, subledger_type, subledger, fincode, screen_id })
    };

    return fetch(`${PathBackEnd}/api/accountcodeconfigforsale`, requestOptions)
        .then(response => {
            return handleResponse(response)
        })
        .then(user => {
            if (user && user.status == 'Y') {
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }
            return user;
        });
}

function downloadtemplatebankin() {

    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${PathBackEnd}/api/upload/bankinadjustment_template`, requestOptions)
        .then(function (res) {
            return res.blob()
        })
        .then(function (blob) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'TemplateBankInAdjustment.xlsx');
            document.body.appendChild(link);
            link.click();
        })
    // setTimeout(() => {
    //     const response = {
    //         file: `${PathBackEnd}/api/upload/bankinadjustment_template`,
    //     };
    //     // server sent the url to the file!
    //     // now, let's download:
    //     window.open(response.file);
    //     // you could also do:
    //     // window.location.href = response.file;
    // }, 100);
}

function editbankinadjustment(obj) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ obj })
    };

    return fetch(`${PathBackEnd}/api/bankinadjustment`, requestOptions)
        .then(response => {
            return handleResponse(response)
        })
        .then(user => {
            if (user && user.status == 'Y') {
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }
            return user;
        });
}

function glprocessbankinadjustment(prm) {

    const gldoc_type = prm.gldoc_type
    const glledger_type = prm.glledger_type
    const glfrom_date = prm.glfrom_date
    const glto_date = prm.glto_date
    const glfrom_store = prm.glfrom_store
    const glto_store = prm.glto_store
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ gldoc_type, glledger_type, glfrom_date, glto_date, glfrom_store, glto_store, screen_id })
    };

    return fetch(`${PathBackEnd}/api/glprocessbankinadjustment`, requestOptions)
        .then(response => {
            let header = response.headers.get('Content-Type').split(';')
            if (header[0] == 'application/json') {
                return response.json()
            } else {
                return response.blob()
            }
        })
        .then(blob => {
            if (blob.size === undefined) {
                return blob;
            } else if (blob.size > 0) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `GLSALES_PH${dateFormat(new Date(), "yyyymmdd_hhMMss")}.txt`);
                document.body.appendChild(link);
                link.click();

                return blob.size
            } else {
                return blob.size
            }
        })
}

function importbankinadjustment(obj, screen_id) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ obj, screen_id })
    };

    return fetch(`${PathBackEnd}/api/bankinadjustment/import`, requestOptions)
        .then(response => {
            return handleResponse(response)
        })
        .then(user => {
            if (user && user.status == 'Y') {
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }
            return user;
        });
}

function stampclosedailyfins(prm) {
    const stamp = prm.stamp
    const datefrom = prm.datefrom
    const dateto = prm.dateto
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ stamp, datefrom, dateto, screen_id })
    };

    return fetch(`${PathBackEnd}/api/stampclosedailyfins`, requestOptions)
        .then(response => {
            return handleResponse(response)
        })
        .then(user => {
            if (user && user.status == 'Y') {
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }
            return user;
        });
}

function addgendatafilePL(year, month, obj, screen_id) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, month, obj, screen_id })
    };

    return fetch(`${PathBackEnd}/api/gendatafilePL`, requestOptions)
        .then(response => {
            return handleResponse(response)
        })
        .then(user => {
            if (user && user.status == 'Y') {
                localStorage.setItem(localStorageAuth, JSON.stringify(user.user));
            }
            return user;
        });
}


function genfileBAL(year, month, screen_id) {

    const period_month = month
    const period_year = year

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ period_month, period_year, screen_id })
    };

    return fetch(`${PathBackEnd}/api/gendatafilePL/BAL`, requestOptions)
        .then(response => {
            let header = response.headers.get('Content-Type').split(';')
            if (header[0] == 'application/json') {
                return response.json()
            } else {
                return response.blob()
            }
        })
        .then(blob => {
            if (blob.size === undefined) {
                return blob;
            } else if (blob.size > 0) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `BAL${dateFormat(new Date(), "yyyymmdd_hhMMss")}.txt`);
                document.body.appendChild(link);
                link.click();

                return blob.size
            } else {
                return blob.size
            }
        })
}

function genfileBAL_ADJ(year, month, screen_id) {

    const period_month = month
    const period_year = year

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ period_month, period_year, screen_id })
    };

    return fetch(`${PathBackEnd}/api/gendatafilePL/BAL_ADJ`, requestOptions)
        .then(response => {
            let header = response.headers.get('Content-Type').split(';')
            if (header[0] == 'application/json') {
                return response.json()
            } else {
                return response.blob()
            }
        })
        .then(blob => {
            if (blob.size === undefined) {
                return blob;
            } else if (blob.size > 0) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `BAL_ADJ${dateFormat(new Date(), "yyyymmdd_hhMMss")}.txt`);
                document.body.appendChild(link);
                link.click();

                return blob.size
            } else {
                return blob.size
            }
        })
}

function genfileBAL_ACTUAL(year, month, screen_id) {

    const period_month = month
    const period_year = year

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ period_month, period_year, screen_id })
    };

    return fetch(`${PathBackEnd}/api/gendatafilePL/ACTUAL`, requestOptions)
        .then(response => {
            let header = response.headers.get('Content-Type').split(';')
            if (header[0] == 'application/json') {
                return response.json()
            } else {
                return response.blob()
            }
        })
        .then(blob => {
            if (blob.size === undefined) {
                return blob;
            } else if (blob.size > 0) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `ACTUAL${dateFormat(new Date(), "yyyymmdd_hhMMss")}.txt`);
                document.body.appendChild(link);
                link.click();

                return blob.size
            } else {
                return blob.size
            }
        })
}

function genfileBAL_ACTUAL_ADJ(year, month, screen_id) {

    const period_month = month
    const period_year = year

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ period_month, period_year, screen_id })
    };

    return fetch(`${PathBackEnd}/api/gendatafilePL/ACTUAL_ADJ`, requestOptions)
        .then(response => {
            let header = response.headers.get('Content-Type').split(';')
            if (header[0] == 'application/json') {
                return response.json()
            } else {
                return response.blob()
            }
        })
        .then(blob => {
            if (blob.size === undefined) {
                return blob;
            } else if (blob.size > 0) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `ACTUAL_ADJ${dateFormat(new Date(), "yyyymmdd_hhMMss")}.txt`);
                document.body.appendChild(link);
                link.click();

                return blob.size
            } else {
                return blob.size
            }
        })
}

function genfileBAL_NetSales(year, month, screen_id) {

    const period_month = month
    const period_year = year

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ period_month, period_year, screen_id })
    };

    return fetch(`${PathBackEnd}/api/gendatafilePL/NetSales`, requestOptions)
        .then(response => {
            let header = response.headers.get('Content-Type').split(';')
            if (header[0] == 'application/json') {
                return response.json()
            } else {
                return response.blob()
            }
        })
        .then(blob => {
            if (blob.size === undefined) {
                return blob;
            } else if (blob.size > 0) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `NetSales${dateFormat(new Date(), "yyyymmdd_hhMMss")}.txt`);
                document.body.appendChild(link);
                link.click();

                return blob.size
            } else {
                return blob.size
            }
        })
}

function genfileBAL_ACTUAL_SPA_AND_ACTUAL_ADJ_SPA(year, month, screen_id) {

    const period_month = month
    const period_year = year

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ period_month, period_year, screen_id })
    };

    return fetch(`${PathBackEnd}/api/gendatafilePL/ACTUAL_SPA_AND_ACTUAL_ADJ_SPA`, requestOptions)
        .then(response => {
            let header = response.headers.get('Content-Type').split(';')
            if (header[0] == 'application/json') {
                return response.json()
            } else {
                return response.json()
            }
        })
        .then(json => {
            if (json) {
                if (Object.keys(json.obj1).length > 0) {
                    const blob = new Blob([`${json.obj1}`], { type: "text/plain" });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `ACTUAL_SPA${dateFormat(new Date(), "yyyymmdd_hhMMss")}.txt`);
                    document.body.appendChild(link);
                    link.click();
                }
                if (Object.keys(json.obj2).length > 0) {
                    const blob = new Blob([`${json.obj2}`], { type: "text/plain" });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `ACTUAL_ADJ_SPA${dateFormat(new Date(), "yyyymmdd_hhMMss")}.txt`);
                    document.body.appendChild(link);
                    link.click();
                }
                return {
                    obj1: Object.keys(json.obj1).length,
                    obj2: Object.keys(json.obj2).length
                }
            }
        })
}

function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}