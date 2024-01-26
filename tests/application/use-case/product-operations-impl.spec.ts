import { ProductOperationsImpl } from "../../../src/application/use-cases/product-operations-impl";
import { ProductRepository } from "../../../src/application/protocols/database/product-repository";
import { Product } from "../../../src/domain/entities";
import { ProductNotFound } from "../../../src/application/errors";

const spyRepository: jest.Mocked<ProductRepository> = {
  create: jest.fn(),
  byName: jest.fn(),
  byId: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  updatePartially: jest.fn(),
  delete: jest.fn(),
};

const createMockedProduct = () => ({
  id: 1,
  name: "some_name",
  quantityInStock: 1,
  minimumStock: 1,
  supplierId: 1,
});

describe("ProductOperationsImpl", () => {
  let sut: ProductOperationsImpl;

  beforeEach(() => {
    sut = new ProductOperationsImpl(spyRepository);
  });

  describe("create", () => {
    it('should call "repository.create" with correct args', async () => {
      const product = createMockedProduct();

      await sut.create(product);

      expect(spyRepository.create).toHaveBeenCalledWith(product);
    });

    it("should return a Product", async () => {
      spyRepository.byId.mockResolvedValue(createMockedProduct());

      const product = await sut.retrieveOne(1);

      expect(product).toMatchObject<Product>({
        id: 1,
        name: "some_name",
        quantityInStock: 1,
        minimumStock: 1,
        supplierId: 1,
      });
    });

    it("should throw when trying to create a product that's already exists", async () => {
      const newProduct = createMockedProduct();
      spyRepository.byName.mockResolvedValueOnce(createMockedProduct());

      const promise = sut.create(newProduct);

      await expect(promise).rejects.toThrow(`Product exists with id ${1}`);
    });

    it('should throw when "repository" throws', async () => {
      spyRepository.create.mockRejectedValueOnce(
        new Error("Something didnt work as expected"),
      );

      const promise = sut.create(createMockedProduct());

      await expect(promise).rejects.toThrow("Something didnt work as expected");
    });
  });

  describe("retrieve one", () => {
    it('should call "repository.findAll" with correct args', async () => {
      await sut.retrieveOne(1);

      expect(spyRepository.byId).toHaveBeenCalledWith(1);
    });

    it("should return a Product", async () => {
      spyRepository.byId.mockResolvedValue(createMockedProduct());

      const product = await sut.retrieveOne(1);

      expect(product).toStrictEqual({
        id: 1,
        name: "some_name",
        quantityInStock: 1,
        minimumStock: 1,
        supplierId: 1,
      });
    });

    it('should return "undefined" if given id does not correspond to any product', async () => {
      spyRepository.byId.mockResolvedValue(undefined);

      const product = await sut.retrieveOne(2);

      expect(product).toBeUndefined();
    });

    it('should throw when "repository" throws', async () => {
      spyRepository.byId.mockRejectedValueOnce(
        new Error("Something bad happened"),
      );

      const promise = sut.retrieveOne(1);

      await expect(promise).rejects.toThrow("Something bad happened");
    });
  });

  describe("retrieve list", () => {
    it("should return a list of Products", async () => {
      spyRepository.findAll.mockResolvedValue([
        createMockedProduct(),
        createMockedProduct(),
      ]);

      const products = await sut.retrieveList();

      expect(products).toHaveLength(2);
    });

    it("should return an empty list when there has no products yet", async () => {
      spyRepository.findAll.mockResolvedValue([]);

      const products = await sut.retrieveList();

      expect(products).toHaveLength(0);
    });

    it('should throw when "repository" throws', async () => {
      spyRepository.findAll.mockRejectedValueOnce(
        new Error("Something is broken"),
      );

      const promise = sut.retrieveList();

      await expect(promise).rejects.toThrow("Something is broken");
    });
  });

  describe("update", () => {
    beforeEach(() => {
      spyRepository.byId.mockResolvedValue(createMockedProduct());
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call "repository" with correct args', async () => {
      await sut.update(1, createMockedProduct());

      expect(spyRepository.update).toHaveBeenCalledWith(1, {
        id: 1,
        name: "some_name",
        quantityInStock: 1,
        minimumStock: 1,
        supplierId: 1,
      });
    });

    it('should throw if "id" is invalid', async () => {
      spyRepository.byId.mockResolvedValue(undefined);

      const promise = sut.update(2, createMockedProduct());

      await expect(promise).rejects.toBeInstanceOf(ProductNotFound);
    });

    it('should throw when "repostiory" throws', async () => {
      spyRepository.update.mockRejectedValueOnce(
        new Error("Bad things could happen"),
      );

      const promise = sut.update(1, createMockedProduct());

      await expect(promise).rejects.toThrow("Bad things could happen");
    });
  });

  describe("update partially", () => {
    it('should call "repostiory" with correct args', async () => {
      await sut.updatePartially(1, { name: "another_name" });

      expect(spyRepository.updatePartially).toHaveBeenCalledWith(1, {
        name: "another_name",
      });
    });

    it('should throw if "id" is not valid', async () => {
      spyRepository.byId.mockResolvedValueOnce(undefined);

      const promise = sut.updatePartially(5, { supplierId: 2 });

      await expect(promise).rejects.toBeInstanceOf(ProductNotFound);
    });

    it('should throw when "repostiory" throws', async () => {
      spyRepository.updatePartially.mockRejectedValueOnce(
        new Error("Bad things could happen"),
      );

      const promise = sut.updatePartially(1, createMockedProduct());

      await expect(promise).rejects.toThrow("Bad things could happen");
    });
  });
});
