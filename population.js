
const body = d3.select("body");

//Append our svg canvas to the body.
const svg = body.append("svg")
            .attr("width", 1300)
            .attr("height", 550)
            .style("border", "1px solid grey")

//Make our colordeterminer function:
const colorDeterminer = (pres) => {
    if (pres =='R') {
        return "red"
    } else if (pres == 'D') {
        return "blue"
    } 
}

const top20 = (pop) => {
    if (pop >= 870000){
        return 5
    } else{
        return pop/5000 + 10
    }
}

const top20Fill = (pop) => {
    if (pop >= 870000){
        return "white"
    } else{
        return "black"
    }
}

const top20Opacity = (pop) => {
    if (pop >= 870000){
        return 1
    } else{
        return 0
    }
}

//Now, pretty much everything else (our data joins) will be DEPENDENT ON OUR PARTICULAR CHOICE OF DATASET. As such, we'll wall that stuff off in our draw(dataset) function. 
d3.csv('Circle-data.csv').then(data => {
    data.map((d) => {
        d.Youth_Pop_no_comma = +d.Youth_Pop_no_comma;
        d.Votes_cast_2016 = +d.Votes_cast_2016;
        d.Votes_cast_2018 = +d.Votes_cast_2018;
    });

    const rects = svg.selectAll(".pop-rect")
        .data(data) // OUR PARAMETER! GENERIC! NOT 'data'
        .join("rect")
        .attr("width", 40)
        .attr("height", 20)
        .style("opacity", d=> top20Opacity(d.Youth_Pop_no_comma))
        .attr("class", "pop-rect")
        .attr("y", (d, i) => i*25 + 10)
        .transition().duration(500)
        .attr("width", d => d.Youth_Pop_no_comma/5000)
        .style("fill", d=>colorDeterminer(d.win_pres));


    //Course name labels data join
    const courseText = svg.selectAll(".state-names")
                    .data(data)
                    .join("text")
                    .attr("class", "state-names")
                    .style("margin-left", "15px")
                    .style("opacity", d=> top20Opacity(d.Youth_Pop_no_comma))
                    .style("fill", d =>top20Fill(d.Youth_Pop_no_comma))
                    .text(d => d.State)
                    .attr("x", d => top20(d.Youth_Pop_no_comma)) // For a slight left pad!
                    .attr("y", (d, i) => i*25 + 25)

    //Numerical labels data join
    const numbers = svg.selectAll(".population")
                .data(data)
                .join("text")
                .attr("class", "population")
                .style("opacity", 0)
                .transition().duration(500)
                .style("opacity", 0)
                .transition().duration(0)
                .text(d => d.Youth_Pop)
                .transition().duration(500)
                .attr("y", (d, i) => i*25 + 25)
                .transition().duration(500)
                .style("opacity", d=> top20Opacity(d.Youth_Pop_no_comma))
                .attr("x", d=> d.Youth_Pop_no_comma/5000 + 10)

    const buttonsDiv = body.append("div");

    const youthPopbutton = buttonsDiv.append("button")
        .text("Youth Population")
        .attr("id", "original-dataset");

    const voteCount2016button = buttonsDiv.append("button")
        .text("Youth Vote Count 2016")
        .attr("id", "older-dataset");

    const voteCount2018button = buttonsDiv.append("button")
        .text("Youth Vote Count 2018")
        .attr("id", "oldest-dataset");


//Now we'll add event listeners to each. (We could've very easily done this in-line on our initial method chains)
    const f = d3.format(",")

    youthPopbutton.on("click", function() {
        d3.selectAll(".pop-rect").transition().duration(500).attr("width", d => d.Youth_Pop_no_comma/5000)
        d3.selectAll(".population").transition().duration(500).attr("x", d => d.Youth_Pop_no_comma/5000 + 10).text(d=>d.Youth_Pop)
    })

    voteCount2016button.on("click", function() {
        d3.selectAll(".pop-rect").transition().duration(500).attr("width", d => d.Votes_cast_2016/3500)
        d3.selectAll(".population").transition().duration(500).attr("x", d => d.Votes_cast_2016/3500 + 10).text(d=>f(d.Votes_cast_2016))
    })

    voteCount2018button.on("click", function() {
        d3.selectAll(".pop-rect").transition().duration(500).attr("width", d => d.Votes_cast_2018/3500)
        d3.selectAll(".population").transition().duration(500).attr("x", d => d.Votes_cast_2018/3500 + 10).text(d=>f(d.Votes_cast_2018))
    })



                

})