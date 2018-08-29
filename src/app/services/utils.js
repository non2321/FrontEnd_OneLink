export const utils = {
    convertdateformat,
    convertdateformatString,
};

function convertdateformat(prm) {
    let data = prm.split("/")
    let dt = new Date(data[2], data[1] - 1, data[0])
    return dt
}

function convertdateformatString(prm) {
    let data = prm.split("/")
    let dt = `${data[2]}-${data[1]}-${data[0]}`
    return dt
}