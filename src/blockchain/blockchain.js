import  { Client, utils } from "@hiveio/dhive";

export const hiveClient = new Client(["https://api.hive.blog"]);

export async function saveGameToHive(gameState) {
  try {
    const keychain = window.hive_keychain;

    const result = await new Promise((resolve, reject) => {
      keychain.requestCustomJson(
        null,
        "elahorcado-builingday-test",
        "Posting",
        JSON.stringify(gameState),
        "Elahorcado Building Day",
        (response) => {
          if (response.success) {
            resolve(response);
          } else {
            reject(response);
          }
        }
      );
    });

    return result;
  } catch (e) {
    return null;
  }
}



export async function fetchGameInfo(Game){
  //Username comes from Game/GameState object
  const op = utils.operationOrders;
  const operationBitmask = utils.makeBitMaskFilter([op.custom_json]); 
  //Get account History
  const customJSONsArray = await hiveClient.database.getAccountHistory(Game.player, -1 , 100, operationBitmask);
  const customJSONArrayReversed = customJSONsArray.reverse();
  //Filtering operations through the app ID and getting most recent (first match)
  const checkRecentAction = (element) => element[1].op[1].id === "elahorcado-builingday-test";
  const result = customJSONArrayReversed.find((element)=> checkRecentAction(element));
  const customJSON = result[1].op[1].json;
  return customJSON;
}

/*
Fetching custom_json from account history
~1. Get account username 
~2. Get account history
~3. Filter by custom_json with the game_id\
NOTE: The custom_json is the last one!
custom_json_operation : 18
*/