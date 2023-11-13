import { SubnetDataSchema } from "./ContractState";
import { z } from "zod";

export interface ContractAction {
  input: RegisterSchemaInput;
  caller: string;
}

export const ContractActionSchema = z.object({
  function: z.string().min(1)
});

export interface ContractInput {
  function: string;
}

export const RegisterSubnetInputSchema =
  ContractActionSchema.extend(SubnetDataSchema.omit({ nodes: true }).shape);

export type RegisterSchemaInput = z.infer<typeof RegisterSubnetInputSchema>;
