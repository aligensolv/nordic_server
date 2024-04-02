// with commonJS
const { Client } = require('node-scp')
const path = require('path')
const { vps_host, vps_port, vps_user, vps_pass } = require('../config.js')

async function downloadBackup () {
  try {
    const client = await Client({
      host: vps_host,
      port: vps_port,
      username: vps_user,
      password: vps_pass
    })
    await client.downloadDir('backup/', path.join('E:','backups'))
    client.close()
  } catch (e) {
    console.log(e)
  }
}
module.exports = {
  downloadBackup
}