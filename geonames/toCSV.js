module.exports = function toCSV(data){
  var columns = Object.keys(data[0]);
  return [columns.join(",")].concat(data.map(function(d){
    return columns.map(function(column){
      var value = d[column];
      if(typeof value === "string" && value.indexOf(",") === -1){
        return value;
      } else if (typeof value !== "number") {
        return '"' + value + '"';
      } else {
        return value;
      }
    }).join(",");
  })).join("\n");
}
