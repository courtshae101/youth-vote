const svg = d3.select("#mapAttatch").append("svg")
    .attr("id", "map-svg")
    .attr("width", 900)
    .attr("height", 500)


d3.json('us_states.json').then( (states) => 
{
    console.log(states);
 
    const projection = d3.geoAlbersUsa().scale(1000)

    const pathGenerator = d3.geoPath().projection(projection);

    const statePaths = svg.selectAll(".state-path")
        .data(states.features)
        .join("path")
        .attr("class", "state-path")
        .attr("d", pathGenerator);
    
    statePaths.attr("stroke", "white")
    statePaths.attr("stroke-width", 2)
    statePaths.attr("fill", "gray")


    for (i=0; i<states.features.length; i++) {
        //console.log(states.features[i].properties.NAME)
    }

    d3.csv('Circle-data.csv').then(statesCsv => {
        console.log(statesCsv)
    
        for (i = 0; i<statesCsv.length; i++) {
            //Save the name of the state for referencing in json: 
            let currentCsvState = statesCsv[i].State;

            //Save our data values: 
            let currentPct2018 = +statesCsv[i].pct_2018;
            let currentPct2016 = +statesCsv[i].pct_2016;
            let currentYouthPop = statesCsv[i].Youth_Pop;
            let currentCollege = +statesCsv[i].Youth_enrolled_in_college;
            let currentNoHs = +statesCsv[i].Youth_without_hs_diploma;
            let currentMedianIncome = statesCsv[i].Median_household_income;
            let currentChildPoverty = +statesCsv[i].Child_poverty_rate;
            let currentHSVoterReg = statesCsv[i].HS_voter_reg;
            let currentPres = statesCsv[i].win_pres;
            let currentConsumer = +statesCsv[i].consumer_choices;
            let currentyouthPres = statesCsv[i].Youth_win_pres;
            let currentNonprofit = +statesCsv[i].nonprofits_serving_youth;
            let currentDiscuss = +statesCsv[i].Discuss_politics_fam_friends;


            //Now, loop through our states features array.
            for (j = 0; j < states.features.length; j++) {
            
            //Get the sate of this current json item:
                let currentJsonState = states.features[j].properties.NAME;

                //Check to see if the states match:
                if (currentJsonState == currentCsvState) {
                    //Add these properties!
                    states.features[j].properties.pct2018 = currentPct2018
                    states.features[j].properties.pct2016 = currentPct2016
                    states.features[j].properties.YouthPop = currentYouthPop
                    states.features[j].properties.College = currentCollege
                    states.features[j].properties.NoHs = currentNoHs
                    states.features[j].properties.MedianIncome = currentMedianIncome
                    states.features[j].properties.ChildPoverty = currentChildPoverty
                    states.features[j].properties.HSVoterReg = currentHSVoterReg
                    states.features[j].properties.Pres = currentPres
                    states.features[j].properties.Consumer = currentConsumer
                    states.features[j].properties.youthPres = currentyouthPres
                    states.features[j].properties.Nonprofit = currentNonprofit
                    states.features[j].properties.Discuss = currentDiscuss
                }


            }
        }

        console.log(states)

        const colorDeterminer = (pct) => {
            if (pct >= 0.4) {
                return "green"
            } else if (pct >= 0.3) {
                return "#ACB334"
            } else if (pct >= 0.2) {
                return "#FAB733"
            } else if (pct >= 0.1) {
                return "#FF8E15"
            } else if (pct >= 0) {
                return "#FF0D0D"
            } else {
                return "grey"
            }
        }

        const youth_vote_change = (pct_2016, pct_2018) => {
            if (pct_2016 >= 0.4 && pct_2018 >= 0.4) {
                return 1
            } else {
                return 0.25
            }
        }

        const buttonsDiv = d3.select("#pct-button").append("div");

        const vote_2016_button = buttonsDiv.append("button")
        .text("2016 Youth Vote Percentage")
        .attr("id", "vote-2016")
        .style("margin", "10px")
        .on("click", () => {
            statePaths.transition().duration(500).style("fill", d=>colorDeterminer(d.properties.pct2016))
            .style("stroke", "white")
        })

        const vote_2018_button = buttonsDiv.append("button")
        .text("2018 Youth Vote Percentage")
        .attr("id", "vote-2018")
        .style("margin", "10px")
        .on("click", () => {
            statePaths.transition().duration(500).style("fill", d=>colorDeterminer(d.properties.pct2018))
            .style("stroke", "white")
        })


        let complexTip = d3.select("#mapAttatch").append("div")
            .attr("id", "complex-toooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("padding", "10px")
            .style("border", "1px solid black")

        
        let ctStateName = complexTip.append("div")
                            .text("State name: ")

        let ctStateNameSpan = ctStateName.append("span").style("font-weight", 600)
        
        let ct2016 = complexTip.append("div")
                        .text("2016 vote: ")

        let ct2016span = ct2016.append("span")
                            .style("font-weight", 600);

        let ct2018 = complexTip.append("div")
                        .text("2018 vote: ")

        let ct2018span = ct2018.append("span")
                    .style("font-weight", 600);
        
        // https://github.com/d3/d3-format
        const f = d3.format(".0%")
        
        statePaths.on("mouseover", function() {
            let thisData = d3.select(this).data()[0]
            ctStateNameSpan.text(thisData.properties.NAME)
            complexTip.style("opacity", 1)

            ct2018span.text(f(thisData.properties.pct2018))
                .style("color", colorDeterminer(thisData.properties.pct2018))

            ct2016span.text(f(thisData.properties.pct2016))
                .style("color", colorDeterminer(thisData.properties.pct2016))
            
            d3.select(this).style("opacity", 0.5)
            
        })

        statePaths.on("mouseout", function() {
            complexTip.style("opacity", 0)
            d3.select(this).style("opacity", 1)

        })

        statePaths.on("mousemove", function(event) {
            complexTip.style("left", (d3.pointer(event)[0] + 15) + 'px')
                    .style("top", (d3.pointer(event)[1] + 350) +"px")
                    .style("pointer-events", "none")
        })

        let stateInfo = d3.select("#state-info").append("div")
            .attr("id", "state-info")
            .style("background-color", "white")
            .style("padding", "10px")
            .style("border", "1px solid black")
            .style("margin-bottom", "20px")

        let InfoStateName = stateInfo.append("div")

        let InfoStateNameSpan = InfoStateName.append("span").style("font-weight", 600).text("Select a State")

        let InfoPop = stateInfo.append("div").text("Youth Population: ")

        let InfoPopSpan = InfoPop.append("span").style("font-weight", 600).text(" -- ")

        let InfoMedian = stateInfo.append("div").text("Median Household Income: $")

        let InfoMedianSpan = InfoMedian.append("span").style("font-weight", 600).text(" -- ")

        let InfoHS = stateInfo.append("div").text("State statute on voter registration of high school students? ")

        let InfoHSSpan = InfoHS.append("span").style("font-weight", 600).text(" -- ")

        statePaths.on("click", function() {
            let thisData = d3.select(this).data()[0]
            InfoStateNameSpan.text(thisData.properties.NAME)
            InfoPopSpan.text(thisData.properties.YouthPop)
            InfoMedianSpan.text(thisData.properties.MedianIncome)
            InfoHSSpan.text(thisData.properties.HSVoterReg == 'Y' ? "Yes" : "No")
        })

        const secondButtonsDiv = d3.select("#pct-change-button").append("div");

        const youth_change = secondButtonsDiv.append("button")
        .text("See states that stayed above 40%")
        .attr("id", "above-40")
        .style("margin", "10px")
        .on("click", () => {
            statePaths.transition().duration(500).style("opacity", d=>youth_vote_change(d.properties.pct2016, d.properties.pct2018))
            statePaths.on("mouseout", function() {
                complexTip.style("opacity", 0)
                statePaths.style("opacity", d=>youth_vote_change(d.properties.pct2016, d.properties.pct2018))
            })
        })

        const youth_change_reset = secondButtonsDiv.append("button")
        .text("Reset")
        .attr("id", "reset-change")
        .style("margin", "10px")
        .on("click", () => {
            statePaths.transition().duration(500).style("opacity", 1)
            statePaths.on("mouseout", function() {
                complexTip.style("opacity", 0)
                d3.select(this).style("opacity", 1)
            })

        })


    })  

    })