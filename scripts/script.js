/*TEST TWITCH API*/

/*Constantes*/
const client_id = 'iphh84pzvfgolanvq5y46os3fc836l';
const apiUrl = 'https://api.twitch.tv/kraken/streams/';
const fetchOptions = { 
    method: 'GET', 
    headers: {'Client-id': client_id}
}
var listStream = document.getElementById('listStreams');
var moreField = document.getElementById('moreField');
var loadField = document.getElementById('loadField');
var streamCards = document.getElementById('streams');
var gameSelector = document.getElementById('game');
var loading = false;
var searchFound = false;
var nextUrl = "";

/*HTML INPUT*/
  function createNode(element) {
    return document.createElement(element); // Create the type of element you pass in the parameters
  }
  function append(parent, el) {
    return parent.appendChild(el); // Append the second parameter(element) to the first one
  }
  function clearList(){
    listStream.removeChild(streamCards);
    let div = createNode('div');
    div.id="streams";
    append(listStream,div);
    streamCards = document.getElementById('streams');
    moreField.removeChild(document.getElementById('more'));
  }
  function clearLoading(){
    loadField.removeChild(document.getElementById('load'));
    moreField.removeChild(document.getElementById('more'));
  }
  function interface(){
    //console.log("interface loading");
    $("#game").select2();
    $("#language").select2();
  }

/*Global Stats*/
  var global_stats = {totalStream : 0, totalViewers : 0, currentStream : 0}
  function updateStats(fetchData){
    global_stats.totalStream = fetchData._total;
  }
  function incrementStats(stream){
    global_stats.currentStream++;
    global_stats.totalViewers += stream.viewers;
  }
  function displayGlobalStats(){
    console.log("----Global Stats----");
    console.log(global_stats);
  }
/*Twitch Data*/
  function getGames(url,options){
    fetch(url,options)
    .then((resp) => resp.json())
    .then(function(data) { 
      if(typeof data.top !== 'undefined'){
        let games = data;
        let allTitlesGames = gameTitle(games.top);
        allTitlesGames.push(getGames(data._links.next,options));
        allTitlesGames = allTitlesGames.slice(0, -1);
        printGames(allTitlesGames);
      }
    })
    .catch(function(error) {
      console.log("get an error");
      console.log(error);
    });
  }
  function gameTitle(gamesObj){
    let titles = [];
    gamesObj.map(function(gameObj) { 
      titles.push(gameObj.game.name);
    });
    return titles;
  }
  function printGames(titles){
    titles.map(function(title) {
      let gameopt = createNode("option");
      gameopt.value = title;
      gameopt.innerHTML = title;
      append(gameSelector,gameopt);
    });
    /*display interface*/
    interface();
  }
/*Search Functions*/
  function fetchStreams(urlS,limit,iteration=0,iterationMax = 1000){
    fetch(urlS,fetchOptions)
    .then((resp) => resp.json())
    .then(function(data) {
      console.log(data);
      if(data.streams.length>0 && iteration<iterationMax){
        iteration++;
        updateStats(data);
        let streams = data.streams;
        let okStreams = checkStreams(streams,limit);
        if(!searchFound){
          okStreams.push(fetchStreams(data._links.next,limit,iteration,iterationMax));
        }
        else{
          if(data._links.next != null){nextUrl = data._links.next;}
        }
        okStreams = okStreams.slice(0, -1);
        if(okStreams.length > 0){
          displayStream(okStreams);
        }
      }
      else{
        if(loading){
          clearLoading();
          loading = false;
        }
        let notFound = createNode("span");
        notFound.id = "notFound";
        notFound.innerHTML = "No streams found<br>😞";
        let more = createNode("span");
        more.id = "more";
        more.style = "display : none;";
        append(streamCards,notFound);
        append(moreField,more);
      }
    })
    .catch(function(error) {
      console.log("get an error");
      console.log(error);
    });
  }
  function checkStreams(streams,limit){
    let okStreams = [];
    streams.map(function(stream) { // parcours des streams
      if(stream.viewers<=limit){
        incrementStats(stream);
        okStreams.push(stream);
      }
    });
    if(okStreams.length>0){searchFound = true;}
    return okStreams;
  }
  function displayStream(streams){
    if(loading){
      clearLoading();
      loading = false;
    }
    streams.map(function(stream) {
    //card creation
      let card = createNode('div'); 
      card.id = "card";
    //preview creation
      let preview = createNode('div'); 
      preview.id = "preview";
      let img = createNode('img');
      img.src = stream.preview.medium;
      let link = createNode('a');
      link.href = stream.channel.url;
      link.target = "blank";
      append(link,img);
      append(preview,link);
    //game title
      let game = createNode("div");
      game.id="game";
      let title = createNode("span");
      title.innerHTML = stream.channel.game;
      append(game,title);
    //bio creation
      let bio = createNode('div'); 
      bio.id = "bio";
      let pp = createNode('img');
      pp.src = "\img/default.png"
      if(stream.channel.logo != null){      
        pp.src = stream.channel.logo;
      }
      let presentation = createNode("p");
      let a = createNode('a');
      a.href = stream.channel.url;
      a.innerHTML = "<h3>"+stream.channel.display_name+"</h3>"+stream.channel.status;
      a.target = "blank";
      append(presentation,a);
      append(bio,pp);
      append(bio,presentation);
    //info creation
      let infos = createNode("div");
      infos.id = "infos";
      let viewers = createNode("span");
      viewers.id = "viewers";
      viewers.innerHTML = "Viewers : "+stream.viewers;
      let followers = createNode("span");
      followers.id = "followers";
      followers.innerHTML = "Followers : "+stream.channel.followers;
      append(infos,followers);
      append(infos,viewers);
    // card assembly
      append(card, preview); 
      append(card, game); 
      append(card, bio); 
      append(card, infos);
      append(streamCards,card);
    });
    if(nextUrl != ""){
      let more = createNode("button");
      more.id = "more";
      more.innerHTML = "Load more results";
      more.onclick= function () { loadMore(); };
      append(moreField,more);
    }
  }
  function find(){
    //clear list
    clearList();
    if(!loading){
      loading = true;
      searchFound = false;
      let load = createNode("img");
      load.id = "load";
      load.src = "img/spinner.gif";
      append(loadField,load);
    }
    let more = createNode("span");
    more.id = "more";
    more.style = "display : none;";
    append(moreField,more);
    //creation of the url
    let url = apiUrl+"?limit=30;";
    let gameList = document.getElementById("game");
    let game = gameList.value;
    if(game!=""){
      url+="game="+game+";";
    }
    let languageList = document.getElementById('language');
    let language = languageList.value;
    if(language!=""){
      url+="language="+language+";";
    }
    let limitViewers = document.getElementById('nbViewers').value;
    //console.log("URL : "+url);
    fetchStreams(url,limitViewers);
  }
  function loadMore(){
    moreField.removeChild(document.getElementById('more'));
    let more = createNode("span");
    more.id = "more";
    more.style = "display : none;";
    append(moreField,more);
    loading = true;
    searchFound = false;
    let load = createNode("img");
    load.id = "load";
    load.src = "img/spinner.gif";
    append(loadField,load);
    let limit = 1000000000;
    fetchStreams(nextUrl,limit);
  }
  function index(){
    clearList();
    let url = apiUrl+"?limit=10;offset=10000";
    fetchStreams(url,10,0,1);
  }


//Get played games list
let urlgames = 'https://api.twitch.tv/kraken/games/top/?limit=100';
let opt = { 
    method: 'GET', 
    headers: {'Client-id': client_id}
};
getGames(urlgames,opt);
/*display not so random livestreams*/
index();