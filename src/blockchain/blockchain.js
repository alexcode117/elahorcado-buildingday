
function login() {
  // Limpia y convierte a minúsculas el nombre de usuario (los usuarios de Hive no distinguen mayúsculas/minúsculas)
  const username = usernameInput.value.trim().toLowerCase();

  // Validación básica del nombre de usuario
  if (!username) {
    outputElement.textContent = 'Por favor, ingresa un nombre de usuario de Hive.';
    outputElement.className = 'error';
    return;
  }

  // Comprueba si la extensión Hive Keychain está disponible
  if (!window.hive_keychain) {
    outputElement.textContent = 'La extensión Hive Keychain no está instalada o está deshabilitada.';
    outputElement.className = 'error';
    return;
  }

  // Actualiza la UI para mostrar un estado de carga
  loginButton.disabled = true;
  loginButton.textContent = 'Firmando...';
  outputElement.textContent = 'Por favor, confirma la transacción en la extensión de Hive Keychain...';
  outputElement.className = '';

  const message = `Autenticación Hive @${username} - ${Date.now()}`;

  //AUTENTICACION KEYCHAIN
  window.hive_keychain.requestSignBuffer(
    username,
    message,
    'Posting',
    (response) => {
      /* if (response.success) {
        outputElement.textContent = JSON.stringify(response, null, 2);
        outputElement.className = 'success';
        console.log('Firma válida:', response);
      } else {
        outputElement.textContent = `Error: ${response.message || 'La autenticación fue cancelada o falló.'}`;
        outputElement.className = 'error';
        console.error('Error de autenticación:', response);
      } */
    }


  );
}

export async function appCustomJSON({ player, word, turn, round, guess, secret, currentPlayer }) {


  try {
    const keychain = await window.hive_keychain
    keychain.requestCustomJson(null, "AhorcadoAppTest", 'Active', JSON.stringify(
      { player, word, turn, round, guess, secret, currentPlayer },"Custom Json Data Ahorcado", 
      (response)=> {
        console.log(response)
        return response
      }
    ))
    console.log("✅ Custom JSON broadcasted successfully!");
  } catch (error) {
    console.error("❌ Error broadcasting custom_json:", error.message);
  }
}


