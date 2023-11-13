import { z } from "zod";

export const zodArweaveId = z.string().regex(/[a-z\d_-]{43}/i);
export const zodTimestampString = z.string().regex(/\d{13}/);

export const UpdateModeEnum = z.enum(["subscription", "poll"]);
export type UpdateMode = z.infer<typeof UpdateModeEnum>;


export const DreEvaluationOptionsSchema = z.object({
  maxCallDepth: z.number().int().nonnegative(),
  maxInteractionEvaluationTimeSeconds: z.number().int().positive(),
  allowBigInt: z.boolean(),
  unsafeClient: z.string(), // TODO
  internalWrites: z.boolean(),
  cacheEveryNInteractions: z.number().int().nonnegative()
});

export type DreEvaluationOptions = z.infer<typeof DreEvaluationOptionsSchema>;

export const WhitelistDataSchema = z.object({
  srcTxId: zodArweaveId,
  addedTimestamp: zodTimestampString,
  sortKey: z.string().min(1),
  effectiveSyncTimestamp: zodTimestampString,
  addedOwner: zodArweaveId,
  description: z.string()
});

export type WhitelistData = z.infer<typeof WhitelistDataSchema>;

export const NodeDataSchema = z.object({
  ip: z.string().ip(),
  url: z.string().url().optional(),
  owner: zodArweaveId,
  gateway: z.string(),
  addedTimestamp: zodTimestampString,
  lastStartTimestamp: zodTimestampString,
  lastStopTimestamp: zodTimestampString
});

export type NodeData = z.infer<typeof NodeDataSchema>;

export const SubnetDataSchema = z.object({
  id: z.string(),
  description: z.string(),
  owners: z.array(zodArweaveId).nonempty(),
  whitelistedSources: z.array(WhitelistDataSchema),
  blacklistedContracts: z.array(zodArweaveId),
  evaluationOptions: DreEvaluationOptionsSchema,
  gateways: z.array(z.string().url()),
  warpGatewayUrl: z.string().url(),
  updateMode: UpdateModeEnum,
  pollData: z.object({
    firstInteractionTimestamp: zodTimestampString,
    syncWindowsSeconds: z.array(z.number().int().positive())
  }),
  nodes: z.record(NodeDataSchema)
});

export type SubnetData = z.infer<typeof SubnetDataSchema>;

export const ContractStateSchema = z.object({
  owners: z.array(zodArweaveId),
  evolve: z.string().optional(),
  subnets: z.record(SubnetDataSchema)
});

export type ContractState = z.infer<typeof ContractStateSchema>;
