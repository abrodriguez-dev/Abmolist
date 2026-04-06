import { beforeEach, describe, expect, it, vi } from "vitest";
import { getHealth } from "./controllers/healthController.js";
import { authenticate } from "./middleware/authenticate.js";
import { getServerConfig, validateServerEnv } from "./config/env.js";

function createResponse() {
  return {
    body: undefined,
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

describe("health controller", () => {
  it("returns ok status", () => {
    const response = createResponse();

    getHealth({}, response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("authenticate middleware", () => {
  it("rejects requests without bearer token", async () => {
    const response = createResponse();
    const next = vi.fn();

    await authenticate({ headers: {} }, response, next);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      message: "Falta el token de autenticacion."
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("server env config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  it("uses sensible defaults", () => {
    delete process.env.PORT;
    delete process.env.CLIENT_ORIGIN;

    expect(getServerConfig()).toEqual({
      port: 4000,
      clientOrigin: "http://localhost:5173"
    });
  });

  it("fails when required backend variables are missing", () => {
    delete process.env.MONGODB_URI;
    delete process.env.FIREBASE_PROJECT_ID;
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.FIREBASE_PRIVATE_KEY;

    expect(() => validateServerEnv()).toThrow(
      "Faltan variables de entorno del backend: MONGODB_URI, FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY."
    );
  });
});
