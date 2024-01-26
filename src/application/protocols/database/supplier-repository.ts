import { Supplier } from "../../../domain/entities";

export interface SupplierRepository {
  byId: (id: number) => Promise<Supplier | null>;
}
