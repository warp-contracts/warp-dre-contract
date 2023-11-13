import { ContractState } from "./types/ContractState";
import { ContractAction } from "./types/ContractAction";
import { ContractResult } from "./types/ContractResult";
import { addSrcToWhitelist, evolve, registerNode, registerSubnet, removeNode, removeSubnet } from "./contractFunctions";

const functions = new Map([
  ["evolve", evolve],
  ["registerSubnet", registerSubnet],
  ["removeSubnet", removeSubnet],
  ["registerNode", registerNode],
  ["removeNode", removeNode],
  ["addSrcToWhitelist", addSrcToWhitelist]
]);

export async function handle(state: ContractState, action: ContractAction): Promise<ContractResult> {
  const input = action.input;
  if (!functions.has(input.function)) {
    throw new ContractError(`Unknown contract function: ${input.function}`);
  }
  return await functions.get(input.function)(state, action);
}
