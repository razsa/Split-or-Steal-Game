module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // GANACHE default port. Download link : http://truffleframework.com/ganache/
      network_id: "*" // Match any network id
    }
  }
};
