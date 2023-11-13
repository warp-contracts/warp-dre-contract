import ArLocal from 'arlocal';
import { JWKInterface } from 'arweave/node/lib/wallet';
import fs from 'fs';
import path from 'path';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import { LoggerFactory, Warp, WarpFactory, Contract } from 'warp-contracts';
import { ContractState } from "../src/types/ContractState";

jest.setTimeout(30000);

describe('Testing D.R.E. Contract', () => {
  let ownerWallet: JWKInterface;
  let owner: string;

  let initialState: ContractState;

  let arlocal: ArLocal;
  let warp: Warp;
  let contract: Contract<ContractState>;

  let contractSrc: string;

  let contractId: string;

  beforeAll(async () => {
    arlocal = new ArLocal(1821, false);
    await arlocal.start();

    LoggerFactory.INST.logLevel('error');

    warp = WarpFactory.forLocal(1821).use(new DeployPlugin());

    ({ jwk: ownerWallet, address: owner } = await warp.generateWallet());

    initialState = {
      owners: [owner],
      evolve: '',
      subnets: {},
    };

    contractSrc = fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8');

    ({ contractTxId: contractId } = await warp.deploy({
      wallet: ownerWallet,
      initState: JSON.stringify(initialState),
      src: contractSrc,
      evaluationManifest: {
        evaluationOptions: {
          useKVStorage: true,
        },
      },
    }));
    console.log('Deployed contract: ', contractId);
    contract = warp
      .contract<ContractState>(contractId)
      .setEvaluationOptions({
        unsafeClient: 'allow',
        allowBigInt: true
      })
      .connect(ownerWallet);
  });

  afterAll(async () => {
    await arlocal.stop();
  });

  it('should properly deploy contract', async () => {
    const contractTx = await warp.arweave.transactions.get(contractId);

    expect(contractTx).not.toBeNull();
  });

  it('should read Contract state', async () => {
    console.log(initialState);
    console.log((await contract.readState()).cachedValue.state);
    expect((await contract.readState()).cachedValue.state).toEqual(initialState);
  });

  it('should not register subnet if owners not specified', async () => {
    await expect(
      contract.writeInteraction(
        { function: 'registerSubnet', id: 'TEST-SUBNET', description: 'duh', owners: [] },
        { strict: true }
      )
    ).rejects.toThrow('Incorrect contract tx id.');
  });


});
