// const IPFS_HOST = 'localhost'
const IPFS_HOST = 'ipfs.infura.io'
const IPFS_PORT = 5001

const IpfsApi = require('ipfs-api');
const ipfs = IpfsApi({
    host: IPFS_HOST,
    port: IPFS_PORT,
    protocol: 'https'
})
export default ipfs
