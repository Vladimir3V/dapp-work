const IPFS_HOST = 'localhost'
const IPFS_PORT = 5001

const IpfsApi = require('ipfs-api');
const ipfs = IpfsApi({
    host: IPFS_HOST,
    port: IPFS_PORT,
    protocol: 'http'
})
export default ipfs
