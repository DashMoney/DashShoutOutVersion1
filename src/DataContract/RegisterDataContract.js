//THIS IS THE DSO - REGISTER DATA CONTRACT

const Dash = require('dash');

const clientOpts = {
  network: 'testnet',
  wallet: {
    mnemonic:
      'Your Mnemonic',

    unsafeOptions: {
      skipSynchronizationBeforeHeight: 885000,
      //change to what the actual block height
    },
  },
};

const client = new Dash.Client(clientOpts);

const registerContract = async () => {
  const { platform } = client;
  const identity = await platform.identities.get(
    'Your Identity',
  ); // Your identity ID


  const contractDocuments = {
    dsomessage5: {
        type: 'object',
        indices: [
          {
            name: 'timeStamp',
            properties: [{ timeStamp: 'asc' }],
            unique: false,
          },
          {
            name: 'authorAndtimeStamp',
            properties: [{author: 'asc'}, { timeStamp: 'asc' }],
            unique: false,
          },
          {
            name: 'taggedAndtimeStamp',
            properties: [{tagged: 'asc'}, { timeStamp: 'asc' }],
            unique: false,
          }
        ],
        properties: {
          timeStamp: {
            type: 'integer',
            minimum: 0,
          },
          author: {
            type: 'string',
            minLength: 3,
            maxLength: 62,
          },
          message: {
            type: 'string',
            minLength: 1,
            maxLength: 450,
          },
          tagged: {
            type: 'string',
            minLength: 3,
            maxLength: 62,
          }
        }
        ,required: ['timeStamp','author','message']
        ,additionalProperties: false,
      },
    };


  const contract = await platform.contracts.create(contractDocuments, identity);
  console.dir({ contract: contract.toJSON() });

  const validationResult = await platform.dpp.dataContract.validate(contract);

  if (validationResult.isValid()) {
    console.log('Validation passed, broadcasting contract..');
    // Sign and submit the data contract
    return platform.contracts.publish(contract, identity);
  }
  console.error(validationResult); // An array of detailed validation errors
  throw validationResult.errors[0];
};

registerContract()
  .then((d) => console.log('Contract registered:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect());
