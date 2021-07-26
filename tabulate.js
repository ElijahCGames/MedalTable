d3.csv("country.csv",function(ce,cData){
    d3.csv("medals.csv", function(d){
            return{
                Country: cData.filter(function(e){
                    console.log(d.Country);
                    return d.Country === e.Code;})[0].Flag + " " + d.Country,
                Bar: null,
                G: +d.Gold,
                S: +d.Silver,
                B: +d.Bronze,
                Total: d3.sum([d.Gold,d.Bronze,d.Silver])

            };
        },       
    tabulate);
});


function tabulate(data){
    var sortAscending = true;
    var table = d3.select('table').attr("class","table table-condensed")
    var titles = d3.keys(data[0]);

    var headers = table.append('thead').append('tr')
                    .selectAll('th')
                    .data(titles).enter()
                    .append('th')
                    .text(function (d) {
                        if(d == "Bar"){
                            return " ";
                        }
                        if(d == "Flag"){
                            return " ";
                        }
                        return d.toUpperCase();
                    })
                    .attr("class", function(d){
                        return d;
                    })
                    .on('click', function (d) {
                        headers.attr('class', 'header');
                        
                        if (sortAscending) {
                        rows.sort(function(a, b) { return b[d] < a[d]; });
                        sortAscending = false;
                        this.className = 'aes';
                        } else {
                        rows.sort(function(a, b) { return b[d] > a[d]; });
                        sortAscending = true;
                        this.className = 'des';
                        }
                        
                    }).filter(function(d){
                        return d == "Bar";
                    })
                    .append(function(d){
                        return createTotalSVG();
                    });

    var rows = table.append('tbody').selectAll('tr')
                .data(data).enter()
                .append('tr')
                .attr("class",function(d){
                    return d.Country
                });

    rows.sort(function(a, b) { return b.G> a.G; });

    var tds = rows.selectAll('td')
    .data(function (d) {
        return titles.map(function (k) {
            return { 'value': d[k], 'name': k,'Country':d.Country};
        });
    }).enter()
    .append('td')
    .attr('data-th', function (d) {
        return d.name;
    })
    .text(function (d) {
        return d.value;
    })
    .attr('id',function(d){
        if(d.name == "Country"){
            return d.value;
        }
        if(d.name == "Flag"){
            return d.Country;
        }
    })
    .attr("class",function(d){
        if(d.name.length == 1){
            return "small " + d.name;
        }else{
            return d.name;
        }
    })
    .filter(function(d){
        return d.name == "Bar"
    })
    .append(function(d){
        return createSVG(d.Country);
    });

    function createSVG(d){

        var total = d3.max(data,e=>e.Total)
        
        var tData = data.filter(function(e){
            return e.Country === d;
        })[0];

        w = "100%";
        h = 39;

        var kpi = document.createElement("div");

        var svg = d3.select(kpi).append("svg")
        .attr({
          width: w,
          height: h
        });

        tWidth = (tData.Total / total) * 100
        gWidth =  (tData.G / tData.Total) * tWidth
        sWidth =  (tData.S / tData.Total) * tWidth
        bWidth = (tData.B / tData.Total) * tWidth

        svg.append('rect').attr({
            width: gWidth + "%",
            height:100,
            class: "G"
        });
        
        svg.append('rect').attr({
            width: sWidth + "%",
            height:100,
            x:gWidth + "%",
            class: "S"
        })

        svg.append('rect').attr({
            width: bWidth + "%",
            height:100,
            x:gWidth + sWidth + "%",
            class: "B"
        })

        return kpi;
    }

    function createTotalSVG(){
        var t = d3.sum(data,d=>d.G)


        w = "100%";
        h = 39;

        var kpi = document.createElement("div");

        var svg = d3.select(kpi).append("svg")
        .attr({
          width: w,
          height: h
        });


        svg.append('rect').attr({
            width: (t/339) * 100 + "%",
            height:100,
            fill: "#002063",
        });

        return kpi;
    }
    
}
