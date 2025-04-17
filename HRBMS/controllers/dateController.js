function formatDate(date){
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    return new Date( month, day, year);

}
module.exports = {formatDate}