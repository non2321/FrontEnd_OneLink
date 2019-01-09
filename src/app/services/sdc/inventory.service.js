import { authHeader } from '../../store';
import { localStorageAuth, PathBackEnd } from '../../../../settings'
import 'isomorphic-fetch'
import dateFormat from 'dateformat'


export const inventoryService = {
    addaccountcodeforinventory,   
    editaccountcodeforinventory, 
    downloadtemplateaccountcodeforinventory,
    importaccountcodeforinventory,  

    addtermclosing,
    edittermclosing,

    editunitcost,
    downloadtemplateunitcost,
    importunitcost,
    genunitcost,

    stampinventory,

    addnewinventoryitems
}

function addaccountcodeforinventory(prm) {
    const action_code = prm.action_code
    const inv_class = prm.inv_class
    const action = prm.action
    const obj_account = prm.obj_account
    const subsidary = prm.subsidary
    const grp_by = prm.grp_by
    const cat_code = prm.cat_code
    const acc_type = prm.acc_type
    const doc_no = prm.doc_no
    const remark = prm.remark
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_code: action_code, inv_class: inv_class, action: action, obj_account: obj_account, subsidary: subsidary, grp_by: grp_by, cat_code: cat_code, acc_type: acc_type, doc_no: doc_no, remark: remark, screen_id: screen_id})
    };

    return fetch(`${PathBackEnd}/api/accountcodeforinventory`, requestOptions)
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

function editaccountcodeforinventory(prm) {
    const action_code = prm.action_code
    const inv_class = prm.inv_class
    const action = prm.action
    const obj_account = prm.obj_account
    const subsidary = prm.subsidary
    const grp_by = prm.grp_by
    const cat_code = prm.cat_code
    const acc_type = prm.acc_type
    const doc_no = prm.doc_no
    const remark = prm.remark
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_code: action_code, inv_class: inv_class, action: action, obj_account: obj_account, subsidary: subsidary, grp_by: grp_by, cat_code: cat_code, acc_type: acc_type, doc_no: doc_no, remark: remark, screen_id: screen_id})
    };

    return fetch(`${PathBackEnd}/api/accountcodeforinventory`, requestOptions)
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

function downloadtemplateaccountcodeforinventory() {

    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${PathBackEnd}/api/upload/accountcodeforinventory_template`, requestOptions)
        .then(function (res) {
            return res.blob()
        })
        .then(function (blob) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'TemplateAccountCodeForInventory.xlsx');
            document.body.appendChild(link);
            link.click();
        })    
}

function importaccountcodeforinventory(obj, screen_id) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ obj, screen_id })
    };

    return fetch(`${PathBackEnd}/api/accountcodeforinventory/import`, requestOptions)
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

function addtermclosing(prm) {
    const year = prm.year   
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: year, screen_id: screen_id})
    };

    return fetch(`${PathBackEnd}/api/termclosing`, requestOptions)
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

function edittermclosing(obj) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ obj })
    };

    return fetch(`${PathBackEnd}/api/termclosing`, requestOptions)
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


function editunitcost(obj) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ obj })
    };

    return fetch(`${PathBackEnd}/api/unitcost`, requestOptions)
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

function downloadtemplateunitcost() {

    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${PathBackEnd}/api/upload/unitcost_template`, requestOptions)
        .then(function (res) {
            return res.blob()
        })
        .then(function (blob) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'TemplateUnitCost.xlsx');
            document.body.appendChild(link);
            link.click();
        })    
}

function importunitcost(obj, screen_id) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ obj, screen_id })
    };

    return fetch(`${PathBackEnd}/api/unitcost/import`, requestOptions)
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

function genunitcost(prm) {

    const period = prm.period   
    const screen_id = prm.screen_id
    const periodlabel = prm.periodlabel

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ period, screen_id })
    };

    return fetch(`${PathBackEnd}/api/genunitocst`, requestOptions)
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
                let datadate = periodlabel.split("/") 

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                // link.setAttribute('download', `GLINV_PH${dateFormat(new Date(), "yyyymmdd_hhMMss")}.txt`);
                link.setAttribute('download', `GLINV_PH${datadate[2]}${datadate[1]}${datadate[0]}.txt`);
                document.body.appendChild(link);
                link.click();

                return blob.size
            } else {
                return blob.size
            }            
        })
}

function stampinventory(prm) {
    const stamp = prm.stamp
    const post_date_type = prm.post_date_type
    const datefrom = prm.datefrom
    const dateto = prm.dateto   
    const screen_id = prm.screen_id
   
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ stamp, post_date_type, datefrom, dateto, screen_id })
    };

    return fetch(`${PathBackEnd}/api/stampinventory`, requestOptions)
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

function addnewinventoryitems(prm) {  
    
    const stock_code = prm.stock_code
    const description = prm.description
    const postinginterval = prm.postinginterval
    const vendor = prm.vendor
    const costperinvoice = prm.costperinvoice
    const unitm2 = prm.unitm2
    const scalm2 = prm.scalm2
    const costm2 = prm.costm2
    const unitm3 = prm.unitm3
    const scalm3 = prm.scalm3
    const costm3 = prm.costm3
    const unitm4 = prm.unitm4
    const scalm4 = prm.scalm4
    const costm4 = prm.costm4
    const screen_id = prm.screen_id

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            stock_code: stock_code, description: description, postinginterval: postinginterval, vendor: vendor, costperinvoice: costperinvoice,
            unitm2: unitm2, scalm2: scalm2, costm2: costm2,
            unitm3: unitm3, scalm3: scalm3, costm3: costm3,
            unitm4: unitm4, scalm4: scalm4, costm4: costm4, screen_id: screen_id})
    };

    return fetch(`${PathBackEnd}/api/newinventoryitems`, requestOptions)
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

function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}