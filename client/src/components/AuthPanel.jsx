function AuthPanel({
  authMode,
  busy,
  credentials,
  error,
  onChange,
  onGoogleLogin,
  onSubmit,
  onToggleMode
}) {
  const isRegister = authMode === "register";

  return (
    <div className="auth-panel">
      <div>
        <p className="panel-kicker">Acceso seguro</p>
        <h2>{isRegister ? "Crea tu cuenta" : "Entra a tu espacio"}</h2>
        <p className="panel-copy">
          Cada usuario conserva sus propias tareas. Puedes entrar con email o
          con Google usando Firebase Authentication.
        </p>
      </div>

      <form className="stack-form" onSubmit={onSubmit}>
        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="tu@email.com"
            value={credentials.email}
            onChange={onChange}
            required
          />
        </label>

        <label>
          <span>Contrasena</span>
          <input
            type="password"
            name="password"
            placeholder="Minimo 6 caracteres"
            value={credentials.password}
            onChange={onChange}
            minLength={6}
            required
          />
        </label>

        {error ? <p className="error-banner">{error}</p> : null}

        <button className="primary-button" type="submit" disabled={busy}>
          {busy
            ? "Procesando..."
            : isRegister
              ? "Crear cuenta"
              : "Entrar"}
        </button>
      </form>

      <button
        className="secondary-button google-button"
        type="button"
        onClick={onGoogleLogin}
        disabled={busy}
        aria-label="Continuar con Google"
        title="Continuar con Google"
      >
        <img
          src="/google-icon-logo-svgrepo-com.svg"
          alt=""
          aria-hidden="true"
        />
      </button>

      <button
        className="ghost-link"
        type="button"
        onClick={() => onToggleMode(isRegister ? "login" : "register")}
      >
        {isRegister
          ? "Ya tengo cuenta"
          : "Necesito crear una cuenta nueva"}
      </button>
    </div>
  );
}

export default AuthPanel;
