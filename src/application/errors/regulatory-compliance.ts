export class RegulatoryCompliance extends Error {
  name = "RegulatoryComplianceError";
  constructor() {
    super("Regulatory compliance impose that stock below 0 are not allowed");
  }
}
