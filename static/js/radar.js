


function radarPlot() {

    
    // // Creates the Dropdown Menu
    // d3.json("data/heroes.json").then((data) => {
    d3.json("/api").then((data) => {
        var heroeID = [];
        console.log(data);
        
        for (var i = 0; i < data.length; i++) {
            var IDarray = data[i].id
            heroeID.push(IDarray)
        }

        var options = heroeID;

        var dropMenuHero1 = d3.select("#selDataset");
        options.map(option => {
        dropMenuHero1.append("option").text(option);
        });
        var ID1 = dropMenuHero1.property("value");
        var hero1 =(dropMenuHero1.property("value"))-1;

        var dropMenuHero2 = d3.select("#selDataset2");
        options.map(option => {
        dropMenuHero2.append("option").text(option);
        });
        var ID2 = dropMenuHero2.property("value");
        var hero2 =(dropMenuHero2.property("value"))-1;
        

        var dataHero1 = data[hero1];
        var dataHero2 = data[hero2];

        console.log("Hero 1"+ dataHero1);
        console.log("Hero 2"+ dataHero2);

        var graph = document.getElementById("radar");
        var stats1 = Object.values(data[hero1].powerstats)
        var stats2 = Object.values(data[hero2].powerstats)

        console.log(data[hero1].name);

        if (myChart) {
            myChart.destroy();
        }
        
        myChart = new Chart(graph, {
        type: 'radar',
        data: {
            labels: ['Intelligence', 'Strength', 'Speed', 'Durability', 'Power', 'Combat'],
            datasets: [{
                label: `ID: ${ID1}: Superheroe: ${data[hero1].name}`,
                data: stats1,
                backgroundColor: 'rgba(255, 99, 132, 0.3)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 3,
            },
            {
                label: `ID: ${ID2}: Superheroe: ${data[hero2].name}`,
                data: stats2,
                backgroundColor: 'rgba(54, 162, 235, 0.3)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 3
            }
        ]
        },
    });
})

}

var myChart;

radarPlot();

d3.selectAll("#selDataset").on("change", radarPlot);
d3.selectAll("#selDataset2").on("change", radarPlot);