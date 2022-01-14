const web3 = require('@solana/web3.js');
const {
  Connection,
  sendAndConfirmTransaction,
  Keypair,
  Transaction,
  SystemProgram,
  PublicKey,
  TransactionInstruction,
} = require("@solana/web3.js");

const BN = require("bn.js")

const splToken = require('@solana/spl-token');

//find exchange_authority account with same seeds 

//make token accounts for authority with mint_x and mint_y
//mintXKey = "4ikeF4T6rEPbWLsn9EkUw13fskEHFps9KQ6V3PQN9Rrf"
//mintYKey = "BoQnKr1evwYnKDnnFThWYd6eSK4UJVYka58pfwyJ1j4L"

//fund the token accounts

//send initialize exchange instruction

(async () => {
  // Connect to cluster
  const connection = new web3.Connection( 
    web3.clusterApiUrl('devnet'),
    'confirmed',
  );

  const args = process.argv.slice(2);

  const exchangeProgramId = new PublicKey(args[0])

  const testUser = web3.Keypair.generate();

  var oracle = web3.Keypair.generate();

  // Generate a new wallet keypair and airdrop SOL
  var fromWallet = web3.Keypair.generate();

  console.log("Airdroping...")

  var fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    web3.LAMPORTS_PER_SOL,
  );

  var testAirdropSignature = await connection.requestAirdrop(
    testUser.publicKey,
    web3.LAMPORTS_PER_SOL,
  );
  // Wait for airdrop confirmation
  await connection.confirmTransaction(fromAirdropSignature);
  await connection.confirmTransaction(testAirdropSignature);

  console.log("Airdrop recieved")

  console.log("Creating Mint X and Y...")
  // Create new token mintX
  const mintX = await splToken.Token.createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    9,
    splToken.TOKEN_PROGRAM_ID,
  );

  // Create new token mintY
  const mintY = await splToken.Token.createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    9,
    splToken.TOKEN_PROGRAM_ID,
  );

  console.log("Mint X and Y Created")

  console.log("Finding Authority PDA...")
  const authorityKey = (await PublicKey.findProgramAddress(
    [mintX.publicKey.toBuffer(), mintY.publicKey.toBuffer()],
    exchangeProgramId
  ))[0];

  console.log("Authority PDA Found")
  console.log("Finding Vault and Test User Token Accounts...")

  const vaultXKey = await splToken.Token.getAssociatedTokenAddress(splToken.ASSOCIATED_TOKEN_PROGRAM_ID, splToken.TOKEN_PROGRAM_ID, mintX.publicKey, authorityKey, true)

  const initVaultXIns = await splToken.Token.createAssociatedTokenAccountInstruction(splToken.ASSOCIATED_TOKEN_PROGRAM_ID, splToken.TOKEN_PROGRAM_ID, mintX.publicKey, vaultXKey, authorityKey, fromWallet.publicKey)
  
  const adminTokenXAccount = await mintX.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey,
  );

  const vaultYKey = await splToken.Token.getAssociatedTokenAddress(splToken.ASSOCIATED_TOKEN_PROGRAM_ID, splToken.TOKEN_PROGRAM_ID, mintY.publicKey, authorityKey, true)

  const initVaultYIns = await splToken.Token.createAssociatedTokenAccountInstruction(splToken.ASSOCIATED_TOKEN_PROGRAM_ID, splToken.TOKEN_PROGRAM_ID, mintY.publicKey, vaultYKey, authorityKey, fromWallet.publicKey)

  const adminTokenYAccount = await mintY.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey,
  );

  const testXKey = await splToken.Token.getAssociatedTokenAddress(splToken.ASSOCIATED_TOKEN_PROGRAM_ID, splToken.TOKEN_PROGRAM_ID, mintX.publicKey, testUser.publicKey, true)

  const initTestXIns = await splToken.Token.createAssociatedTokenAccountInstruction(splToken.ASSOCIATED_TOKEN_PROGRAM_ID, splToken.TOKEN_PROGRAM_ID, mintX.publicKey, testXKey, testUser.publicKey, fromWallet.publicKey)

  const testYKey = await splToken.Token.getAssociatedTokenAddress(splToken.ASSOCIATED_TOKEN_PROGRAM_ID, splToken.TOKEN_PROGRAM_ID, mintY.publicKey, testUser.publicKey, true)

  const initTestYIns = await splToken.Token.createAssociatedTokenAccountInstruction(splToken.ASSOCIATED_TOKEN_PROGRAM_ID, splToken.TOKEN_PROGRAM_ID, mintY.publicKey, testYKey, testUser.publicKey, fromWallet.publicKey)


  console.log("Token Accounts Found")

  console.log("Minting Tokens X and Y to Admin...")

  // Minting 1 new token to the "fromTokenAccount" account we just returned/created
  await mintX.mintTo(
    adminTokenXAccount.address,
    fromWallet.publicKey,
    [],
    1000000000 * 100,
  );

  await mintY.mintTo(
    adminTokenYAccount.address,
    fromWallet.publicKey,
    [],
    1000000000 * 100,
  );

  console.log("Tokens Minted")

  console.log("Creating Vaults and Transferring Tokens in...")
  // Add token transfer instructions to transaction
  const tx1 = new web3.Transaction().add(initVaultXIns).add(initVaultYIns).add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      adminTokenXAccount.address,
      vaultXKey,
      fromWallet.publicKey,
      [],
      20,
    ),
  ).add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      adminTokenYAccount.address,
      vaultYKey,
      fromWallet.publicKey,
      [],
      20,
    ),
  )

  var signature = await web3.sendAndConfirmTransaction(
    connection,
    tx1,
    [fromWallet],
    {commitment: 'confirmed'},
  );

  console.log('SIGNATURE:', signature);

  console.log("Creating User TA's and Transferring Tokens in...")
  // Add token transfer instructions to transaction
  const tx2 = new web3.Transaction().add(initTestXIns).add(initTestYIns).add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      adminTokenXAccount.address,
      testXKey,
      fromWallet.publicKey,
      [],
      5,
    ),
  ).add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      adminTokenYAccount.address,
      testYKey,
      fromWallet.publicKey,
      [],
      5,
    ),
  )

  var signature = await web3.sendAndConfirmTransaction(
    connection,
    tx2,
    [fromWallet],
    {commitment: 'confirmed'},
  );

  console.log('SIGNATURE:', signature);

  console.log("User balance X:"+ (await connection.getTokenAccountBalance(testXKey)).value.amount +" Y: "+ (await connection.getTokenAccountBalance(testYKey)).value.amount)

  console.log("Sending Initialize Instruction...")

  const tx3 = new web3.Transaction().add(initialize(fromWallet.publicKey, oracle.publicKey, authorityKey, vaultXKey, vaultYKey, mintX.publicKey, mintY.publicKey, exchangeProgramId, 1));

  signature = await web3.sendAndConfirmTransaction(
    connection,
    tx3,
    [fromWallet],
    {commitment: 'confirmed'},
  );

  console.log('SIGNATURE', signature);

  console.log("Sending Exchange Instruction")
  const tx4 = new web3.Transaction().add(exchange(testUser.publicKey, testXKey, testYKey, vaultXKey, vaultYKey, authorityKey, mintX.publicKey, mintY.publicKey, exchangeProgramId, 1))

  signature = await web3.sendAndConfirmTransaction(
    connection,
    tx4,
    [testUser],
    {commitment: 'confirmed'},
  );

  console.log('SIGNATURE', signature);
})();

const initialize = (admin, oracle, exchange_authority, vault_x, vault_y, mint_x, mint_y, exchangeProgramId, _fee) => {

  const instruction = Buffer.from(new Uint8Array((new BN(0)).toArray("le", 1)));
  const fee = Buffer.from(new Uint8Array((new BN(_fee)).toArray("le", 4)));

  return new TransactionInstruction({
    keys: [
      {
        pubkey: admin,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: oracle,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: exchange_authority,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: vault_x,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: vault_y,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: mint_x,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: mint_y,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: splToken.TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
    ],
    data: Buffer.concat([instruction, fee]),
    //data: Buffer.concat([Buffer.from(new Uint8Array([0])), fee]),
    programId: exchangeProgramId,
  });
};

const exchange = (user, userTAX, userTAY, vault_x, vault_y, exchange_auth, mint_x, mint_y, exchangeProgramId,_amount) => {

  const instruction = Buffer.from(new Uint8Array((new BN(3)).toArray("le", 3)));
  const amount = Buffer.from(new Uint8Array((new BN(_amount)).toArray("le", 8)));

  return new TransactionInstruction({
    keys: [
      {
        pubkey: user,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: userTAX,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: userTAY,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: vault_x,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: vault_y,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: exchange_auth,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: mint_x,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: mint_y,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: splToken.TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
    ],
    data: Buffer.concat([instruction, amount]),
    programId: exchangeProgramId,
  });
};