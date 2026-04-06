function SetupChecklist({ missingFirebaseEnvKeys }) {
  return (
    <div className="setup-panel">
      <div>
        <p className="panel-kicker">Configuracion pendiente</p>
        <h2>Conecta Firebase y MongoDB para activar Abmolist</h2>
        <p className="panel-copy">
          El proyecto ya esta integrado, pero aun faltan credenciales reales en
          los archivos `.env`.
        </p>
      </div>

      <div className="setup-block">
        <strong>1. Cliente Firebase</strong>
        <p>
          Copia `client/.env.example` a `client/.env` y pega la configuracion de
          tu app web desde Firebase Console.
        </p>
        <div className="code-list">
          {missingFirebaseEnvKeys.map((key) => (
            <code key={key}>{key}</code>
          ))}
        </div>
      </div>

      <div className="setup-block">
        <strong>2. Backend Firebase Admin</strong>
        <p>
          Copia `server/.env.example` a `server/.env` y usa una de estas dos
          opciones: `FIREBASE_SERVICE_ACCOUNT_JSON` con la ruta al JSON de
          servicio, o bien `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` y
          `FIREBASE_PRIVATE_KEY`.
        </p>
      </div>

      <div className="setup-block">
        <strong>3. MongoDB Atlas</strong>
        <p>
          Añade `MONGODB_URI` con tu cadena de conexion del cluster y asegúrate
          de permitir tu IP en Network Access.
        </p>
      </div>

      <div className="setup-block">
        <strong>4. Probar el proyecto</strong>
        <p>
          Reinicia con `npm run dev` despues de guardar los `.env` para cargar la
          nueva configuracion.
        </p>
      </div>
    </div>
  );
}

export default SetupChecklist;
