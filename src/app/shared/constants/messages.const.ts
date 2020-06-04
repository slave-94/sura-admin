export const LOGIN_MSGS = {
  LOGIN_SUCCESS: "Sesión iniciada correctamente",
  ERROR_LOGIN: "Error al iniciar sesión",
  USER_NO_ADMIN: "El usuario no es administrador"
}

export const DIAG_MSGS = {
  DEL_MSG_INI: "La información de",
  DEL_MSG_FIN: "será eliminada permanentemente"
}

export const GALERIA_MSGS = {
  DEL_MSG_INI: "La imagen",
  DEL_MSG_FIN: "será eliminada",
  CREATE_SUCCESS: "Imagen guardada exitosamente",
  DELETE_SUCCESS: "Imagen eliminada exitosamente"
}

export const strings = {
  loginErrors: {
    emailIncorrectoCode: "auth/invalid-email",
    emailIncorrectoMsg: "Correo inválido",
    emailNoEncontradoCode: "auth/user-not-found",
    emailNoEncontradoMsg: "Cuenta de correo no registrada",
    passwordIncorrectoCode: "auth/wrong-password",
    passwordIncorrectoMsg: "Contraseña incorrecta",
    defaultLoginMsg: "Ocurrió un error al intentar ingresar"
  },
  registroUsuarioErrors: {
    emailRegistradoCode: "auth/email-already-in-use",
    emailRegistradoMsg: "ya se encuentra registrada",
    defaultRegistroUsrMsg: "Ocurrió un error al intentar registrar usuario"
  },
  registroEventoErrors: {
    defaultregistroEvtMsg: "Ocurrió un error al intentar registrar evento"
  },
  registroItinerarioCatalogos: {
    tipos: {
      academico: "ACADEMICO",
      acompaniante: "ACOMPANIANTE",
      social: "SOCIAL"
    }
  },
  registroItinerarioErrors: {
    defaultregistroItiMsg: "Ocurrió un error al intentar registrar itinerario"
  }
};