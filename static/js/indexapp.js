var SubjectID = d3.select("#selDataset");
var SuperHeroInfo = d3.select("#sample-metadata");
var SuperHeroImage = d3.select("#hero-image")
// var HeroCard = d3.select("#card-img")


var importJSON = d3.json("/api");

// Creates the Dropdown Menu
importJSON.then((incomingData) => {
  SubjectID.append('option').text("--ID--")
  incomingData.map(Hero => {
    SubjectID.append("option").text(Hero['id']);
  })
});





function optionChanged() {
  var noID = parseInt(SubjectID.property('value'));
  createGraphs(noID);

};




function createGraphs(noID) {

  importJSON.then((incomingData) => {

    var HeroIDInfo = incomingData.find((ID) => parseInt(ID['id']) === parseInt(noID));
    var nameHero = HeroIDInfo['name'];
    var HeroID = HeroIDInfo['id'];
    var biography = HeroIDInfo['biography'];

    createSuperHeroInfo(nameHero, HeroID, biography);

    imgURL = HeroIDInfo['image']['url'];
    createHeroImage(imgURL);

  });
};


function createSuperHeroInfo(name, id, biography) {
  var svgWidth = 100;
  var svgHeight = 50;


  SuperHeroInfo.html("");
  SuperHeroInfo.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  SuperHeroInfo.append("li")
    .text(`name: ${name}`);

  SuperHeroInfo.append("li")
    .text(`id: ${id}`);

  for (const [key, value] of Object.entries(biography)) {
    // console.log(`${key}: ${value}`);
    SuperHeroInfo.append("li")
      .text(`${key}: ${value}`)
  }
};

function createHeroImage(url) {

  var svg = d3.select("#hero-image")
    .html("")
    .append("img")
    .attr("height", "600")
    .attr("width", "400")
    .classed("center", true);

  try {
    callback(url);
    svg.attr("src", url);
  }

  catch {
    errorURL = "https://zui.zywave.com/images/communications/messages/401-error-message.svg";
    svg.attr("src", errorURL);
  }

}



function getRandomInt() {
  return Math.floor(Math.random() * 731);
};


// The First Super Hero is Randomnly Generated
createGraphs(getRandomInt());


function createRandomHero() {
  randomNum = getRandomInt();
  createGraphs(randomNum);
};


function searchbyID() {
  var inputID = d3.select("#inputID").property("value");
  createGraphs(inputID);
}


