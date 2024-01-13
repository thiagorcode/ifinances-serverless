.PHONY: build-CreateTransactionFunction build-FindTransactionFunction build-FindByUserIdTransactionFunction build-FindAllTransactionFunction build-FindLastTransactionFunction
.PHONY: build-SQSReportsTransactionCategoryFunction build-DDBStreamReportsTransactionFunction build-SQSReportsTransactionCardFunction build-SQSReportsTransactionMonthlyFunction
.PHONY: build-UpdateTransactionFunction build-UpdateTransactionFunction
.PHONY: build-RuntimeDependenciesLayer build-lambda-common 

build-CreateTransactionFunction:
	$(MAKE) HANDLER=src/handlers/create.ts build-lambda-common

build-FindTransactionFunction:
	$(MAKE) HANDLER=src/handlers/find.ts build-lambda-common

build-FindByUserIdTransactionFunction:
	$(MAKE) HANDLER=src/handlers/findByUserId.ts build-lambda-common

build-FindLastTransactionFunction:
	$(MAKE) HANDLER=src/handlers/findLast.ts build-lambda-common

build-FindAllTransactionFunction:
	$(MAKE) HANDLER=src/handlers/findAll.ts build-lambda-common

build-DeleteTransactionFunction:
	$(MAKE) HANDLER=src/handlers/delete.ts build-lambda-common

build-UpdateTransactionFunction:
	$(MAKE) HANDLER=src/handlers/update.ts build-lambda-common

build-DDBStreamReportsTransactionFunction:
	$(MAKE) HANDLER=src/handlers/ddbStreamReportsTransactions.ts build-lambda-common

build-SQSReportsTransactionMonthlyFunction:
	$(MAKE) HANDLER=src/handlers/sqsReportsTransactionsMonthly.ts build-lambda-common

build-SQSReportsTransactionCategoryFunction:
	$(MAKE) HANDLER=src/handlers/sqsReportsTransactionsCategory.ts build-lambda-common

build-SQSReportsTransactionCardFunction:
	$(MAKE) HANDLER=src/handlers/sqsReportsTransactionsCard.ts build-lambda-common

build-SQSCreateTransactionFunction:
	$(MAKE) HANDLER=src/handlers/sqsCreateTransaction.ts build-lambda-common

build-lambda-common:
	npm install
	rm -rf dist
	echo "{\"extends\": \"./tsconfig.json\", \"include\": [\"${HANDLER}\"] }" > tsconfig-only-handler.json
	npm run build -- --build tsconfig-only-handler.json
	cp -r dist "$(ARTIFACTS_DIR)/"

build-RuntimeDependenciesLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --silent --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json" # to avoid rebuilding when changes aren't related to dependencies
	rm -rf "$(ARTIFACTS_DIR)/nodejs/node_modules/aws-sdk"

build-deploy-common:
	sam build -t services-transactions.yml
	cp -r ./samconfig.toml .aws-sam/build
	$(eval PARAMS := $(shell cat "params.$(env).json" | jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]'))
	cd .aws-sam/build && sam deploy --on-failure DELETE --region sa-east-1 --config-env dev
