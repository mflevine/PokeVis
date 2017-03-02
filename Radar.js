var radardata = []
var pokemons;
// d3.select('body').append('g').append('div').attr('id','radarchart')

function radarAdd(p){
  if (p) {box.value=p}
  var pokemon = pokemons
  if (box.value){
    for (var poke in pokemon){
      if (pokemon[poke].Name == box.value){
        //console.log('found poke')
        radardata.push({
          id: pokemon[poke]['#'],
          name: pokemon[poke].Name,
          color: typecolor[pokemon[poke]['Type 1']],
          gen: pokemon[poke]['Generation'],
          total: +pokemon[poke].Total,
          axis: [
            {'stat': 'HP' ,'value': +pokemon[poke]['HP']},
            {'stat': 'Attack' ,'value': +pokemon[poke]['Attack']},
            {'stat': 'Defense' ,'value': +pokemon[poke]['Defense']},
            {'stat': 'Sp. Atk' ,'value': +pokemon[poke]['Sp. Atk']},
            {'stat': 'Sp. Def' ,'value': +pokemon[poke]['Sp. Def']},
            {'stat': 'Speed' ,'value': +pokemon[poke]['Speed']},
          ]
        })
      }
    }
    document.getElementById("radarform").reset()
    if (radardata.length>0){
      d3.select("#radarchart").selectAll("*").remove();
      d3.select('#toolTip').remove();
      RadarChart.draw("#radarchart", radardata, config);
    }
  }
}
d3.select("#Clear").on("click",function() {
  radardata=[]
  d3.select('#radarchart').selectAll('circle').remove()
  d3.select('#radarchart').selectAll('polygon').remove()
  d3.select('#radarlegend').remove()
})
d3.select("#Add").on("click",function(){
  radarAdd()
})
var width = 300,
    height = 300;

// Config for the Radar chart
var config = {
    w: width,
    h: height,
    maxValue: 160,
    levels: 5,
    ExtraWidthX: 300,
    TranslateX: 100
}

webshim.setOptions('forms', {
  //replace the default datalist feature with a custom styleable datalist
  customDatalist: true
});
webshim.setOptions('forms-ext', {
  //replace all input type widgets with a custom styleable feature
  replaceUI: true // 'auto' || true || false (default)
});

//load form polyfills
webshim.polyfill('forms forms-ext');

var typecolor = {'Bug':'#A8B820','Dark': '#705848','Dragon': '#7038F8','Electric':'#F8D030','Fairy':'#EE99AC','Fighting':'# C03028','Fire':'#F08030','Flying':'#A890F0','Ghost':'#705898','Grass':'#78C850','Ground':'#E0C068','Ice':'#98D8D8','Normal':'#A8A878','Poison':'#A040A0','Psychic':'#F85888','Rock':'#B8A038','Steel':'#B8B8D0','Water':'#6890F0'}


d3.csv("Pokemon.csv", function(pokemon) {
  //console.log(pokemon)
  pokemons = pokemon
  radarAdd('Pikachu')
  // for (var poke in pokemon.slice(0,2)){
  //   radardata.push({
  //     name: pokemon[poke].Name,
  //     color: typecolor[pokemon[poke]['Type 1']],
  //     total: +pokemon[poke].Total,
  //     axis: [
  //       {'stat': 'HP' ,'value': +pokemon[poke]['HP']},
  //       {'stat': 'Attack' ,'value': +pokemon[poke]['Attack']},
  //       {'stat': 'Defense' ,'value': +pokemon[poke]['Defense']},
  //       {'stat': 'Sp. Atk' ,'value': +pokemon[poke]['Sp. Atk']},
  //       {'stat': 'Sp. Def' ,'value': +pokemon[poke]['Sp. Def']},
  //       {'stat': 'Speed' ,'value': +pokemon[poke]['Speed']},
  //     ]
  //   })
  // }
  d3.select('#pokemons').append('select').selectAll('option').data(pokemon.sort(
    function(a, b){
   var nameA=a.Name.toLowerCase(), nameB=b.Name.toLowerCase();
   if (nameA < nameB) //sort string ascending
    return -1;
   if (nameA > nameB)
    return 1;
   return 0; //default return value (no sorting)
}))
    .enter()
    .append('option')
    .attr('val',function(d){return d})
    .text(function(d){return d.Name})

})