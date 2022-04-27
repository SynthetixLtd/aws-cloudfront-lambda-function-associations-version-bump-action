module.exports = (Id, cf) => {
  return new Promise((resolve, reject) => {
    cf.getDistributionConfig({ Id }, (err, data) => {
      if (err) return reject(err, err.stack);
      resolve(data);
    });
  })
}

