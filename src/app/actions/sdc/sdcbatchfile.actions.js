import { financialConstants } from '../../constants';
import { sdcbatchfileService } from '../../services/sdc'
import { alertActions } from '../alert';
import { loadingActions } from '../loading'
import { hashHistory } from 'react-router'

export const sdcbatchfileAction = {
    rerunbatchsdcinterface
}

async function rerunbatchsdcinterface(prm) {
    const file_type = prm.file_type
    const year = prm.year
    const month = prm.month
    const day = prm.day
    const screen_id = prm.screen_id


    return async dispatch => {
        $('#btnGengl').button('loading');
        dispatch(request({ file_type }));
        const table = $('#table').DataTable()
        
        await table.rows().eq(0).each(async function (index) {
            table.cell(index, 0).nodes().to$().find('input').attr("disabled", true)
        })
        await sdcbatchfileService.rerunbatchsdcinterface(prm)
            .then(
                async financial => {
                    if (financial.status == 'Y') {
                        let time = 0
                        for await (let item of file_type) {                            
                            if (item.file_type == 'dft') { time = time + 120000 }
                            if (item.file_type == 'drt') { time = time + 60000 }
                            if (item.file_type == 'dex') { time = time + 90000 }
                            if (item.file_type == 'pin') { time = time + 420000 }                           
                        }                        
                        await setTimeout(async () => {
                            $('#btnGengl').button('reset')                          

                            dispatch(success(financial));
                            dispatch(alertActions.success(financial.message))

                            await table.rows().eq(0).each(async function (index) {
                                table.cell(index, 0).nodes().to$().find('input').removeAttr("disabled")
                            })
                        }, time)

                    } else if (financial.status == 'NA') {
                        $('#btnGengl').button('reset');
                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));
                        hashHistory.push('/Login');
                    } else {
                        $('#btnGengl').button('reset');
                        dispatch(failure(financial.message));
                        dispatch(alertActions.error(financial.message));

                        await table.rows().eq(0).each(async function (index) {
                            table.cell(index, 0).nodes().to$().find('input').removeAttr("disabled")
                        })
                    }
                },
                error => {
                    $('#btnGengl').button('reset');
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            )
    }

    function request(financial) { return { type: financialConstants.ADD_REQUEST, financial } }
    function success(financial) { return { type: financialConstants.ADD_SUCCESS, financial } }
    function failure(error) { return { type: financialConstants.ADD_FAILURE, error } }
}