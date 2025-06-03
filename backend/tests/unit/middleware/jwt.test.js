const jwt = require("jsonwebtoken");
const jwtMiddleware = require("../../../middleware/jwtUtils");

jest.mock("jsonwebtoken");
process.env.SECRET;

describe("JWT Middleware", () => {
    
  // Tests fonction parse
  describe("parse", () => {
    test("doit extraire le token d'une chaîne d'autorisation valide", () => {

      const authorization = "Bearer token123";

      expect(jwtMiddleware.parse(authorization)).toBe("token123");
    });

    test("doit retourner null si l'autorisation est null", () => {
      expect(jwtMiddleware.parse(null)).toBeNull();
    });

    test("doit retourner null si l'autorisation est undefined", () => {
      expect(jwtMiddleware.parse(undefined)).toBeNull();
    });
  });

  // Tests fonction getUser
  describe("getUser", () => {
    beforeEach(() => {
      // Réinitialiser les mocks après chaque test
      jest.clearAllMocks();
    });

    test("doit retourner l'ID utilisateur à partir d'un token valide", () => {
      // Arrange
      const authorization = "Bearer valid-token";
      jwt.verify.mockReturnValue({ id: 123 });

      // Act
      const result = jwtMiddleware.getUser(authorization);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(
        "valid-token",
        process.env.SECRET
      );
      expect(result).toBe(123);
    });

    test("doit retourner -1 si le token est null", () => {
      const result = jwtMiddleware.getUser(null);
      expect(result).toBe(-1);
    });

    test('doit retourner -1 si le token est "null"', () => {
      // Arrange
      const authorization = "Bearer null";

      // Act & Assert
      expect(jwtMiddleware.getUser(authorization)).toBe(-1);
    });

    test("doit retourner -1 si la vérification du token échoue", () => {
      // Arrange
      const authorization = "Bearer invalid-token";
      jwt.verify.mockImplementation(() => {
        throw new Error("Token invalide");
      });

      // Spy sur console.log pour vérifier qu'il est appelé avec l'erreur
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      // Act
      const result = jwtMiddleware.getUser(authorization);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(
        "invalid-token",
        process.env.SECRET
      );
      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toBe(-1);

      // Restaurer console.log
      consoleSpy.mockRestore();
    });

    test("doit retourner -1 si l'ID utilisateur n'est pas > 0", () => {
      // Arrange
      const authorization = "Bearer zero-id-token";
      jwt.verify.mockReturnValue({ id: 0 });

      // Act
      const result = jwtMiddleware.getUser(authorization);

      // Assert
      expect(result).toBe(-1);
    });
  });

  // Tests pour la fonction adminUser
  describe("adminUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("doit retourner true pour un utilisateur admin", () => {
      // Arrange
      const authorization = "Bearer admin-token";
      jwt.verify.mockReturnValue({ is_admin: true });

      // Act
      const result = jwtMiddleware.adminUser(authorization);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(
        "admin-token",
        process.env.SECRET
      );
      expect(result).toBe(true);
    });

    test("doit retourner false pour un utilisateur non admin", () => {
      // Arrange
      const authorization = "Bearer non-admin-token";
      jwt.verify.mockReturnValue({ is_admin: false });

      // Act
      const result = jwtMiddleware.adminUser(authorization);

      // Assert
      expect(result).toBe(false);
    });

    test("doit retourner false pour un utilisateur sans propriété is_admin", () => {
      // Arrange
      const authorization = "Bearer user-token";
      jwt.verify.mockReturnValue({ id: 123 });

      // Act
      const result = jwtMiddleware.adminUser(authorization);

      // Assert
      expect(result).toBe(false);
    });

    test("doit retourner false si le token est null", () => {
      expect(jwtMiddleware.adminUser(null)).toBe(false);
    });

    test('doit retourner false si le token est "null"', () => {
      expect(jwtMiddleware.adminUser("Bearer null")).toBe(false);
    });

    test("doit retourner false si la vérification du token échoue", () => {
      // Arrange
      const authorization = "Bearer invalid-token";
      jwt.verify.mockImplementation(() => {
        throw new Error("Token invalide");
      });

      // Spy sur console.error pour vérifier qu'il est appelé avec l'erreur
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      // Act
      const result = jwtMiddleware.adminUser(authorization);

      // Assert
      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toBe(false);

      // Restaurer console.error
      consoleSpy.mockRestore();
    });
  });
});
