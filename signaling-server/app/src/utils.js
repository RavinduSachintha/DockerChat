/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


function getSocketOptions() {
  let corsClientOrigins = (process.env.CLIENT_ORIGINS || "").replaceAll('"', '').split(",").filter(val => val.length !== 0);

  return {
    cors: {
      origins: corsClientOrigins,
    },
  }
}

module.exports = { normalizePort, getSocketOptions };
