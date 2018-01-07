import requests

#Var
urlApi = "https://api.twitch.tv/kraken/games/top/"
Client_id = "iphh84pzvfgolanvq5y46os3fc836l"
headers = {"Client-id" : Client_id }
parameters = {"limit" : 50}

#getGames
#get the almost the 1700 most played games on twitch.
#it's not perfect but it's still better than list all those games by hand...
def getGames(url,params,headers):
  response = requests.get(url, params=params, headers=headers)
  code = response.status_code
  gamesTitles = []
  if(code == requests.codes.ok):
    data = response.json()
    games = data["top"]
    gamesTitles = getGamesTitle(games)
    gamesTitles += getGames(data["_links"]["next"],params,headers)
  else :
    print("finish")
  return gamesTitles

#getGamesTitle
#extract the name of each game list in the fetched JSON response.
def getGamesTitle(games):
  titles = []
  for gameObj in games :
    titles.append(gameObj["game"]["name"])
  return titles

#printList
#print games name in a file.
def printList(games):
  games.sort()
  file = open('listGames.html', 'w',encoding='utf-8')
  for game in games:
    file.write(game)
    file.write("\n")
  file.close()

#printSelector
#create a html form selector with every streamed games name.
def printSelector(games):
  games.sort()
  file = open('selectorGames.html', 'w',encoding='utf-8')
  file.write('<select id="game">\n')
  for game in games:
    file.write('  <option value="'+game+'">'+game+'</option>\n')
  file.write('</select>')
  file.close()
  
printSelector(getGames(urlApi,parameters,headers))