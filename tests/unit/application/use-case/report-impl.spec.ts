import { ReportRepository } from "../../../../src/application/protocols/database/report-repository";
import { ReportImpl } from "../../../../src/application/use-cases/report-impl";
import { RestockingNeeds } from "../../../../src/domain/entities";

const repository: jest.Mocked<ReportRepository> = {
  summary: jest.fn(),
};

describe("ReportImpl", () => {
  let sut: ReportImpl;

  beforeEach(() => {
    sut = new ReportImpl(repository);
  });

  describe("summary", () => {
    it('should call "repository" with correct args', async () => {
      await sut.generateReport(RestockingNeeds.Low);

      expect(repository.summary).toHaveBeenCalledWith(RestockingNeeds.Low);
    });

    it('should call throw when "repository" throws', async () => {
      repository.summary.mockRejectedValueOnce(new Error("summary error"));

      const promise = sut.generateReport(RestockingNeeds.Low);

      await expect(promise).rejects.toThrow("summary error");
    });
  });
});
