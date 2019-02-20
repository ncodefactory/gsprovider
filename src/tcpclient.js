import Net from 'net';

const tcpclient = (host, port, timeout = 3000) => {
  const client = Net.Socket();
  client.setTimeout(timeout);
  return request => new Promise((resolve, reject) => {
    if (!Buffer.isBuffer(request)) {
      client.destroy();
      reject(new Error('Request must be of Buffer type.'));
    }

    client.on('connect', () => {
      client.write(request);
    });

    client.on('data', (data) => {
      client.end();
      client.destroy();
      resolve(data);
    });

    client.on('error', (error) => {
      client.end();
      client.destroy();
      reject(error);
    });

    client.on('timeout', () => {
      client.end();
      client.destroy();
      reject(new Error(`Timeout. Server not responsed by specified (${timeout} milliseconds) time.`));
    });

    client.connect({ port, host });
  });
};

export default tcpclient;
