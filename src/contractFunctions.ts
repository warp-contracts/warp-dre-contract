import { ContractState } from "./types/ContractState";
import { ContractAction, RegisterSubnetInputSchema } from "./types/ContractAction";
import { ContractResult } from "./types/ContractResult";

export async function evolve(
  state: ContractState,
  { caller, input: { value } }: ContractAction): Promise<ContractResult> {
  if (!state.owners.includes(caller)) {
    throw new ContractError('Only the owner can evolve a contract.');
  }

  state.evolve = value;

  return { state }
}

export async function registerSubnet(
  state: ContractState,
  { caller, input }: ContractAction): Promise<ContractResult> {
  if (!state.owners.includes(caller)) {
    throw new ContractError('Only the owner can register a subnet.');
  }

  const validatedInput = RegisterSubnetInputSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new ContractError(validatedInput.error);
  } else {
    if (!state.subnets) {
      state.subnets = {};
    }
    const subnet = validatedInput.data;
    state.subnets[subnet.id] = subnet
  }

  return { state }
}

export async function removeSubnet(state: ContractState, { caller, input }: ContractAction): Promise<ContractResult> {
  if (!state.owners.includes(caller)) {
    throw new ContractError('Only the owner can register a subnet.');
  }

  return { state }
}

export async function registerNode(state: ContractState, { input }: ContractAction): Promise<ContractResult> {
  return { state }
}

export async function removeNode(state: ContractState, { input }: ContractAction): Promise<ContractResult> {
  return { state }
}

export async function addSrcToWhitelist(state: ContractState, { input }: ContractAction): Promise<ContractResult> {
  return { state }
}