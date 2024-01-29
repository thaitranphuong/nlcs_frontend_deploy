import * as XLSX from 'xlsx';
class Excel {
    static getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }
    static exportExcel(data, nameSheet, nameFile) {
        return new Promise((resolve, reject) => {
            let wb = XLSX.utils.book_new();
            let ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, nameSheet);
            XLSX.writeFile(wb, `${nameFile}.xlsx`);
            resolve('ok');
        });
    }
}

export default Excel;
