function parseTable() {
    const rows = document.querySelectorAll('tbody tr.cssRangeItem2');
    const result = [];

    rows.forEach(row => {
        const columns = row.querySelectorAll('td');
        const courseClass = columns[2].textContent.trim();
        const group = parseInt(columns[1].querySelector('input').value); 
        const schedule = columns[4].innerHTML.trim(); 

        const datesRegex = /Từ (\d{2}\/\d{2}\/\d{4}) đến (\d{2}\/\d{2}\/\d{4})/;
        const match = datesRegex.exec(schedule);
        const startDate = match[1];
        const endDate = match[2];

        const timeslotRegex = /<b>(.*?)<\/b>/g;
        const timeslots = [];
        let timeslotMatch;
        while ((timeslotMatch = timeslotRegex.exec(schedule)) !== null) {
            timeslots.push(timeslotMatch[1]);
        }
        const timeslotFormatted = timeslots.join('->');

        result.push([courseClass, group, startDate, endDate, timeslotFormatted]);
    });

    return result;
}

// Example usage:
const parsedData = parseTable();
console.log(parsedData);
