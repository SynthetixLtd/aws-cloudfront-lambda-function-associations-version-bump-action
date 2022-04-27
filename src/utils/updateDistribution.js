module.exports = (payload, cf) => {
  return new Promise((resolve, reject) => {
    cf.updateDistribution(payload, (err, data) => {
      if (err) return reject(err, err.stack);
      resolve(data);
    });
  })
}

