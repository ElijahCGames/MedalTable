d3.csv("country.csv",function(ce,cData){
    d3.csv("medals.csv", function(d){
            coun = cData.filter(function(e){
                    console.log(d.Country);
                    return d.Country === e.Name;})
            return{
            	Rank: +d.Rank, 
                Country: coun[0].Flag + " " + coun[0].Code,
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

	var nested_data = d3.nest().key(function(d){
		return d.Rank
	}).entries(data);

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
                        return d;
                    })
                    .attr("class", function(d){
                        return d;
                    })
                    .on('click', function (d) {
                        headers.attr('class', 'header');
                        rows.html("");
                        oldWay();

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
                        return createTotalSVG("#527dda");
                    });

    var rows = table.append('tbody')

    nested_data.forEach(function(d) {
    	var rowspan = d.values.length;
    	d.values.forEach(function(val,index){
    		var tr = rows.append("tr").attr("class",function(){
    			return val.Country
    		});
    		if(index==0){
    			tr.append("td")
    			.attr("rowspan",rowspan)
    			.text(val.Rank)
    			.attr("class","Rank")
    		}
    		tr.append("td").text(val.Country).attr("class","Country")
    			.attr("class",function(){
    				return val.Country
    			})
    			.attr("id",function(){
    				return val.Country;
    			});
    		tr.append("td").attr("class","Bar").append(function(d){
        			return createSVG(val.Country);
    			});
    		tr.append("td").text(val.G)
    			.attr('data-th',"G")
    			.attr("class","small G");
    		tr.append("td").text(val.S)
    			.attr('data-th',"S")
    			.attr("class","small S");
    		tr.append("td").text(val.B)
    			.attr('data-th',"B")
    			.attr("class","small B");
    		tr.append("td").text(val.Total)
    			.attr('data-th',"Total")
    			.attr("class","Total");
    	});
    });

    nested_data.sort(function(a, b) { return b.g> a.G; });
    tr();
    function oldWay(){
    	rows = table.append('tbody').selectAll('tr')
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

    }
    
    function tr(){
    	 var totalrow = table.select('tbody')
        .append('tr')
                .attr('class',"Bottom")
        .selectAll("td")
        .data(["TOTAL",""
            ,d3.sum(data,d=>d.G) 
            ,d3.sum(data,d=>d.S)
            ,d3.sum(data,d=>d.B)
            ,d3.sum(data,d=>d.B) + d3.sum(data,d=>d.S) + d3.sum(data,d=>d.G)])
        .enter()
        .append("td")
          
        .text(function(d){
            return d
            })
        .attr("colspan",function(d){
        	if(d == "TOTAL"){
        		return 2
        	}
        })
        .filter(function(d){
                        return d == "";
        })

        .attr("class","Bar")
        .append(function(d){
            return createTotalSVG("#ffffff");
        });
    }
   

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

    function createTotalSVG(fillC){
        var t = d3.sum(data,d=>d.S)


        w = "100%";
        h = 39;

        var kpi = document.createElement("div");

        var svg = d3.select(kpi).append("svg")
        .attr({
          width: w,
          height: h
        });


        svg.append('rect').attr({
            width: (t/109) * 100 + "%",
            height:100,
            fill: fillC,
        });

        return kpi;
    }
    
}
