const data = [];
const scraper = require('table-scraper');
const d3 = Object.assign(require('d3-dsv'), require('d3-time-format'));
const dl = require('datalib');
const fs = require('fs');
const start = Date.now();
const parseDate = d3.timeParse('%Y-%m-%d');
const formatMonth = d3.timeFormat('%Y-%m');

// To get this token (which is probably more of a cursor for pagination),
// Make a query in the UI found here http://www.vdc-sy.info/index.php/en/martyrs/
// and copy the token from the URL.
const token = 'c29ydGJ5PWEua2lsbGVkX2RhdGV8c29ydGRpcj1ERVNDfGFwcHJvdmVkPXZpc2libGV8ZXh0cmFkaXNwbGF5PTB8c3RhcnREYXRlPTIwMTEtMDQtMDF8ZW5kRGF0ZT0yMDE4LTAzLTAyfA'

// Update this number depending on how many pages of the results there are.
// To find out, click "End" and see what page it is.
const lastPage = 1591;

const scrapePage = page => {
  scraper
    .get(`http://www.vdc-sy.info/index.php/en/martyrs/${page}/${token}`)
    .then(tableData => {
      tableData[0].slice(1).forEach(d => {
        data.push({
          'Name': d[0],
          'Status': d[1],
          'Sex': d[2],
          'Province': d[3],
          'Area \\ Place of birth': d[4],
          'Date of death': parseDate(d[5]),
          'Cause of Death': d[6],
          'Actors': d[7]
        });
      });
      if(page <= lastPage){
        console.log('scraped page ' + page)
        scrapePage(page + 1);
      } else {
        console.log('scraped all pages!')
        console.log(`done in ${(Date.now() - start) / 1000} seconds`);

        fs.writeFileSync('data.csv', d3.csvFormat(data));
        console.log('wrote to data.csv');

        // Aggregate over selected attributes by counting.
        const dataAggregated = dl
          .groupby([
            'Status',
            //'Sex',
            'Province',
	    { name: 'Date', get: d => formatMonth(d['Date of death']) },
            //'Cause of Death',
            'Actors',
          ])
          .count()
          .execute(data);

        fs.writeFileSync('dataAggregated.csv', d3.csvFormat(dataAggregated));
        console.log('wrote to dataAggregated.csv');
      }
    });
};

scrapePage(1);
