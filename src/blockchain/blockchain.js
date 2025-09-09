import { Client } from "@hiveio/dhive";

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
