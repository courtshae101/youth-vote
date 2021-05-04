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

        //console.log(states)

        const presColorDeterminer = (vote) => {
            if (vote == "R") {
                return "red"
            } else if (vote == "D") {
                return "blue"
            } else if (vote == "Equal") {
                return "purple"
            } else {
                return "grey"
            }
        }

        const youthPresOpacity = (all, youth) => {
            if (all == youth) {
                return 1
            } else {
                return 0.25
            }
        }

        const youthPresName = (state) => {
            if (state.properties.Pres == state.properties.youthPres) {
                return state.properties.NAME
            }
        }

        statePaths.style("fill", d=>presColorDeterminer(d.properties.Pres))
            .style("stroke", "white")

        const buttonsDiv = d3.select("#youth-pres").append("div");

        const national_pres_button = buttonsDiv.append("button")
            .text("See where the youth vote matched the state vote")
            .attr("id", "youth-pres-button")
            .style("margin", "10px")
            .on("click", () => {
                statePaths.transition().duration(500)
                .style("opacity", d=>youthPresOpacity(d.properties.Pres, d.properties.youthPres))
            
        })

        const only_youth_vote_button = buttonsDiv.append("button")
            .text("What if only young people voted?")
            .attr("id", "only-youth")
            .style("margin", "10px")
            .on("click", () => {
                statePaths.style("fill", d=>presColorDeterminer(d.properties.youthPres))
        })

        const national_pres_button_reset = buttonsDiv.append("button")
            .text("See the state's vote for president")
            .attr("id", "youth-pres-button")
            .style("margin", "10px")
            .on("click", () => {
                statePaths.transition().duration(500).style("opacity", 1)
                statePaths.style("fill", d=>presColorDeterminer(d.properties.Pres))

        })

        let complexTip = d3.select("#mapAttatch").append("div")
            .attr("id", "complex-toooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("padding", "10px")
            .style("border", "1px solid black")

        
        let ctStateName = complexTip.append("div")

        let ctStateNameSpan = ctStateName.append("span").style("font-weight", 600)

        
        // https://github.com/d3/d3-format
        const f = d3.format(".0%")
        
        statePaths.on("mouseover", function() {
            let thisData = d3.select(this).data()[0]
            ctStateNameSpan.text(thisData.properties.NAME)
            complexTip.style("opacity", 1)
        })

        statePaths.on("mouseout", function() {
            complexTip.style("opacity", 0)
        })

        statePaths.on("mousemove", function(event) {
            complexTip.style("left", (d3.pointer(event)[0]) + 'px')
                    .style("top", (d3.pointer(event)[1] + 200)+"px")
                    .style("pointer-events", "none")
        })


    })  

    })