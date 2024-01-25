import { ProductOperationsImpl } from "../../../src/application/use-cases/product-operations-impl";
import { ProductRepository } from "../../../src/application/protocols/database/product-repository";

const spyRepository: jest.Mocked<ProductRepository> = {
  create: jest.fn(),
  byName: jest.fn(),
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
});
