const AWS = require("aws-sdk");
const core = require("@actions/core");

const updateDistribution = require("./utils/updateDistribution");
const getDistributionConfig = require("./utils/getDistributionConfig");

const main = async () => {
  try {
    const distributionId = core.getInput("DISTRIBUTION_ID", { required: true });
    const eventType = core.getInput("EVENT_TYPE", { required: true });
    const accessKeyId = core.getInput("ACCESS_KEY_ID", { required: true });
    const secretAccessKey = core.getInput("SECRET_ACCESS_KEY", {
      required: true,
    });

    /**
     * Lambda<@>Edge functions are always stored / managed
     * via US East (N. Virginia) AWS region
     */

    AWS.config.update({
      region: "us-east-1",
      accessKeyId,
      secretAccessKey,
    });

    const cloudfront = new AWS.CloudFront();

    /**
     * CloudFront distribution needs to be fetched before making updates
     * to the configuration, the out is the input and changes to the configuration
     * need to made to this template
     */

    const config = await getDistributionConfig(distributionId, cloudfront);

    /**
     * Checking if there are any lambda functions associated with this
     * CloudFront distribution
     */

    const lambdaFunctionAssociations =
      config.DistributionConfig.DefaultCacheBehavior.LambdaFunctionAssociations;

    if (!lambdaFunctionAssociations.Quantity) {
      return core.setFailed(
        `The CloudFront distribution which was sent has no associated lambda functions`
      );
    }

    const { Items } = lambdaFunctionAssociations;

    /**
     * Checking if the found lambda function associations
     * match the event type which was passed
     */

    const index = Items.findIndex((x) => {
      return x.EventType == eventType;
    });

    if (!Items[index]) {
      return core.setFailed(
        `The CloudFront distribution which was sent has no associated lambda functions for the event type ${eventType}`
      );
    }

    let arn = Items[index].LambdaFunctionARN;
    let version = arn.split(":").pop();

    config.DistributionConfig.DefaultCacheBehavior.LambdaFunctionAssociations.Items[
      index
    ].LambdaFunctionARN =
      arn.slice(0, -Number(version)) + (Number(version) + 1);

    await updateDistribution(config, cloudfront);

    /**
     * Sets The version as an output
     */

    core.setOutput("version", version);
  } catch (e) {
    core.setFailed(e.message);
  }
};

main();
