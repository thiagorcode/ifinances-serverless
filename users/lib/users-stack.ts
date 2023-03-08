//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html
import * as lambda from 'aws-cdk-lib/aws-lambda';

//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs';

//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ssm from 'aws-cdk-lib/aws-ssm';

import { Construct } from 'constructs';

export class UsersStack extends cdk.Stack {
  readonly usersFunctionHandler: lambdaNodeJS.NodejsFunction;
  // readonly productsDdb: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // this.productsDdb = new dynamodb.Table(this, "ProductsDdb", {
    //    tableName: "products",
    //    removalPolicy: cdk.RemovalPolicy.DESTROY,
    //    partitionKey: {
    //       name: "id",
    //       type: dynamodb.AttributeType.STRING
    //    },
    //    billingMode: dynamodb.BillingMode.PROVISIONED,
    //    readCapacity: 1,
    //    writeCapacity: 1
    // })

    this.usersFunctionHandler = new lambdaNodeJS.NodejsFunction(
      this,
      'UsersFunctionHandler',
      {
        functionName: 'UsersFunction',
        entry: 'src/functions/getByUserId/handler.ts',
        handler: 'handler',
        memorySize: 128,
        timeout: cdk.Duration.seconds(5),
        bundling: {
          minify: true,
          sourceMap: false,
        },
        // environment: {
        //   PRODUCTS_DDB: this.productsDdb.tableName,
        // },
      }
    );
    // this.productsDdb.grantReadData(this.productsFetchHandler);

    // this.productsDdb.grantWriteData(this.productsAdminHandler);
  }
}
